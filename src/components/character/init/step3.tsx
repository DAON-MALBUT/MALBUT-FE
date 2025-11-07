import React, { useRef } from 'react';
import Button from '@/components/button';

interface Step3Props {
  audioFile: File | null;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSkip: () => void;
  onComplete: () => void;
  isCompleteEnabled: boolean;
}

const Step3: React.FC<Step3Props> = ({
  audioFile,
  onFileUpload,
  onSkip,
  onComplete,
  isCompleteEnabled,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };


  return (
    <div className="flex flex-col h-full">
      {/* 상단 네비게이션 헤더 */}
      <div className="flex items-center justify-between px-4 py-3">
        {/* 왼쪽: 뒤로 버튼 */}
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-1"
        >
          <div className="w-6 h-6 flex items-center justify-center">
            <img
              src="/icon/arrow.svg"
              alt="뒤로"
              className="w-full h-full rotate-90"
            />
          </div>
          <span className="text-[16px] font-normal leading-[22.4px] text-[#AAAAAA]">
            뒤로
          </span>
        </button>

        {/* 중앙: 페이지 인디케이터 */}
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-[#AAAAAA]" />
          <div className="w-2 h-2 rounded-full bg-[#AAAAAA]" />
          <div className="w-2 h-2 rounded-full bg-[#FF7038]" />
        </div>

        {/* 오른쪽: 빈 공간 (대칭을 위해) */}
        <div className="w-[52px]" />
      </div>

      {/* 제목 영역 */}
      <div className="px-4 pt-8">
        <h1 className="text-[24px] font-semibold leading-[33.6px] text-[#000000] mb-2">
          음성파일이 있다면
          <br />
          업로드해 주세요
        </h1>
        <p className="text-[16px] font-normal leading-[22.4px] text-[#AAAAAA]">
          최대 1개까지 올릴 수 있어요.
        </p>
      </div>

      {/* 파일 업로드 영역 */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div
          onClick={handleUploadClick}
          className="w-[200px] h-[200px] border border-[#AAAAAA] rounded-xl flex items-center justify-center cursor-pointer hover:border-[#FF7038] transition-colors"
        >
          <div className="flex flex-col items-center gap-4">
            {/* 파일 업로드 아이콘 */}
            <div className="w-12 h-12 flex items-center justify-center">
              <img
                src="/icon/file_upload.svg"
                alt="파일 업로드"
                className="w-full h-full"
              />
            </div>
            
            {/* 업로드 텍스트 또는 파일명 */}
            <p className="text-[15px] font-normal leading-[21px] text-[#AAAAAA] text-center">
              {audioFile ? audioFile.name : '음성 파일 업로드'}
            </p>
          </div>

          {/* 숨겨진 파일 입력 */}
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            onChange={onFileUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* 하단 버튼 영역 */}
      <div className="flex gap-2 px-4 pb-8">
        {/* 건너뛰기 버튼 */}
        <div className="flex-1">
          <Button status="outlined" onClick={onSkip} fullWidth>
            건너뛰기
          </Button>
        </div>

        {/* 완료 버튼 */}
        <div className="flex-1">
          <Button
            status={isCompleteEnabled ? 'primary' : 'disabled'}
            onClick={onComplete}
            disabled={!isCompleteEnabled}
            fullWidth
          >
            완료
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Step3;
