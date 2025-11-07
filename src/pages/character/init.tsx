import { useState, useRef } from 'react';
import MobileLayout from '@/layouts/mobile';
import Step1 from '@/components/character/init/step1';
import Step2 from '@/components/character/init/step2';
import Step3 from '@/components/character/init/step3';
import Loading from '@/components/character/init/loading';
import Complete from '@/components/character/init/complete';

export default function CharacterInit() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    birthDate: '',
    relationship: '',
  });
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [selectedPersonality, setSelectedPersonality] = useState('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
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
    if (currentStep === 1) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    } else if (currentStep === 3) {
      console.log('완료', { formData, selectedPersonality, audioFile });
      // 여기에 최종 완료 로직 추가
    }
  };
  const handlePrev = () =>{
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  }

  const handleDefaultCharacter = () => {
    console.log('기본 캐릭터로 시작하기');
    // 여기에 기본 캐릭터 설정 로직 추가
  };

  const handlePersonalitySelect = (personality: string) => {
    setSelectedPersonality(personality);
  };

  const handleAudioFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFile(file);
    }
  };

  const handleSkip = () => {
    console.log('건너뛰기', { formData, selectedPersonality });
    setCurrentStep(4); // 로딩 화면으로 이동
  };

  const handleComplete = () => {
    console.log('완료', { formData, selectedPersonality, audioFile });
    setCurrentStep(4); // 로딩 화면으로 이동
  };

  const handleLoadingComplete = () => {
    setCurrentStep(5); // Complete 화면으로 이동
  };

  const handleFinalConfirm = () => {
    console.log('최종 확인', { formData, selectedPersonality, audioFile });
    // 여기에 최종 확인 후 라우팅 로직 추가 (예: 캐릭터 리스트로 이동)
  };

  const isFormValid = !!(
    formData.name &&
    formData.phone &&
    formData.birthDate &&
    formData.relationship
  );

  const isStep2Valid = !!selectedPersonality;
  const isStep3Valid = !!audioFile;

  return (
    <MobileLayout showNavBar={false}>
      {currentStep === 1 && (
        <Step1 
          formData={formData}
          profileImage={profileImage}
          onInputChange={handleInputChange}
          onImageUpload={handleImageUpload}
          onImageClick={handleImageClick}
          onNext={handleNext}
          onDefaultCharacter={handleDefaultCharacter}
          isFormValid={isFormValid}
        />
      )}
      {currentStep === 2 && (
        <Step2
          onPrev={handlePrev}
          selectedPersonality={selectedPersonality}
          onPersonalitySelect={handlePersonalitySelect}
          onNext={handleNext}
          isNextEnabled={isStep2Valid}
        />
      )}
      {currentStep === 3 && (
        <Step3
          audioFile={audioFile}
          onFileUpload={handleAudioFileUpload}
          onSkip={handleSkip}
          onComplete={handleComplete}
          isCompleteEnabled={isStep3Valid}
        />
      )}
      {currentStep === 4 && (
        <Loading onComplete={handleLoadingComplete} />
      )}
      {currentStep === 5 && (
        <Complete onConfirm={handleFinalConfirm} />
      )}
    </MobileLayout>
  );
}
