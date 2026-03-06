'use client';

import { useEffect, useState } from 'react';
import CustomModal from '@/components/modal/CustomModal';
import Button from '@/components/button/Button';
import Input from '@/components/input/Input';
import type { ArtistViewEntity, ArtistRelationEntity } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  artist: ArtistViewEntity | null;
  allArtists: ArtistViewEntity[];
}

const ArtistFormModal = ({ isOpen, onClose, artist, allArtists }: Props) => {
  const isEditMode = artist !== null;

  // 기본 정보
  const [artistName, setArtistName] = useState('');
  const [artistDisplayName, setArtistDisplayName] = useState('');
  const [artistSubDisplayName, setArtistSubDisplayName] = useState('');
  const [artistAbbreviatedName, setArtistAbbreviatedName] = useState('');
  const [artistLogoImageUrl, setArtistLogoImageUrl] = useState('');
  const [artistMainImageUrl, setArtistMainImageUrl] = useState('');
  const [artistDescription, setArtistDescription] = useState('');

  // 관계 설정 (자식만 편집 가능, 부모는 읽기 전용)
  const [childArtists, setChildArtists] = useState<ArtistRelationEntity[]>([]);

  // 자식 검색
  const [childSearch, setChildSearch] = useState('');
  const [isChildDropdownOpen, setIsChildDropdownOpen] = useState(false);

  // 모달이 열릴 때 초기값 설정
  useEffect(() => {
    if (!isOpen) return;
    if (artist) {
      setArtistName(artist.artistName);
      setArtistDisplayName(artist.artistDisplayName);
      setArtistSubDisplayName(artist.artistSubDisplayName ?? '');
      setArtistAbbreviatedName(artist.artistAbbreviatedName ?? '');
      setArtistLogoImageUrl(artist.artistLogoImageUrl ?? '');
      setArtistMainImageUrl(artist.artistMainImageUrl ?? '');
      setArtistDescription(artist.artistDescription ?? '');
      setChildArtists(artist.childArtists ?? []);
    } else {
      setArtistName('');
      setArtistDisplayName('');
      setArtistSubDisplayName('');
      setArtistAbbreviatedName('');
      setArtistLogoImageUrl('');
      setArtistMainImageUrl('');
      setArtistDescription('');
      setChildArtists([]);
    }
    setChildSearch('');
    setIsChildDropdownOpen(false);
  }, [artist, isOpen]);

  const parentArtists = artist?.parentArtists ?? [];
  const selectedChildIds = new Set(childArtists.map((a) => a.artistId));

  const filteredChildResults = allArtists.filter(
    (a) =>
      a.artistDisplayName.toLowerCase().includes(childSearch.toLowerCase()) &&
      a.artistId !== artist?.artistId &&
      !selectedChildIds.has(a.artistId),
  );

  const handleAddChild = (target: ArtistViewEntity) => {
    setChildArtists((prev) => [
      ...prev,
      {
        artistId: target.artistId,
        artistName: target.artistName,
        artistDisplayName: target.artistDisplayName,
        artistLogoImageUrl: target.artistLogoImageUrl,
        artistMainImageUrl: target.artistMainImageUrl,
      },
    ]);
    setChildSearch('');
    setIsChildDropdownOpen(false);
  };

  const handleRemoveChild = (artistId: string) => {
    setChildArtists((prev) => prev.filter((a) => a.artistId !== artistId));
  };

  const handleSubmit = () => {
    alert('저장되었습니다');
    onClose();
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onClosed={onClose}
      styles="flex max-h-[90vh] w-[520px] flex-col overflow-y-auto rounded-12 bg-basic-white p-28"
    >
      {/* 헤더 */}
      <div className="mb-24 flex items-center justify-between">
        <h2 className="text-20 font-700 text-basic-black">
          {isEditMode ? '아티스트 수정' : '아티스트 추가'}
        </h2>
        <button
          onClick={onClose}
          className="flex h-28 w-28 items-center justify-center rounded-full text-basic-grey-500 hover:bg-basic-grey-100"
        >
          &#x2715;
        </button>
      </div>

      {/* Section 1 - 기본 정보 */}
      <div className="mb-24 flex flex-col gap-16">
        <h3 className="text-basic-grey-800 text-16 font-700">기본 정보</h3>

        <div className="flex flex-col gap-8">
          <label className="text-14 font-600 text-basic-grey-700">
            아티스트 이름 <span className="text-basic-red-400">*</span>
          </label>
          <Input
            value={artistName}
            setValue={setArtistName}
            placeholder="아티스트 이름을 입력하세요"
          />
        </div>

        <div className="flex flex-col gap-8">
          <label className="text-14 font-600 text-basic-grey-700">
            표시 이름 <span className="text-basic-red-400">*</span>
          </label>
          <Input
            value={artistDisplayName}
            setValue={setArtistDisplayName}
            placeholder="표시 이름을 입력하세요"
          />
        </div>

        <div className="flex flex-col gap-8">
          <label className="text-14 font-600 text-basic-grey-700">
            보조 표시 이름
          </label>
          <Input
            value={artistSubDisplayName}
            setValue={setArtistSubDisplayName}
            placeholder="보조 표시 이름을 입력하세요"
          />
        </div>

        <div className="flex flex-col gap-8">
          <label className="text-14 font-600 text-basic-grey-700">약칭</label>
          <Input
            value={artistAbbreviatedName}
            setValue={setArtistAbbreviatedName}
            placeholder="약칭을 입력하세요"
          />
        </div>

        <div className="flex flex-col gap-8">
          <label className="text-14 font-600 text-basic-grey-700">
            로고 이미지
          </label>
          {artistLogoImageUrl ? (
            <div className="flex items-center gap-8">
              <div className="flex-1 truncate rounded-8 border border-basic-grey-200 px-12 py-8 text-14 text-basic-grey-600">
                {artistLogoImageUrl}
              </div>
              <button
                onClick={() => setArtistLogoImageUrl('')}
                className="shrink-0 text-14 text-basic-grey-500 hover:text-basic-red-400"
              >
                삭제
              </button>
            </div>
          ) : (
            <div className="flex h-[80px] items-center justify-center rounded-8 border border-dashed border-basic-grey-300 bg-basic-grey-50 text-14 text-basic-grey-500">
              이미지 업로드
            </div>
          )}
        </div>

        <div className="flex flex-col gap-8">
          <label className="text-14 font-600 text-basic-grey-700">
            메인 이미지
          </label>
          {artistMainImageUrl ? (
            <div className="flex items-center gap-8">
              <div className="flex-1 truncate rounded-8 border border-basic-grey-200 px-12 py-8 text-14 text-basic-grey-600">
                {artistMainImageUrl}
              </div>
              <button
                onClick={() => setArtistMainImageUrl('')}
                className="shrink-0 text-14 text-basic-grey-500 hover:text-basic-red-400"
              >
                삭제
              </button>
            </div>
          ) : (
            <div className="flex h-[80px] items-center justify-center rounded-8 border border-dashed border-basic-grey-300 bg-basic-grey-50 text-14 text-basic-grey-500">
              이미지 업로드
            </div>
          )}
        </div>

        <div className="flex flex-col gap-8">
          <label className="text-14 font-600 text-basic-grey-700">설명</label>
          <textarea
            value={artistDescription}
            onChange={(e) => setArtistDescription(e.target.value)}
            placeholder="아티스트 설명을 입력하세요"
            rows={3}
            className="w-full resize-none rounded-8 border border-basic-grey-200 px-12 py-8 text-16 font-500 text-basic-black placeholder:text-basic-grey-500 focus:outline-brand-primary-300"
          />
        </div>
      </div>

      {/* Section 2 - 관계 설정 */}
      <div className="mb-24 flex flex-col gap-16">
        <h3 className="text-basic-grey-800 text-16 font-700">관계 설정</h3>

        {/* 현재 부모 (읽기 전용) */}
        {isEditMode && parentArtists.length > 0 && (
          <div className="flex flex-col gap-8">
            <label className="text-14 font-600 text-basic-grey-700">
              현재 부모
              <span className="ml-4 text-12 font-400 text-basic-grey-400">
                (읽기 전용)
              </span>
            </label>
            <div className="flex flex-wrap gap-8">
              {parentArtists.map((a) => (
                <span
                  key={a.artistId}
                  className="rounded-full bg-basic-grey-100 px-12 py-4 text-12 font-500 text-basic-grey-600"
                >
                  {a.artistDisplayName}
                </span>
              ))}
            </div>
            <p className="text-12 text-basic-grey-400">
              부모 관계는 부모 아티스트에서 자식으로 추가하여 설정합니다.
            </p>
          </div>
        )}

        {/* 자식 아티스트 */}
        <div className="flex flex-col gap-8">
          <label className="text-14 font-600 text-basic-grey-700">
            자식 아티스트
          </label>
          <div className="relative">
            <Input
              value={childSearch}
              setValue={(v) => {
                setChildSearch(v);
                setIsChildDropdownOpen(v.length > 0);
              }}
              placeholder="자식 아티스트를 검색하세요"
              onFocus={() => {
                if (childSearch.length > 0) setIsChildDropdownOpen(true);
              }}
              onBlur={() => {
                setTimeout(() => setIsChildDropdownOpen(false), 200);
              }}
            />
            {isChildDropdownOpen && filteredChildResults.length > 0 && (
              <ul className="absolute left-0 top-full z-10 mt-4 max-h-[160px] w-full overflow-y-auto rounded-8 border border-basic-grey-200 bg-basic-white shadow-lg">
                {filteredChildResults.map((a) => (
                  <li
                    key={a.artistId}
                    className="cursor-pointer px-12 py-8 text-14 text-basic-grey-700 hover:bg-basic-grey-50"
                    onMouseDown={() => handleAddChild(a)}
                  >
                    {a.artistDisplayName}
                  </li>
                ))}
              </ul>
            )}
          </div>
          {childArtists.length > 0 && (
            <div className="flex flex-wrap gap-8">
              {childArtists.map((a) => (
                <span
                  key={a.artistId}
                  className="flex items-center gap-4 rounded-full bg-brand-primary-50 px-12 py-4 text-12 font-500 text-brand-primary-500"
                >
                  {a.artistDisplayName}
                  <button
                    onClick={() => handleRemoveChild(a.artistId)}
                    className="text-brand-primary-300 hover:text-brand-primary-500"
                  >
                    &#x2715;
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 관계 미리보기 */}
        {(parentArtists.length > 0 || childArtists.length > 0) && (
          <div className="flex flex-col gap-8">
            <label className="text-14 font-600 text-basic-grey-700">
              관계 미리보기
            </label>
            <div className="rounded-8 bg-basic-grey-50 px-12 py-12 text-14 text-basic-grey-700">
              {parentArtists.length > 0 && (
                <div className="flex flex-wrap items-center gap-4">
                  {parentArtists.map((p, i) => (
                    <span key={p.artistId} className="flex items-center gap-4">
                      <span className="text-basic-grey-500">
                        {p.artistDisplayName}
                      </span>
                      {i < parentArtists.length - 1 && (
                        <span className="text-basic-grey-400">,</span>
                      )}
                    </span>
                  ))}
                  <span className="text-basic-grey-400">&#x2192;</span>
                  <span className="font-600">
                    {artistDisplayName || '(현재 아티스트)'}
                  </span>
                </div>
              )}
              {childArtists.length > 0 && (
                <div className="mt-4 flex flex-wrap items-center gap-4">
                  <span className="font-600">
                    {artistDisplayName || '(현재 아티스트)'}
                  </span>
                  <span className="text-basic-grey-400">&#x2192;</span>
                  {childArtists.map((c, i) => (
                    <span key={c.artistId} className="flex items-center gap-4">
                      <span className="text-basic-grey-500">
                        {c.artistDisplayName}
                      </span>
                      {i < childArtists.length - 1 && (
                        <span className="text-basic-grey-400">,</span>
                      )}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 하단 버튼 */}
      <div className="flex gap-8">
        <Button variant="tertiary" onClick={onClose}>
          취소
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          {isEditMode ? '저장' : '생성'}
        </Button>
      </div>
    </CustomModal>
  );
};

export default ArtistFormModal;
