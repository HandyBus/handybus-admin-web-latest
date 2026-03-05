'use client';

import type { ArtistRelationEntity } from '../types';

interface Props {
  parentArtists: ArtistRelationEntity[];
  currentParentId: string;
}

const DuplicateBadge = ({ parentArtists, currentParentId }: Props) => {
  const otherParents = parentArtists.filter(
    (p) => p.artistId !== currentParentId,
  );

  if (otherParents.length === 0) return null;

  return (
    <>
      {otherParents.map((parent) => (
        <span
          key={parent.artistId}
          className="ml-4 rounded-4 bg-brand-primary-50 px-8 py-4 text-12 text-brand-primary-500"
          title={`${parent.artistDisplayName}에도 소속`}
        >
          &#x27D0; {parent.artistDisplayName}
        </span>
      ))}
    </>
  );
};

export default DuplicateBadge;
