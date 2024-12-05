import { instance } from '@/services/config';
import { HubList, RegionList } from '@/types/region.type';
import HubsTable from './table.page';

const Page = async () => {
  const hubs = await getAllHubs();
  return <HubsTable hubs={hubs} />;
};

export default Page;

const getAllHubs = async () => {
  const regions = RegionList.parse(
    (await instance.get('/location/admin/regions')).data.regions,
  );
  const hubs = (
    await Promise.all(
      regions.map(async (region) =>
        HubList.parse(
          (await instance.get(`/location/admin/regions/${region.ID}/hubs`)).data
            .regionHubs,
        ),
      ),
    )
  ).flat(1);
  return hubs;
  return [];
};
