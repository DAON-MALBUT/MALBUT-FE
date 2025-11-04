import { useState, useRef } from 'react';
import MobileLayout from '@/layouts/mobile';
import Input from '@/components/input';
import Dropdown from '@/components/dropdown';
import Button from '@/components/button';

export default function SignupInfo() {
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    phone: '',
    gender: '',
  });
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleGenderChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      gender: value,
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

  const handleSubmit = () => {
    console.log('제출:', formData, profileImage);
    // 여기에 제출 로직 추가
  };

  const isFormValid = formData.name && formData.birthDate && formData.phone;

  return (
    <MobileLayout showNavBar={false}>
      <div className="flex flex-col h-full">
        {/* 상단 타이틀 영역 */}
        <div className="pt-8 px-4">
          <h1 className="text-[36px] font-semibold leading-[42.96px] text-[#111111] mb-2" style={{ letterSpacing: '-0.72px' }}>
            사용자님의 정보를<br />입력해주세요
          </h1>
          <p className="text-[16px] font-normal leading-[22.4px] text-[#AAAAAA]">
            이후에도 프로필에서 수정할 수 있어요.
          </p>
        </div>

        {/* 프로필 이미지 영역 */}
        <div className="mt-8 flex justify-center relative">
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
        <div className="mt-8 px-4 space-y-6">
          {/* 이름 (필수) */}
          <Input
            label="이름"
            value={formData.name}
            onChange={handleInputChange('name')}
            placeholder="이름"
            required
            useMicrophone
            videoUrl="/video/user_name.m4a"
            fullWidth
          />

          {/* 생년월일 (필수) */}
          <Input
            label="생년월일"
            value={formData.birthDate}
            onChange={handleInputChange('birthDate')}
            placeholder="생년월일 입력"
            required
            useMicrophone
            videoUrl="/video/user_birth.m4a"
            fullWidth
          />

          {/* 성별 */}
          <Dropdown
            label="성별"
            value={formData.gender}
            onChange={handleGenderChange}
            options={['남자', '여자', '밝히고 싶지 않음', '기타']}
            placeholder="선택해주세요"
            fullWidth
          />

          {/* 전화번호 (필수) */}
          <Input
            label="전화번호"
            type="tel"
            value={formData.phone}
            onChange={handleInputChange('phone')}
            placeholder="전화번호 입력"
            required
            useMicrophone
            videoUrl="/video/user_callnumber.m4a"
            fullWidth
          />

        </div>

        {/* 하단 버튼 영역 */}
        <div className="mt-auto pb-8 px-4">
          {/* 개인정보 처리 방침 안내 */}
          <div className="mb-4">
            <p className="text-[12px] font-normal leading-[16.8px] text-[#AAAAAA]">
              위 내용은 개인정보 처리 방침 외 다른 용도로 사용되지 않아요.
            </p>
          </div>

          {/* 확인 버튼 */}
          <Button
            status={isFormValid ? 'primary' : 'disabled'}
            fullWidth
            onClick={handleSubmit}
          >
            확인
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
}
