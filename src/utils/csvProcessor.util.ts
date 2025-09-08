import { getReservation } from '@/services/reservation.service';
import {
  postAdminRequestRefund,
  postCompleteRefundRequest,
} from '@/services/payment.service';

export interface CsvRow {
  timestamp: string;
  name: string;
  phoneNumber: string;
  evidence: string;
  emergencyContact: string;
  refundCase: string;
  userId: string;
  reservationId: string;
  paymentAmount: string;
  fromDestinationPaymentAmount: string;
  refundAmount: string;
  additionalRefundAmount: string;
  additionalCost: string;
  remarks: string;
}

export interface ProcessedCsvRow {
  timestamp: string;
  name: string;
  phoneNumber: string;
  evidence: string;
  emergencyContact: string;
  refundCase: string;
  userId: string;
  reservationId: string;
  paymentAmount: number;
  returnPaymentAmount: number;
  returnRefundAmount: number;
  additionalRefundAmount: number;
  additionalCost: number;
  remarks: string;
  processingStatus?: 'success' | 'skipped' | 'error';
  errorMessage?: string;
  refundRequestId?: string;
  refundStatus?: 'REQUESTED' | 'COMPLETED' | 'FAILED';
}

export const parseCsvLine = (line: string): string[] => {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
};

const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const processCsvFile = async (
  csvContent: string,
): Promise<ProcessedCsvRow[]> => {
  const lines = csvContent.split('\n');
  const dataLines = lines.slice(1).filter((line) => line.trim());

  const processedRows: ProcessedCsvRow[] = [];

  for (let i = 0; i < dataLines.length; i++) {
    const line = dataLines[i];
    const values = parseCsvLine(line);

    const row: CsvRow = {
      timestamp: values[0],
      name: values[1],
      phoneNumber: values[2],
      evidence: values[3],
      emergencyContact: values[4],
      refundCase: values[5],
      userId: values[6],
      reservationId: values[7],
      paymentAmount: values[8],
      fromDestinationPaymentAmount: values[9],
      refundAmount: values[10],
      additionalRefundAmount: values[11] || '',
      additionalCost: values[12] || '',
      remarks: values[13] || '',
    };

    try {
      // 1. 예약 ID를 기반으로 reservation을 조회한다.
      if (!row.reservationId) {
        processedRows.push({
          timestamp: row.timestamp,
          name: row.name,
          phoneNumber: row.phoneNumber,
          evidence: row.evidence,
          emergencyContact: row.emergencyContact,
          refundCase: row.refundCase,
          userId: row.userId,
          reservationId: '',
          paymentAmount: 0,
          returnPaymentAmount: 0,
          returnRefundAmount: 0,
          additionalRefundAmount:
            parseFloat(row.additionalRefundAmount.replace(/,/g, '')) || 0,
          additionalCost: parseFloat(row.additionalCost.replace(/,/g, '')) || 0,
          remarks: row.remarks,
          processingStatus: 'error',
          errorMessage: '예약 ID가 없습니다.',
        });
        continue;
      }

      const reservationData = await getReservation(row.reservationId);
      const reservation = reservationData.reservation;

      if (!reservation) {
        processedRows.push({
          timestamp: row.timestamp,
          name: row.name,
          phoneNumber: row.phoneNumber,
          evidence: row.evidence,
          emergencyContact: row.emergencyContact,
          refundCase: row.refundCase,
          userId: row.userId,
          reservationId: row.reservationId,
          paymentAmount: 0,
          returnPaymentAmount: 0,
          returnRefundAmount: 0,
          additionalRefundAmount:
            parseFloat(row.additionalRefundAmount.replace(/,/g, '')) || 0,
          additionalCost: parseFloat(row.additionalCost.replace(/,/g, '')) || 0,
          remarks: row.remarks,
          processingStatus: 'error',
          errorMessage: '예약을 찾을 수 없습니다.',
        });
        continue;
      }

      // 2. 찾아진 reservation에서 paymentId를 가져와 환불 api를 요청한다.
      if (!reservation.paymentId) {
        processedRows.push({
          timestamp: row.timestamp,
          name: row.name,
          phoneNumber: row.phoneNumber,
          evidence: row.evidence,
          emergencyContact: row.emergencyContact,
          refundCase: row.refundCase,
          userId: reservation.userId,
          reservationId: reservation.reservationId,
          paymentAmount: reservation.paymentAmount || 0,
          returnPaymentAmount: 0,
          returnRefundAmount: 0,
          additionalRefundAmount:
            parseFloat(row.additionalRefundAmount.replace(/,/g, '')) || 0,
          additionalCost: parseFloat(row.additionalCost.replace(/,/g, '')) || 0,
          remarks: row.remarks,
          processingStatus: 'error',
          errorMessage: '결제 정보가 없습니다.',
        });
        continue;
      }

      // 환불 금액 계산 (CSV의 "추가 환불 금액" 컬럼 사용)
      const refundAmount =
        parseFloat(row.additionalRefundAmount.replace(/,/g, '')) || 0;

      if (refundAmount <= 0) {
        processedRows.push({
          timestamp: row.timestamp,
          name: row.name,
          phoneNumber: row.phoneNumber,
          evidence: row.evidence,
          emergencyContact: row.emergencyContact,
          refundCase: row.refundCase,
          userId: reservation.userId,
          reservationId: reservation.reservationId,
          paymentAmount: reservation.paymentAmount || 0,
          returnPaymentAmount: 0,
          returnRefundAmount: 0,
          additionalRefundAmount:
            parseFloat(row.additionalRefundAmount.replace(/,/g, '')) || 0,
          additionalCost: parseFloat(row.additionalCost.replace(/,/g, '')) || 0,
          remarks: row.remarks,
          processingStatus: 'skipped',
          errorMessage: '추가 환불 금액이 0원 이하입니다.',
        });
        continue;
      }

      // 환불 요청 API 호출
      const refundRequest = await postAdminRequestRefund(
        reservation.paymentId,
        {
          refundAmount: refundAmount,
          refundReason: '데이식스 환불',
          type: 'ADMIN_ADJUSTMENT', // 관리자 조정으로 인한 환불
        },
      );

      // 환불 완료 API 호출
      await postCompleteRefundRequest(
        reservation.paymentId,
        refundRequest.refundRequestId,
        {
          refundAmount: refundAmount,
        },
      );

      // 3. 처리 결과를 csv 항목으로 추가해둔다.
      const processedRow: ProcessedCsvRow = {
        timestamp: row.timestamp,
        name: row.name,
        phoneNumber: row.phoneNumber,
        evidence: row.evidence,
        emergencyContact: row.emergencyContact,
        refundCase: row.refundCase,
        userId: reservation.userId,
        reservationId: reservation.reservationId,
        paymentAmount: reservation.paymentAmount || 0,
        returnPaymentAmount:
          parseFloat(row.paymentAmount.replace(/,/g, '')) || 0,
        returnRefundAmount: parseFloat(row.refundAmount.replace(/,/g, '')) || 0,
        additionalRefundAmount: refundAmount,
        additionalCost: parseFloat(row.additionalCost.replace(/,/g, '')) || 0,
        remarks: row.remarks,
        processingStatus: 'success',
        refundRequestId: refundRequest.refundRequestId,
        refundStatus: 'COMPLETED',
      };

      processedRows.push(processedRow);
    } catch (error) {
      console.error(
        `Error processing refund for reservation ${row.reservationId}:`,
        error,
      );
      processedRows.push({
        timestamp: row.timestamp,
        name: row.name,
        phoneNumber: row.phoneNumber,
        evidence: row.evidence,
        emergencyContact: row.emergencyContact,
        refundCase: row.refundCase,
        userId: row.userId,
        reservationId: row.reservationId,
        paymentAmount: 0,
        returnPaymentAmount: 0,
        returnRefundAmount: 0,
        additionalRefundAmount:
          parseFloat(row.additionalRefundAmount.replace(/,/g, '')) || 0,
        additionalCost: parseFloat(row.additionalCost.replace(/,/g, '')) || 0,
        remarks: row.remarks,
        processingStatus: 'error',
        errorMessage:
          error instanceof Error
            ? error.message
            : '알 수 없는 오류가 발생했습니다.',
        refundStatus: 'FAILED',
      });
    }

    // 50개씩 처리한 후 1분 대기
    if ((i + 1) % 50 === 0) {
      console.log(`${i + 1}개 항목 처리 완료. 1분 대기 중...`);
      await sleep(60 * 1000); // 1분 = 60,000ms
      console.log('대기 완료. 다음 50개 항목 처리 시작...');
    }
  }

  return processedRows;
};

