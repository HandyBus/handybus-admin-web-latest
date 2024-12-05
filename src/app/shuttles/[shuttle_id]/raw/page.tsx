import { getShuttle } from '@/app/actions/shuttle.action';
import JSONViewer from '@/components/json/JSONViewer';

interface Props {
  params: { shuttle_id: string };
}

const Page = async ({ params: { shuttle_id } }: Props) => {
  const shuttle = await getShuttle(Number(shuttle_id));

  return <JSONViewer>{JSON.stringify(shuttle, null, 2)}</JSONViewer>;
};

export default Page;
