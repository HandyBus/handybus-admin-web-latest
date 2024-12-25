import BlueLink from '@/components/link/BlueLink';
import DataTable from '@/components/table/DataTable';
import { columns } from './types/table.type';
import { getAllShuttles } from '@/app/actions/shuttle.action';

const Page = async () => {
  const shuttles = await getAllShuttles();

  return (
    <main className="flex h-full w-full flex-col gap-16 bg-white">
      <header className="flex flex-row justify-between">
        <h1 className="text-[32px] font-500">셔틀 대시보드</h1>
        <BlueLink href="shuttles/new">추가하기</BlueLink>
      </header>
      <DataTable data={shuttles} columns={columns} />;
    </main>
  );
};

export default Page;
