import Callout from '@/components/text/Callout';

const MapGuides = () => {
  return (
    <Callout className="mx-16">
      <p>도움말</p>
      <ul>
        <li>
          1. 오른쪽 클릭 : 지도에 핀을 놓습니다. 핀을 클릭하면 해당 정류장을
          생성하는 페이지가 열립니다.
        </li>
        <li>
          2. 노란색 핀들은 존재하는 정류장입니다. 마우스를 올리면 해당 정류장의
          이름이 표시됩니다. 클릭하면 해당 정류장의 수정 페이지로 이동합니다.
        </li>
        <li>3. 더블클릭 : Zoom-in 효과</li>
      </ul>
    </Callout>
  );
};

export default MapGuides;