export const convertToCsv = (rows: ProcessedCsvRow[]): string => {
  const headers = [
    '타임스탬프',
    '예약자명',
    '전화번호',
    '증빙자료',
    '비상연락망',
    '환불 케이스 선택',
    '유저 ID',
    '예약 ID',
    '결제 금액',
    '귀가행 결제 금액',
    '귀가행 환불 금액',
    '추가 환불 금액',
    '추가 비용',
    '비고',
    '처리 상태',
    '환불 요청 ID',
    '환불 상태',
    '오류 메시지',
  ];

  const csvRows = rows.map((row) => [
    row.timestamp,
    row.name,
    row.phoneNumber,
    row.evidence,
    row.emergencyContact,
    row.refundCase,
    row.userId,
    row.reservationId,
    row.paymentAmount.toString(),
    row.returnPaymentAmount.toString(),
    row.returnRefundAmount.toString(),
    row.additionalRefundAmount.toString(),
    row.additionalCost.toString(),
    row.remarks,
    row.processingStatus || '',
    row.refundRequestId || '',
    row.refundStatus || '',
    row.errorMessage || '',
  ]);

  return [headers, ...csvRows]
    .map((row) => row.map((field) => `"${field}"`).join(','))
    .join('\n');
};

export const downloadCsv = (csvContent: string, filename: string) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const getProcessingStats = (rows: ProcessedCsvRow[]) => {
  const stats = {
    total: rows.length,
    success: rows.filter((row) => row.processingStatus === 'success').length,
    skipped: rows.filter((row) => row.processingStatus === 'skipped').length,
    errors: rows.filter((row) => row.processingStatus === 'error').length,
    totalReturnPaymentAmount: rows
      .filter((row) => row.returnPaymentAmount)
      .reduce((sum, row) => sum + row.returnPaymentAmount, 0),
    totalRefundAmount: rows
      .filter((row) => row.returnRefundAmount)
      .reduce((sum, row) => sum + row.returnRefundAmount, 0),
    totalAdditionalRefundAmount: rows
      .filter((row) => row.additionalRefundAmount)
      .reduce((sum, row) => sum + row.additionalRefundAmount, 0),
    totalProcessedRefundAmount: rows
      .filter(
        (row) =>
          row.processingStatus === 'success' && row.additionalRefundAmount,
      )
      .reduce((sum, row) => sum + row.additionalRefundAmount, 0),
    completedRefunds: rows.filter((row) => row.refundStatus === 'COMPLETED')
      .length,
    failedRefunds: rows.filter((row) => row.refundStatus === 'FAILED').length,
  };

  return stats;
};
