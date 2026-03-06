'use client';

import { useEffect, useState } from 'react';
import { ChevronDownIcon, ChevronRightIcon } from 'lucide-react';
import Button from '@/components/button/Button';
import type { ArtistRelationEntity, ArtistViewEntity } from '../types';
import DuplicateBadge from './DuplicateBadge';

interface Props {
  childArtists: ArtistRelationEntity[];
  allArtists: ArtistViewEntity[];
  depth?: number;
  parentId?: string;
  searchQuery?: string;
  onEdit: (artist: ArtistViewEntity) => void;
  onDelete: (artist: ArtistViewEntity) => void;
}

const ArtistTreeView = ({
  childArtists,
  allArtists,
  depth = 0,
  parentId,
  searchQuery = '',
  onEdit,
  onDelete,
}: Props) => {
  return (
    <div style={{ paddingLeft: depth * 24 }}>
      {childArtists.map((child, index) => {
        const isLast = index === childArtists.length - 1;
        return (
          <TreeNode
            key={child.artistId}
            child={child}
            allArtists={allArtists}
            depth={depth}
            parentId={parentId}
            searchQuery={searchQuery}
            isLast={isLast}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        );
      })}
    </div>
  );
};

export default ArtistTreeView;

interface TreeNodeProps {
  child: ArtistRelationEntity;
  allArtists: ArtistViewEntity[];
  depth: number;
  parentId?: string;
  searchQuery: string;
  isLast: boolean;
  onEdit: (artist: ArtistViewEntity) => void;
  onDelete: (artist: ArtistViewEntity) => void;
}

const hasDescendantMatch = (
  artistId: string,
  allArtists: ArtistViewEntity[],
  query: string,
): boolean => {
  const entity = allArtists.find((a) => a.artistId === artistId);
  if (!entity?.childArtists) return false;
  const lowerQuery = query.toLowerCase();
  return entity.childArtists.some(
    (child) =>
      child.artistDisplayName.toLowerCase().includes(lowerQuery) ||
      hasDescendantMatch(child.artistId, allArtists, query),
  );
};

const TreeNode = ({
  child,
  allArtists,
  depth,
  parentId,
  searchQuery,
  isLast,
  onEdit,
  onDelete,
}: TreeNodeProps) => {
  const fullEntity = allArtists.find((a) => a.artistId === child.artistId);
  const hasChildren =
    fullEntity?.childArtists && fullEntity.childArtists.length > 0;
  const [expanded, setExpanded] = useState(false);

  const isMatch =
    searchQuery &&
    child.artistDisplayName.toLowerCase().includes(searchQuery.toLowerCase());
  const hasMatchingDescendant =
    searchQuery && hasDescendantMatch(child.artistId, allArtists, searchQuery);

  useEffect(() => {
    if (searchQuery && hasMatchingDescendant) {
      setExpanded(true);
    } else if (!searchQuery) {
      setExpanded(false);
    }
  }, [searchQuery, hasMatchingDescendant]);

  const connector = isLast ? '\u2514\u2500\u2500' : '\u251C\u2500\u2500';

  const hasMultipleParents =
    fullEntity?.parentArtists && fullEntity.parentArtists.length > 1;

  return (
    <div>
      <div className="flex items-center gap-8 py-4">
        <span className="font-mono text-basic-grey-400">{connector}</span>

        {hasChildren ? (
          <button
            onClick={() => setExpanded(!expanded)}
            className="hover:text-basic-grey-800 flex items-center gap-4 text-basic-grey-600"
          >
            {expanded ? (
              <ChevronDownIcon size={16} />
            ) : (
              <ChevronRightIcon size={16} />
            )}
            <span
              className={`text-14 font-600 ${isMatch ? 'rounded-4 bg-basic-yellow-100 px-4' : ''}`}
            >
              {child.artistDisplayName}
            </span>
          </button>
        ) : (
          <span
            className={`text-14 ${isMatch ? 'rounded-4 bg-basic-yellow-100 px-4 font-700' : ''}`}
          >
            {child.artistDisplayName}
          </span>
        )}

        {hasMultipleParents && parentId && fullEntity?.parentArtists && (
          <DuplicateBadge
            parentArtists={fullEntity.parentArtists}
            currentParentId={parentId}
          />
        )}

        <div className="ml-auto flex shrink-0 gap-4">
          {fullEntity && (
            <>
              <Button
                size="small"
                variant="tertiary"
                onClick={() => onEdit(fullEntity)}
              >
                수정
              </Button>
              <Button
                size="small"
                variant="s-destructive"
                onClick={() => onDelete(fullEntity)}
              >
                삭제
              </Button>
            </>
          )}
        </div>
      </div>

      {hasChildren && expanded && fullEntity?.childArtists && (
        <ArtistTreeView
          childArtists={fullEntity.childArtists}
          allArtists={allArtists}
          depth={depth + 1}
          parentId={fullEntity.artistId}
          searchQuery={searchQuery}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
    </div>
  );
};
