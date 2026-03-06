'use client';

import { useMemo, useState } from 'react';
import Heading from '@/components/text/Heading';
import DebouncedInput from '@/components/input/DebouncedInput';
import Button from '@/components/button/Button';
import ArtistGroupCard from './components/ArtistGroupCard';
import ArtistFormModal from './components/ArtistFormModal';
import DeleteConfirmDialog from './components/DeleteConfirmDialog';
import dayjs from 'dayjs';
import { DUMMY_ARTISTS } from './const/dummy-data.const';
import { ArtistViewEntity, FilterType, SortType } from './types';

const FILTER_OPTIONS: FilterType[] = ['전체', '하위있음', '하위없음'];
const SORT_OPTIONS: SortType[] = ['관계순', '이름순', '최신순'];

const Page = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('전체');
  const [sort, setSort] = useState<SortType>('관계순');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<ArtistViewEntity | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ArtistViewEntity | null>(
    null,
  );

  // 하위 아티스트 트리에서 검색어 매칭 여부를 재귀적으로 확인
  const hasDescendantMatch = (
    artist: ArtistViewEntity,
    lowerSearch: string,
  ): boolean => {
    if (!artist.childArtists) return false;
    return artist.childArtists.some((child) => {
      if (child.artistDisplayName.toLowerCase().includes(lowerSearch))
        return true;
      const fullChild = DUMMY_ARTISTS.find(
        (a) => a.artistId === child.artistId,
      );
      return fullChild ? hasDescendantMatch(fullChild, lowerSearch) : false;
    });
  };

  const topLevelArtists = useMemo(() => {
    let result = DUMMY_ARTISTS.filter(
      (artist) => !artist.parentArtists || artist.parentArtists.length === 0,
    );

    if (search) {
      const lowerSearch = search.toLowerCase();
      result = result.filter(
        (artist) =>
          artist.artistDisplayName.toLowerCase().includes(lowerSearch) ||
          hasDescendantMatch(artist, lowerSearch),
      );
    }

    if (filter === '하위있음') {
      result = result.filter(
        (artist) => artist.childArtists && artist.childArtists.length > 0,
      );
    } else if (filter === '하위없음') {
      result = result.filter(
        (artist) => !artist.childArtists || artist.childArtists.length === 0,
      );
    }

    if (sort === '이름순') {
      result = [...result].sort((a, b) =>
        a.artistDisplayName.localeCompare(b.artistDisplayName),
      );
    } else if (sort === '최신순') {
      result = [...result].sort((a, b) =>
        dayjs(b.updatedAt).diff(dayjs(a.updatedAt)),
      );
    }

    return result;
  }, [search, filter, sort]);

  return (
    <main>
      <Heading className="flex items-center justify-between">
        아티스트 관리
        <Button
          variant="primary"
          size="medium"
          onClick={() => {
            setEditTarget(null);
            setIsFormOpen(true);
          }}
        >
          + 추가하기
        </Button>
      </Heading>
      <div className="flex items-center gap-12 py-16">
        <DebouncedInput
          value={search}
          setValue={setSearch}
          placeholder="아티스트 검색..."
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as FilterType)}
          className="rounded-8 border border-basic-grey-200 px-12 py-8 text-14 focus:outline-brand-primary-300"
        >
          {FILTER_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortType)}
          className="rounded-8 border border-basic-grey-200 px-12 py-8 text-14 focus:outline-brand-primary-300"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-16">
        {topLevelArtists.map((artist) => (
          <ArtistGroupCard
            key={artist.artistId}
            artist={artist}
            allArtists={DUMMY_ARTISTS}
            searchQuery={search}
            onEdit={(a) => {
              setEditTarget(a);
              setIsFormOpen(true);
            }}
            onDelete={(a) => setDeleteTarget(a)}
          />
        ))}
        {topLevelArtists.length === 0 && (
          <p className="py-40 text-center text-basic-grey-500">
            검색 결과가 없습니다
          </p>
        )}
      </div>
      <ArtistFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        artist={editTarget}
        allArtists={DUMMY_ARTISTS}
      />
      <DeleteConfirmDialog
        artist={deleteTarget}
        onClose={() => setDeleteTarget(null)}
      />
    </main>
  );
};

export default Page;
