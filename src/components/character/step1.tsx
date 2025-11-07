import { useRef } from 'react';
import Input from '@/components/input';
import Button from '@/components/button';

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
  onCancel: () => void;
  onNext: () => void;
}

export default function Step1({
  formData,
  profileImage,
  onInputChange,
  onImageUpload,
  onCancel,
  onNext,
}: Step1Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const isFormValid = formData.name && formData.phone && formData.birthDate && formData.relationship;

  return (
    <div className="flex flex-col h-full bg-white">
      {/* 상단 헤더 */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-[#F5F5F5]">
        <button
          onClick={onCancel}
          className="text-[15px] font-normal leading-[17.9px] text-[#2E7BEE]"
        >
          취소
        </button>
        <h1 className="text-[17px] font-bold leading-[20.29px] text-[#000000]">
          캐릭터 만들기
        </h1>
        <button
          onClick={onNext}
          disabled={!isFormValid}
          className="text-[15px] font-normal leading-[17.9px]"
          style={{
            color: isFormValid ? '#2E7BEE' : '#CCCCCC',
          }}
        >
          다음
        </button>
      </div>

      {/* 프로필 이미지 영역 */}
      <div className="mt-8 flex justify-center relative">
        <div className="relative">
          {/* 프로필 배경 */}
          <div
            className="w-[59px] h-[59px] rounded-full bg-[#F4EFEB] border border-[#E9E6E3] flex items-center justify-center overflow-hidden cursor-pointer"
            onClick={handleImageClick}
          >
            {profileImage ? (
              <img
                src={profileImage}
                alt="프로필"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-[30px] h-[30px]">
                <img
                  src="/icon/people.svg"
                  alt="프로필"
                  className="w-full h-full"
                />
              </div>
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
            onClick={handleImageClick}
            className="absolute bottom-0 right-0 w-[27px] h-[27px] rounded-full bg-white border border-[#E6E6E6] flex items-center justify-center"
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
        {/* 이름 */}
        <Input
          label="이름"
          value={formData.name}
          onChange={onInputChange('name')}
          placeholder="이름"
          fullWidth
        />

        {/* 휴대전화 */}
        <Input
          label="휴대전화"
          type="tel"
          value={formData.phone}
          onChange={onInputChange('phone')}
          placeholder="전화번호 입력"
          fullWidth
        />
        {/* 생년월일 */}
        <Input
          label="생년월일"
          value={formData.birthDate}
          onChange={onInputChange('birthDate')}
          placeholder="생년월일 입력"
          fullWidth
        />

        {/* 관계 */}
        <Input
          label="관계"
          value={formData.relationship}
          onChange={onInputChange('relationship')}
          placeholder="캐릭터와의 관계 입력"
          fullWidth
        />
      </div>

      {/* 하단 다음 버튼 */}
      <div className="mt-auto pb-8 px-4">
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
