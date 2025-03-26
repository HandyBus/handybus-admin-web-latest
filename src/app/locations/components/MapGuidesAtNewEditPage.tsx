import Callout from '@/components/text/Callout';

const MapGuidesAtNewEditPage = () => {
  return (
    <Callout className="mx-16">
      <p>도움말</p>
      <ul>
        <li>1. 오른쪽 클릭 : 지도에 핀을 놓습니다.</li>
        <li>2. 노란색 핀들은 존재하는 정류장입니다.</li>
        <li>3. 더블클릭 : Zoom-in 효과</li>
      </ul>
    </Callout>
  );
};

export default MapGuidesAtNewEditPage;
