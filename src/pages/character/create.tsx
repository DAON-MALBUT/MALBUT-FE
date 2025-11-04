import { useState } from 'react';
import MobileLayout from '@/layouts/mobile';
import Step1 from '@/components/character/step1';

export default function CharacterCreate() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    birthDate: '',
    relationship: '',
  });
  const [profileImage, setProfileImage] = useState<string | null>(null);

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

  const handleCancel = () => {
    console.log('취소 - 이전 페이지로 이동');
    // 여기에 라우팅 로직 추가
  };

  const handleNext = () => {
    console.log('다음 단계로 이동', formData, profileImage);
    // 여기에 다음 단계 로직 추가
  };

  return (
    <MobileLayout showNavBar={false}>
      <Step1
        formData={formData}
        profileImage={profileImage}
        onInputChange={handleInputChange}
        onImageUpload={handleImageUpload}
        onCancel={handleCancel}
        onNext={handleNext}
      />
    </MobileLayout>
  );
}
