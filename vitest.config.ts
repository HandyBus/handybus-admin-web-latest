import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom', // 서버 로직을 테스트하기 위해서는 'node' 환경이 필요합니다. 이후 필요시 특정 경로 및 파일명에서는 'node' 환경으로 테스트를 실행할 수 있습니다.
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
