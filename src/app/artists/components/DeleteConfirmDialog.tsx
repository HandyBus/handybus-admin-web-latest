'use client';

import CustomModal from '@/components/modal/CustomModal';
import Button from '@/components/button/Button';
import type { ArtistViewEntity } from '../types';

interface Props {
  artist: ArtistViewEntity | null;
  onClose: () => void;
}

const DeleteConfirmDialog = ({ artist, onClose }: Props) => {
  const hasChildren =
    artist?.childArtists != null && artist.childArtists.length > 0;

  const handleDelete = () => {
    alert('삭제되었습니다');
    onClose();
  };

  return (
    <CustomModal
      isOpen={artist !== null}
      onClosed={onClose}
      styles="flex w-[400px] flex-col rounded-12 bg-basic-white p-28"
    >
      {/* 제목 */}
      <h2 className="mb-16 text-20 font-700 text-basic-black">아티스트 삭제</h2>

      {/* 메시지 */}
      <p className="mb-16 text-16 text-basic-grey-700">
        &ldquo;{artist?.artistDisplayName}&rdquo;을(를) 삭제하시겠습니까?
      </p>

      {/* 하위 아티스트 경고 */}
      {hasChildren && (
        <div className="mb-16 rounded-8 bg-basic-red-100 px-16 py-12">
          <p className="mb-8 text-14 font-600 text-basic-red-500">
            이 아티스트의 하위 관계:
          </p>
          <ul className="mb-8 list-disc pl-20">
            {artist!.childArtists!.map((child) => (
              <li key={child.artistId} className="text-14 text-basic-grey-700">
                {child.artistDisplayName}
              </li>
            ))}
          </ul>
          <p className="text-12 text-basic-grey-600">
            하위 아티스트는 삭제되지 않으며, 관계만 해제됩니다.
          </p>
        </div>
      )}

      {/* 버튼 */}
      <div className="flex gap-8">
        <Button variant="tertiary" onClick={onClose}>
          취소
        </Button>
        <Button variant="p-destructive" onClick={handleDelete}>
          삭제
        </Button>
      </div>
    </CustomModal>
  );
};

export default DeleteConfirmDialog;
