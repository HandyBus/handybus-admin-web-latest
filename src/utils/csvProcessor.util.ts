import {
  postAdminRequestRefund,
  postCompleteRefundRequest,
} from '@/services/payment.service';

export interface CsvRow {
  shuttleRouteName: string;
  type: string;
  userId: string;
  reservationId: string;
  paymentId: string;
  name: string;
  phoneNumber: string;
  principalAmount: string;
  paymentAmount: string;
  passengerCount: string;
  priceToBeChanged: string;
  refundAmount: string;
}

export interface ProcessedCsvRow {
  shuttleRouteName: string;
  type: string;
  userId: string;
  reservationId: string;
  paymentId: string;
  name: string;
  phoneNumber: string;
  principalAmount: number;
  paymentAmount: number;
  passengerCount: number;
  priceToBeChanged: number;
  refundAmount: number;
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
      shuttleRouteName: values[0] || '',
      type: values[1] || '',
      userId: values[2] || '',
      reservationId: values[3] || '',
      paymentId: values[4] || '',
      name: values[5] || '',
      phoneNumber: values[6] || '',
      principalAmount: values[7] || '',
      paymentAmount: values[8] || '',
      passengerCount: values[9] || '',
      priceToBeChanged: values[10] || '',
      refundAmount: values[11] || '',
    };

    try {
      // 1. payment_id가 있는지 확인한다.
      if (!row.paymentId) {
        processedRows.push({
          shuttleRouteName: row.shuttleRouteName,
          type: row.type,
          userId: row.userId,
          reservationId: row.reservationId,
          paymentId: '',
          name: row.name,
          phoneNumber: row.phoneNumber,
          principalAmount:
            parseFloat(row.principalAmount.replace(/,/g, '')) || 0,
          paymentAmount: parseFloat(row.paymentAmount.replace(/,/g, '')) || 0,
          passengerCount: parseInt(row.passengerCount) || 0,
          priceToBeChanged:
            parseFloat(row.priceToBeChanged.replace(/,/g, '')) || 0,
          refundAmount: parseFloat(row.refundAmount.replace(/,/g, '')) || 0,
          processingStatus: 'error',
          errorMessage: '결제 ID가 없습니다.',
        });
        continue;
      }

      // 환불 금액 계산 (CSV의 "refund_amount" 컬럼 사용)
      const refundAmount = parseFloat(row.refundAmount.replace(/,/g, '')) || 0;

      if (refundAmount <= 0) {
        processedRows.push({
          shuttleRouteName: row.shuttleRouteName,
          type: row.type,
          userId: row.userId,
          reservationId: row.reservationId,
          paymentId: row.paymentId,
          name: row.name,
          phoneNumber: row.phoneNumber,
          principalAmount:
            parseFloat(row.principalAmount.replace(/,/g, '')) || 0,
          paymentAmount: parseFloat(row.paymentAmount.replace(/,/g, '')) || 0,
          passengerCount: parseInt(row.passengerCount) || 0,
          priceToBeChanged:
            parseFloat(row.priceToBeChanged.replace(/,/g, '')) || 0,
          refundAmount: refundAmount,
          processingStatus: 'skipped',
          errorMessage: '환불 금액이 0원 이하입니다.',
        });
        continue;
      }

      // 2. payment_id를 사용하여 환불 API를 요청한다.
      const refundRequest = await postAdminRequestRefund(row.paymentId, {
        refundAmount: refundAmount,
        refundReason: 'CxM 가격 인하로 인한 환불',
        type: 'ADMIN_ADJUSTMENT', // 관리자 조정으로 인한 환불
      });

      // 환불 완료 API 호출
      await postCompleteRefundRequest(
        row.paymentId,
        refundRequest.refundRequestId,
        {
          refundAmount: refundAmount,
        },
      );

      // 3. 처리 결과를 csv 항목으로 추가해둔다.
      const processedRow: ProcessedCsvRow = {
        shuttleRouteName: row.shuttleRouteName,
        type: row.type,
        userId: row.userId,
        reservationId: row.reservationId,
        paymentId: row.paymentId,
        name: row.name,
        phoneNumber: row.phoneNumber,
        principalAmount: parseFloat(row.principalAmount.replace(/,/g, '')) || 0,
        paymentAmount: parseFloat(row.paymentAmount.replace(/,/g, '')) || 0,
        passengerCount: parseInt(row.passengerCount) || 0,
        priceToBeChanged:
          parseFloat(row.priceToBeChanged.replace(/,/g, '')) || 0,
        refundAmount: refundAmount,
        processingStatus: 'success',
        refundRequestId: refundRequest.refundRequestId,
        refundStatus: 'COMPLETED',
      };

      processedRows.push(processedRow);
    } catch (error) {
      console.error(
        `Error processing refund for payment ${row.paymentId}:`,
        error,
      );
      processedRows.push({
        shuttleRouteName: row.shuttleRouteName,
        type: row.type,
        userId: row.userId,
        reservationId: row.reservationId,
        paymentId: row.paymentId,
        name: row.name,
        phoneNumber: row.phoneNumber,
        principalAmount: parseFloat(row.principalAmount.replace(/,/g, '')) || 0,
        paymentAmount: parseFloat(row.paymentAmount.replace(/,/g, '')) || 0,
        passengerCount: parseInt(row.passengerCount) || 0,
        priceToBeChanged:
          parseFloat(row.priceToBeChanged.replace(/,/g, '')) || 0,
        refundAmount: parseFloat(row.refundAmount.replace(/,/g, '')) || 0,
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
    '셔틀 노선명',
    '타입',
    '유저 ID',
    '예약 ID',
    '결제 ID',
    '예약자명',
    '전화번호',
    '원금액',
    '결제 금액',
    '승객 수',
    '변경될 가격',
    '환불 금액',
    '처리 상태',
    '환불 요청 ID',
    '환불 상태',
    '오류 메시지',
  ];

  const csvRows = rows.map((row) => [
    row.shuttleRouteName,
    row.type,
    row.userId,
    row.reservationId,
    row.paymentId,
    row.name,
    row.phoneNumber,
    row.principalAmount.toString(),
    row.paymentAmount.toString(),
    row.passengerCount.toString(),
    row.priceToBeChanged.toString(),
    row.refundAmount.toString(),
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
    totalPrincipalAmount: rows
      .filter((row) => row.principalAmount)
      .reduce((sum, row) => sum + row.principalAmount, 0),
    totalPaymentAmount: rows
      .filter((row) => row.paymentAmount)
      .reduce((sum, row) => sum + row.paymentAmount, 0),
    totalRefundAmount: rows
      .filter((row) => row.refundAmount)
      .reduce((sum, row) => sum + row.refundAmount, 0),
    totalProcessedRefundAmount: rows
      .filter((row) => row.processingStatus === 'success' && row.refundAmount)
      .reduce((sum, row) => sum + row.refundAmount, 0),
    completedRefunds: rows.filter((row) => row.refundStatus === 'COMPLETED')
      .length,
    failedRefunds: rows.filter((row) => row.refundStatus === 'FAILED').length,
  };

  return stats;
};
