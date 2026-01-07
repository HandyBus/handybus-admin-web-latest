'use client';

import { useState } from 'react';
import {
  processCsvFile,
  convertToCsv,
  downloadCsv,
  getProcessingStats,
  ProcessedCsvRow,
} from '@/utils/csvProcessor.util';
import dayjs from 'dayjs';

const Page = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ProcessedCsvRow[]>([]);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setProgress(0);
    setResult([]);

    try {
      const csvContent = await file.text();
      setProgress(25);

      const processedData = await processCsvFile(csvContent);
      setProgress(100);
      setResult(processedData);
    } catch (error) {
      console.error('Error processing file:', error);
      alert('파일 처리 중 오류가 발생했습니다.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (result.length === 0) return;

    const csvContent = convertToCsv(result);
    const timestamp = dayjs()
      .tz('Asia/Seoul')
      .toISOString()
      .slice(0, 19)
      .replace(/:/g, '-');
    const filename = `refund_processed_data_${timestamp}.csv`;

    downloadCsv(csvContent, filename);
  };

  return (
    <div className="mx-auto max-w-4xl p-8">
      <h1 className="text-2xl font-bold mb-6">환불 처리 CSV 데이터 처리</h1>

      <div className="mb-6">
        <label className="text-sm font-medium mb-2 block">
          CSV 파일 업로드
        </label>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          disabled={isProcessing}
          className="text-sm text-gray-500 file:py-2 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 block w-full file:mr-4 file:rounded-full file:border-0 file:px-4"
        />
      </div>

      {isProcessing && (
        <div className="mb-6">
          <div className="bg-gray-200 h-2.5 rounded-full">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">처리 중... {progress}%</p>
        </div>
      )}

      {result.length > 0 && (
        <div className="mb-6">
          <div className="bg-green-50 border-green-200 rounded-lg mb-4 border p-4">
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              데이터 처리 완료
            </h3>
            {(() => {
              const stats = getProcessingStats(result);
              return (
                <div className="space-y-1">
                  <p className="text-green-700">
                    총 {stats.total}개의 항목이 처리되었습니다.
                  </p>
                  <p className="text-green-700">성공: {stats.success}개</p>
                  <p className="text-yellow-700">건너뜀: {stats.skipped}개</p>
                  <p className="text-red-700">오류: {stats.errors}개</p>
                  <p className="text-blue-700 font-semibold">
                    총 원금액: {stats.totalPrincipalAmount.toLocaleString()}원
                  </p>
                  <p className="text-purple-700 font-semibold">
                    총 결제 금액: {stats.totalPaymentAmount.toLocaleString()}원
                  </p>
                  <p className="text-orange-700 font-semibold">
                    총 환불 금액: {stats.totalRefundAmount.toLocaleString()}원
                  </p>
                  <p className="text-green-700 font-semibold">
                    실제 처리된 환불 금액:{' '}
                    {stats.totalProcessedRefundAmount.toLocaleString()}원
                  </p>
                  <p className="text-indigo-700 font-semibold">
                    완료된 환불: {stats.completedRefunds}개
                  </p>
                  <p className="text-red-700 font-semibold">
                    실패한 환불: {stats.failedRefunds}개
                  </p>
                </div>
              );
            })()}
          </div>

          <button
            onClick={handleDownload}
            className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 px-4 transition-colors"
          >
            환불 처리된 데이터 다운로드
          </button>
        </div>
      )}

      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-3">처리 과정</h3>

        <ol className="space-y-2 text-sm text-gray-700 list-inside list-decimal">
          <li>CSV 파일에서 payment_id를 확인한다.</li>
          <li>
            payment_id와 &apos;환불 금액&apos;을 사용하여 환불 API를 요청한다.
          </li>
          <li>처리 결과를 CSV 항목으로 추가해둔다.</li>
          <li>각 처리들은 모두 무조건 순차적으로 진행되어야 한다.</li>
        </ol>
      </div>
    </div>
  );
};

export default Page;
