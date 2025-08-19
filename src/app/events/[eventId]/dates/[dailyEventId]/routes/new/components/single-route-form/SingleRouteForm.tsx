'use client';
import PriceSection from './PriceSection';
import NameSection from './NameSection';
import MaxPassengerCountSection from './MaxPassengerCountSection';
import HubsSection from './HubsSection';
import Button from '@/components/button/Button';

interface Props {
  index: number;
  onAddRoute: () => void;
  onRemoveRoute: () => void;
  dailyEventDate: string;
  routeLength: number;
}

const SingleRouteForm = ({
  index,
  onAddRoute,
  onRemoveRoute,
  dailyEventDate,
  routeLength,
}: Props) => {
  return (
    <article className="flex flex-col gap-20">
      <NameSection index={index} />
      <MaxPassengerCountSection index={index} />
      <PriceSection index={index} />
      <HubsSection index={index} dailyEventDate={dailyEventDate} />
      <div className="grid grid-cols-[1fr_3fr] gap-8">
        <Button
          type="button"
          size="large"
          variant="tertiary"
          onClick={onRemoveRoute}
          disabled={routeLength === 1}
        >
          노선 삭제
        </Button>
        <Button
          type="button"
          size="large"
          variant="secondary"
          onClick={onAddRoute}
        >
          노선 추가
        </Button>
      </div>
    </article>
  );
};

export default SingleRouteForm;
