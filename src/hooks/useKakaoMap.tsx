import Script from 'next/script';

interface Props {
  onReady?: () => void;
}

const useKakaoMap = ({ onReady }: Props = {}) => {
  const KakaoScript = () => (
    <Script
      id="kakao-maps-sdk"
      strategy="afterInteractive"
      src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY}&autoload=false&libraries=services`}
      onReady={onReady}
    />
  );

  return { KakaoScript };
};

export default useKakaoMap;
