'use client';

import { useState } from 'react';
import { Dialog, DialogPanel } from '@headlessui/react';
import BlueButton from '../link/BlueButton';
import { RegionHub } from '@/types/hub.type';
import { useGetRegionHub } from '@/services/location.service';

interface Props {
  regionId: string;
  regionHubId: string;
}

const RegionHubViewerModal = ({ regionId, regionHubId }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data, isLoading, error } = useGetRegionHub(regionId, regionHubId);

  return (
    <>
      <BlueButton onClick={() => setIsOpen(true)}>{data?.name}</BlueButton>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        transition
        className="fixed inset-0 flex w-screen items-center justify-center bg-black/30 p-4 transition duration-75 ease-out data-[closed]:opacity-0"
      >
        <DialogPanel className="p-8">
          {isLoading && <div>Loading...</div>}
          {error && <div>Error: {error.message}</div>}
          {data && <RegionHubViewer regionHub={data} />}
        </DialogPanel>
      </Dialog>
    </>
  );
};

export default RegionHubViewerModal;

////////////////// regionHubViewer //////////////////

const RegionHubViewer = ({ regionHub }: { regionHub: RegionHub }) => {
  return (
    <div className="rounded-lg bg-white p-8">
      <div>지역 ID: {regionHub.regionId}</div>
      <div>지역 거점지 ID: {regionHub.regionHubId}</div>
      <div>이름: {regionHub.name}</div>
      <div>주소: {regionHub.address}</div>
    </div>
  );
};
