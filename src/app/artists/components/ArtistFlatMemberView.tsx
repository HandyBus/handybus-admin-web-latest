'use client';

import Button from '@/components/button/Button';
import type { ArtistViewEntity } from '../types';

interface Props {
  artist: ArtistViewEntity;
  allArtists: ArtistViewEntity[];
  onEdit: (artist: ArtistViewEntity) => void;
  onDelete: (artist: ArtistViewEntity) => void;
}

interface FlatMember {
  artistId: string;
  displayName: string;
  parentNames: string[];
  fullEntity: ArtistViewEntity | undefined;
}

const ArtistFlatMemberView = ({
  artist,
  allArtists,
  onEdit,
  onDelete,
}: Props) => {
  const members = collectLeafMembers(artist, allArtists);

  // Deduplicate by artistId, merging parentNames
  const deduped = new Map<string, FlatMember>();
  for (const member of members) {
    const existing = deduped.get(member.artistId);
    if (existing) {
      const mergedParents = new Set([
        ...existing.parentNames,
        ...member.parentNames,
      ]);
      existing.parentNames = Array.from(mergedParents);
    } else {
      deduped.set(member.artistId, { ...member });
    }
  }

  const flatMembers = Array.from(deduped.values());

  return (
    <div className="mt-12 overflow-hidden rounded-8 border border-basic-grey-200">
      <table className="w-full text-14">
        <thead>
          <tr className="bg-basic-grey-100">
            <th className="px-12 py-8 text-left font-600">이름</th>
            <th className="px-12 py-8 text-left font-600">소속 유닛</th>
            <th className="px-12 py-8 text-right font-600">액션</th>
          </tr>
        </thead>
        <tbody>
          {flatMembers.map((member) => (
            <tr
              key={member.artistId}
              className="border-t border-basic-grey-200"
            >
              <td className="px-12 py-8">{member.displayName}</td>
              <td className="px-12 py-8 text-basic-grey-600">
                {member.parentNames.join(', ')}
              </td>
              <td className="px-12 py-8">
                <div className="flex justify-end gap-4">
                  {member.fullEntity && (
                    <>
                      <Button
                        size="small"
                        variant="tertiary"
                        onClick={() => onEdit(member.fullEntity!)}
                      >
                        수정
                      </Button>
                      <Button
                        size="small"
                        variant="s-destructive"
                        onClick={() => onDelete(member.fullEntity!)}
                      >
                        삭제
                      </Button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
          {flatMembers.length === 0 && (
            <tr>
              <td
                colSpan={3}
                className="px-12 py-16 text-center text-basic-grey-400"
              >
                하위 아티스트가 없습니다
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ArtistFlatMemberView;

function collectLeafMembers(
  artist: ArtistViewEntity,
  allArtists: ArtistViewEntity[],
  parentName?: string,
): FlatMember[] {
  const children = artist.childArtists;
  if (!children || children.length === 0) return [];

  const results: FlatMember[] = [];

  for (const child of children) {
    const fullEntity = allArtists.find((a) => a.artistId === child.artistId);
    const hasSubChildren =
      fullEntity?.childArtists && fullEntity.childArtists.length > 0;

    if (hasSubChildren && fullEntity) {
      // This is an intermediate node (unit) - recurse
      const subMembers = collectLeafMembers(
        fullEntity,
        allArtists,
        child.artistDisplayName,
      );
      results.push(...subMembers);
    } else {
      // This is a leaf node (member)
      results.push({
        artistId: child.artistId,
        displayName: child.artistDisplayName,
        parentNames: [parentName ?? artist.artistDisplayName],
        fullEntity,
      });
    }
  }

  return results;
}
