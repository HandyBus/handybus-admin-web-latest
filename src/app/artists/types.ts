// TODO: API 연동 시 src/types/artist.type.ts 의 ArtistsViewEntity를 확장하고 이 파일은 제거할 것
// 현재는 마크업 전용 타입으로, 실제 API 스펙에 맞춘 확장 버전

export interface ArtistRelationEntity {
  artistId: string;
  artistName: string;
  artistDisplayName: string;
  artistLogoImageUrl: string | null;
  artistMainImageUrl: string | null;
}

export interface ArtistViewEntity {
  artistId: string;
  artistName: string;
  artistDisplayName: string;
  artistSubDisplayName: string | null;
  artistAbbreviatedName: string | null;
  artistLogoImageUrl: string | null;
  artistMainImageUrl: string | null;
  artistDescription: string | null;
  parentArtists: ArtistRelationEntity[] | null;
  childArtists: ArtistRelationEntity[] | null;
  createdAt: string;
  updatedAt: string;
}

export type FilterType = '전체' | '하위있음' | '하위없음';
export type SortType = '관계순' | '이름순' | '최신순';
