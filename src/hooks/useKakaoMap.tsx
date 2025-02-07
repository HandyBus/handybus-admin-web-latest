import Script from 'next/script';

interface Props {
  onReady?: () => void;
  libraries?: string[];
}

const useKakaoMap = ({ onReady, libraries = [] }: Props = {}) => {
  const KakaoScript = () => {
    const librariesString = libraries?.join(',');
    return (
      <Script
        id="kakao-maps-sdk"
        strategy="afterInteractive"
        src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY}&autoload=false&libraries=${librariesString}`}
        onReady={onReady}
      />
    );
  };

  return { KakaoScript };
};

export default useKakaoMap;
