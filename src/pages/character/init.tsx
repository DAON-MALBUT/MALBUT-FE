import { useState, useRef } from 'react';
import MobileLayout from '@/layouts/mobile';
import Button from '@/components/button';
import Input from '@/components/input';

export default function CharacterInit() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    birthDate: '',
    relationship: '',
  });
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleNext = () => {
    console.log('다음 페이지로 이동', formData);
    // 여기에 라우팅 로직 추가
  };

  const handleDefaultCharacter = () => {
    console.log('기본 캐릭터로 시작하기');
    // 여기에 기본 캐릭터 설정 로직 추가
  };

  const isFormValid = formData.name && formData.phone && formData.birthDate && formData.relationship;

  return (
    <MobileLayout showNavBar={false}>
      <div className="flex flex-col h-full">
        {/* 상단 타이틀 영역 */}
        <div className="pt-8 px-4">
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
              onClick={handleImageClick}
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
              onChange={handleImageUpload}
              className="hidden"
            />
            
            {/* 카메라 아이콘 */}
            <button 
              onClick={handleImageClick}
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
            onChange={handleInputChange('name')}
            fullWidth
            placeholder="이름"
          />

          <Input
            label="휴대전화"
            value={formData.phone}
            onChange={handleInputChange('phone')}
            fullWidth
            placeholder="전화번호"
          />

          <Input
            label="생년월일"
            value={formData.birthDate}
            onChange={handleInputChange('birthDate')}
            fullWidth
            placeholder="생년월일 입력"
          />

          <Input
            label="관계"
            value={formData.relationship}
            onChange={handleInputChange('relationship')}
            fullWidth
            placeholder="캐릭터와의 관계"
          />
        </div>

        {/* 하단 버튼 영역 */}
        <div className="mt-auto pb-8 px-4">
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
              onClick={handleDefaultCharacter}
            >
              기본 캐릭터로 시작하기
            </Button>
          </div>

          {/* 다음 버튼 */}
          <Button
            status={isFormValid ? 'primary' : 'disabled'}
            fullWidth
            onClick={handleNext}
          >
            다음
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
}
