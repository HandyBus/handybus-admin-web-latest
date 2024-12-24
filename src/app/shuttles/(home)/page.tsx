import { ShuttleListSchema } from '@/types/shuttle.type';
import ShuttleTable from './components/ShuttleTable';
import { instance } from '@/services/config';

async function getShuttles() {
  const response = await instance.get('/shuttle-operation/shuttles');
  return ShuttleListSchema.parse(response.data.shuttleDetails);
}

const ShuttlePage = async () => {
  const shuttles = await getShuttles();
  return <ShuttleTable shuttles={shuttles} />;
};

export default ShuttlePage;
