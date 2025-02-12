import { useEffect } from 'react';

const KAKAO_MAP_SCRIPT_ID = 'kakao-map-script';

interface Props {
  onReady?: () => void;
  libraries?: string[];
}

const useKakaoMap = ({ onReady, libraries = [] }: Props = {}) => {
  useEffect(() => {
    const isScript = document.getElementById(KAKAO_MAP_SCRIPT_ID);
    const mapScript = document.createElement('script');

    const librariesString = libraries?.join(',');

    if (!isScript) {
      mapScript.id = KAKAO_MAP_SCRIPT_ID;
      mapScript.async = true;
      mapScript.type = 'text/javascript';
      mapScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY}&autoload=false&libraries=${librariesString}`;
      document.head.appendChild(mapScript);
    }

    mapScript.addEventListener('load', () => {
      onReady?.();
    });

    return () => {
      mapScript.removeEventListener('load', () => onReady?.());
    };
  }, []);
};

export default useKakaoMap;
