import { useRef } from 'react';
import Button from '@/components/button';
import Input from '@/components/input';

interface Step1Props {
  formData: {
    name: string;
    phone: string;
    birthDate: string;
    relationship: string;
  };
  profileImage: string | null;
  onInputChange: (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageClick: () => void;
  onNext: () => void;
  onDefaultCharacter: () => void;
  isFormValid: boolean;
}

export default function Step1({
  formData,
  profileImage,
  onInputChange,
  onImageUpload,
  onImageClick,
  onNext,
  onDefaultCharacter,
  isFormValid,
}: Step1Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

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
            <div className="w-2 h-2 rounded-full bg-[#FF7038]" />
            <div className="w-2 h-2 rounded-full bg-[#AAAAAA]" />
            <div className="w-2 h-2 rounded-full bg-[#AAAAAA]" />
          </div>

          {/* 오른쪽: 빈 공간 (대칭을 위해) */}
          <div className="w-[52px]" />
        </div>

        {/* 상단 타이틀 영역 */}
        <div className="px-4">
          <h1 className="text-[24px] font-semibold leading-[28.64px] text-[#111111] mb-2 tracking-tight" style={{ letterSpacing: '-0.48px' }}>
            통화할 캐릭터를 만들어주세요
          </h1>
          <p className="text-[16px] font-normal leading-[22.4px] text-[#AAAAAA]">
            이후에도 추가, 수정, 삭제할 수 있어요
          </p>
        </div>

        {/* 프로필 이미지 영역 */}
        <div className="mt-12 flex justify-center relative">
          <div className="relative">
            {/* 프로필 배경 */}
            <div 
              className="w-16 h-16 rounded-full bg-[#F9FAFB] border border-[#AAAAAA] border-opacity-30 flex items-center justify-center overflow-hidden cursor-pointer"
              onClick={onImageClick}
            >
              {profileImage ? (
                <img 
                  src={profileImage} 
                  alt="프로필"
                  className="w-full h-full object-cover"
                />
              ) : (
                <img 
                  src="/icon/people.svg" 
                  alt="프로필"
                  className="w-10 h-10"
                />
              )}
            </div>
            
            {/* 숨겨진 파일 입력 */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={onImageUpload}
              className="hidden"
            />
            
            {/* 카메라 아이콘 */}
            <button 
              onClick={onImageClick}
              className="absolute bottom-0 right-0 w-[27px] h-[27px] rounded-full bg-[#F9FAFB] border border-[#AAAAAA] border-opacity-30 flex items-center justify-center"
            >
              <img 
                src="/icon/camera_mini.svg" 
                alt="사진 업로드"
                className="w-[17px] h-[17px]"
              />
            </button>
          </div>
        </div>

        {/* 입력 폼 영역 */}
        <div className="mt-12 px-4 space-y-6">
          <Input
            label="이름"
            value={formData.name}
            onChange={onInputChange('name')}
            placeholder="이름"
            required
            useMicrophone
            videoUrl="/video/character_name.m4a"
            fullWidth
          />

          <Input
            label="휴대전화"
            value={formData.phone}
            onChange={onInputChange('phone')}
            placeholder="전화번호"
            required
            useMicrophone
            videoUrl="/video/character_callnumber.m4a"
            fullWidth
          />

          <Input
            label="생년월일"
            value={formData.birthDate}
            onChange={onInputChange('birthDate')}
            placeholder="생년월일 입력"
            required
            useMicrophone
            videoUrl="/video/character_birth.m4a"
            fullWidth
          />

          <Input
            label="관계"
            value={formData.relationship}
            onChange={onInputChange('relationship')}
            placeholder="캐릭터와의 관계"
            required
            useMicrophone
            videoUrl="/video/character_relationship.m4a"
            fullWidth
          />
        </div>

        {/* 하단 버튼 영역 */}
        <div className="mt-auto py-8 px-4">
          {/* 구분선 */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex-1 h-[1px] bg-[#AAAAAA] rounded-full" />
            <span className="text-[15px] font-normal leading-[21px] text-[#AAAAAA]">또는</span>
            <div className="flex-1 h-[1px] bg-[#AAAAAA] rounded-full" />
          </div>

          {/* 기본 캐릭터로 시작하기 버튼 */}
          <div className="mb-4">
            <Button
              status="outlined"
              fullWidth
              onClick={onDefaultCharacter}
            >
              기본 캐릭터로 시작하기
            </Button>
          </div>

          {/* 다음 버튼 */}
          <Button
            status={isFormValid ? 'primary' : 'disabled'}
            fullWidth
            onClick={onNext}
          >
            다음
          </Button>
        </div>
      </div>
    );
  }