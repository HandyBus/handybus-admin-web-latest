'use client';

import { useEffect, useState } from 'react';
import { ChevronDownIcon, ChevronRightIcon, UsersIcon } from 'lucide-react';
import Button from '@/components/button/Button';
import type { ArtistViewEntity } from '../types';
import ArtistTreeView from './ArtistTreeView';
import ArtistFlatMemberView from './ArtistFlatMemberView';

interface Props {
  artist: ArtistViewEntity;
  allArtists: ArtistViewEntity[];
  searchQuery?: string;
  onEdit: (artist: ArtistViewEntity) => void;
  onDelete: (artist: ArtistViewEntity) => void;
}

type ViewMode = 'unit' | 'flat';

const ArtistGroupCard = ({
  artist,
  allArtists,
  searchQuery = '',
  onEdit,
  onDelete,
}: Props) => {
  const [expanded, setExpanded] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('unit');

  const hasChildren = artist.childArtists && artist.childArtists.length > 0;

  const { unitCount, memberCount, isMultiLevel } = (() => {
    if (!hasChildren)
      return { unitCount: 0, memberCount: 0, isMultiLevel: false };

    let units = 0;
    const memberIds = new Set<string>();

    const collectLeafIds = (entity: ArtistViewEntity) => {
      const children = entity.childArtists;
      if (!children || children.length === 0) return;
      for (const child of children) {
        const full = allArtists.find((a) => a.artistId === child.artistId);
        const hasSubChildren =
          full?.childArtists && full.childArtists.length > 0;
        if (hasSubChildren) {
          collectLeafIds(full!);
        } else {
          memberIds.add(child.artistId);
        }
      }
    };

    for (const child of artist.childArtists!) {
      const full = allArtists.find((a) => a.artistId === child.artistId);
      const hasSubChildren = full?.childArtists && full.childArtists.length > 0;
      if (hasSubChildren) {
        units++;
      }
    }

    collectLeafIds(artist);

    return {
      unitCount: units,
      memberCount: memberIds.size,
      isMultiLevel: units > 0,
    };
  })();

  // 하위 아티스트가 검색어에 매칭되면 자동 펼침
  const hasChildMatch =
    searchQuery.length > 0 &&
    hasChildren &&
    !artist.artistDisplayName.toLowerCase().includes(searchQuery.toLowerCase());

  useEffect(() => {
    if (hasChildMatch) {
      setExpanded(true);
    } else if (searchQuery.length === 0) {
      setExpanded(false);
    }
  }, [hasChildMatch, searchQuery]);

  return (
    <div className="rounded-12 border border-basic-grey-200 bg-basic-white p-20 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-18 font-700">{artist.artistDisplayName}</h3>
        <div className="flex gap-4">
          <Button
            size="small"
            variant="tertiary"
            onClick={() => onEdit(artist)}
          >
            수정
          </Button>
          <Button
            size="small"
            variant="s-destructive"
            onClick={() => onDelete(artist)}
          >
            삭제
          </Button>
        </div>
      </div>

      {/* Info line */}
      <p className="mt-4 text-14 text-basic-grey-500">
        ID: {artist.artistId}
        {' | '}
        {hasChildren ? (
          <span>
            <UsersIcon size={14} className="mr-[2px] inline" />
            {isMultiLevel
              ? `유닛 ${unitCount}개, 멤버 ${memberCount}명`
              : `멤버 ${memberCount}명`}
          </span>
        ) : (
          '하위 없음'
        )}
      </p>

      {/* Expandable children section */}
      {hasChildren && (
        <div className="mt-12">
          <button
            onClick={() => setExpanded(!expanded)}
            className="hover:text-basic-grey-800 flex items-center gap-4 text-14 font-600 text-basic-grey-600"
          >
            {expanded ? (
              <ChevronDownIcon size={16} />
            ) : (
              <ChevronRightIcon size={16} />
            )}
            하위 아티스트 {expanded ? '접기' : '펼치기'}
          </button>

          {expanded && (
            <div className="mt-8">
              {isMultiLevel && (
                <div className="mb-8 flex gap-4">
                  <button
                    onClick={() => setViewMode('unit')}
                    className={`rounded-[6px] px-12 py-4 text-12 font-600 ${
                      viewMode === 'unit'
                        ? 'bg-brand-primary-400 text-basic-white'
                        : 'bg-basic-grey-100 text-basic-grey-600'
                    }`}
                  >
                    유닛별
                  </button>
                  <button
                    onClick={() => setViewMode('flat')}
                    className={`rounded-[6px] px-12 py-4 text-12 font-600 ${
                      viewMode === 'flat'
                        ? 'bg-brand-primary-400 text-basic-white'
                        : 'bg-basic-grey-100 text-basic-grey-600'
                    }`}
                  >
                    멤버별
                  </button>
                </div>
              )}

              {viewMode === 'unit' || !isMultiLevel ? (
                <ArtistTreeView
                  childArtists={
                    isMultiLevel
                      ? artist.childArtists!.filter((child) => {
                          const full = allArtists.find(
                            (a) => a.artistId === child.artistId,
                          );
                          return (
                            full?.childArtists && full.childArtists.length > 0
                          );
                        })
                      : artist.childArtists!
                  }
                  allArtists={allArtists}
                  depth={0}
                  parentId={artist.artistId}
                  searchQuery={searchQuery}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ) : (
                <ArtistFlatMemberView
                  artist={artist}
                  allArtists={allArtists}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ArtistGroupCard;
