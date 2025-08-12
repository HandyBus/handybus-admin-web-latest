'use client';

import Button from '@/components/button/Button';
import Dropdown from '@/components/input/Dropdown';
import {
  BIG_REGIONS,
  BIG_REGIONS_TO_SHORT_NAME,
  BigRegionsType,
  ID_TO_REGION,
} from '@/constants/regions';
import { useGetRegionHubs } from '@/services/hub.service';
import { HubUsageType, RegionHubsViewEntity } from '@/types/hub.type';
import { ReactNode, useMemo, useState } from 'react';

interface Props {
  hubUsageTypes: HubUsageType[];
  regionHub: RegionHubsViewEntity | null;
  setRegionHub: (value: RegionHubsViewEntity | null) => void;
}

const RegionHubInput = ({ hubUsageTypes, regionHub, setRegionHub }: Props) => {
  const { data: hubs, isLoading } = useGetRegionHubs({
    options: {
      usageType: hubUsageTypes,
    },
  });

  const [selectedBigRegion, setSelectedBigRegion] =
    useState<BigRegionsType | null>(null);

  const filteredHubs = useMemo(() => {
    if (!hubs) {
      return [];
    }

    const flatHubs = hubs.pages.flatMap((page) => page.regionHubs);

    if (!selectedBigRegion) {
      return flatHubs;
    }

    return flatHubs.filter((hub) => {
      const currentRegionId = hub.regionId;
      const currentRegion = ID_TO_REGION[currentRegionId];
      return currentRegion?.bigRegion === selectedBigRegion;
    });
  }, [selectedBigRegion, hubs]);

  return (
    <div className="flex flex-col gap-16">
      <div>
        <div className="grid grid-cols-4 gap-8 pb-8">
          {BIG_REGIONS.slice(0, 4).map((region) => (
            <BigRegionButton
              key={region}
              onClick={() => setSelectedBigRegion(region)}
              isSelected={selectedBigRegion === region}
            >
              {BIG_REGIONS_TO_SHORT_NAME[region]}
            </BigRegionButton>
          ))}
        </div>
        <div className="grid grid-cols-6 gap-8">
          {BIG_REGIONS.slice(4).map((region) => (
            <BigRegionButton
              key={region}
              onClick={() => setSelectedBigRegion(region)}
              isSelected={selectedBigRegion === region}
            >
              {BIG_REGIONS_TO_SHORT_NAME[region]}
            </BigRegionButton>
          ))}
        </div>
      </div>
      <Dropdown
        value={regionHub}
        onChange={setRegionHub}
        options={filteredHubs}
        getOptionLabel={(hub) => hub.name}
        getOptionValue={(hub) => hub.regionId}
        placeholder="행사장을 선택해주세요"
        isLoading={isLoading}
      />
    </div>
  );
};

export default RegionHubInput;

interface BigRegionButtonProps {
  children: ReactNode;
  onClick: () => void;
  isSelected: boolean;
}

const BigRegionButton = ({
  children,
  onClick,
  isSelected,
}: BigRegionButtonProps) => {
  return (
    <Button
      type="button"
      size="large"
      variant={isSelected ? 'primary' : 'tertiary'}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};
