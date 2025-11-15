import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileLayout from '@/layouts/mobile';
import Step1 from '@/components/character/init/step1';
import Step2 from '@/components/character/init/step2';
import Step3 from '@/components/character/init/step3';
import Loading from '@/components/character/init/loading';
import Complete from '@/components/character/init/complete';
import { voiceApi, characterApi } from '@/api/client';

export default function CharacterInit() {
  const navigate = useNavigate();
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
  const [voiceId, setVoiceId] = useState<string | null>(null);
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

  const handleSkip = async () => {
    console.log('건너뛰기', { formData, selectedPersonality });
    setCurrentStep(4);
  };

  const handleComplete = async () => {
    if (!audioFile) return;
    
    try {
      setCurrentStep(4);
      
      const response = await voiceApi.cloneVoice({
        name: formData.name,
        description: `${formData.relationship}, ${selectedPersonality}`,
        user_id: formData.phone,
        files: [audioFile],
      });
      
      setVoiceId(response.voice_id);
      console.log('Voice cloned successfully:', response);
      
      setTimeout(() => {
        setCurrentStep(5);
      }, 2000);
    } catch (error) {
      console.error('Failed to clone voice:', error);
      alert('음성 복제에 실패했습니다. 다시 시도해주세요.');
      setCurrentStep(3);
    }
  };

  const handleLoadingComplete = () => {
    setCurrentStep(5);
  };

  const handleFinalConfirm = async () => {
    if (!voiceId) return;

    try {
      const characterData = {
        name: formData.name,
        description: `${formData.relationship} - ${formData.phone}`,
        persona: `${formData.name}은(는) ${formData.relationship}입니다. ${selectedPersonality} 성격을 가지고 있습니다.`,
        personality_traits: [selectedPersonality],
        speaking_style: selectedPersonality,
        background_story: `생일: ${formData.birthDate}`,
        voice_id: voiceId,
        conversation_style: 'friendly',
        response_length: 'medium',
        use_emojis: true,
        formality_level: 'casual',
        knowledge_areas: [],
        interests: [],
        expertise_level: 'general',
        is_public: false,
      };

      const response = await characterApi.createCharacter(characterData);
      console.log('캐릭터 생성 완료:', response);
      
      navigate('/character');
    } catch (error) {
      console.error('Failed to create character:', error);
      alert('캐릭터 생성에 실패했습니다. 다시 시도해주세요.');
    }
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
