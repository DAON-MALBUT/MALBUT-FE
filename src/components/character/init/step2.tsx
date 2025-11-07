import React from 'react';
import Button from '@/components/button';

interface Step2Props {
  selectedPersonality: string;
  onPersonalitySelect: (personality: string) => void;
  onNext: () => void;
  onPrev: () => void;
  isNextEnabled: boolean;
}

interface PersonalityCard {
  id: string;
  title: string;
  description: string;
  icon: string;
}

const personalities: PersonalityCard[] = [
  {
    id: 'lively',
    title: '활발함',
    description: '밝고 에너지 넘치는 스타일',
    icon: '/icon/3d/Lively.svg'
  },
  {
    id: 'friendly',
    title: '다정함',
    description: '따뜻하고 공감 잘하는 스타일',
    icon: '/icon/3d/friendly.svg'
  },
  {
    id: 'calm',
    title: '차분함',
    description: '조용히 경청하는 스타일',
    icon: '/icon/3d/calm.svg'
  },
  {
    id: 'cheerful',
    title: '유쾌함',
    description: '유머러스하고 재미있는 스타일',
    icon: '/icon/3d/cheerful.svg'
  },
  {
    id: 'polite',
    title: '공손함',
    description: '정중하고 예의바른 스타일',
    icon: '/icon/3d/polite.svg'
  }
];

const Step2: React.FC<Step2Props> = ({
  selectedPersonality,
  onPersonalitySelect,
  onNext,
    onPrev,
  isNextEnabled
}) => {
  return (
    <div className="flex flex-col h-full">
      {/* 상단 네비게이션 헤더 */}
      <div className="flex items-center justify-between px-4 py-2">
        {/* 왼쪽: 뒤로 버튼 */}
        <button 
          onClick={() => onPrev()}
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
          <div className="w-2 h-2 rounded-full bg-[#FF7038]" />
          <div className="w-2 h-2 rounded-full bg-[#AAAAAA]" />
        </div>

        {/* 오른쪽: 빈 공간 (대칭을 위해) */}
        <div className="w-[52px]" />
      </div>

      {/* 제목 */}
      <div className="px-4  pb-6">
        <h1 className="text-2xl font-semibold text-black leading-[33.6px]">
          캐릭터 성격을 선택해 주세요
        </h1>
      </div>

      {/* 성격 카드 리스트 */}
      <div className="mb-6 px-4 space-y-4">
        {personalities.map((personality) => (
          <div
            key={personality.id}
            onClick={() => onPersonalitySelect(personality.id)}
            className={`
              w-full h-[100px] bg-white border rounded-xl cursor-pointer
              flex items-center transition-all duration-200
              ${selectedPersonality === personality.id
                ? 'border-orange-500 shadow-sm'
                : 'border-gray-400 hover:border-gray-500'
              }
            `}
          >
            {/* 3D 아이콘 */}
            <div className="w-[100px] h-[100px] flex items-center justify-center">
              <img 
                src={personality.icon}
                alt={personality.title}
                className="w-16 h-16 object-contain"
              />
            </div>

            {/* 텍스트 영역 */}
            <div className="flex-1 pr-4">
              <h3 className="text-xl font-medium text-gray-900 mb-1 leading-7">
                {personality.title}
              </h3>
              <p className="text-base font-light text-gray-900 opacity-80 leading-[22.4px]">
                {personality.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* 다음 버튼 */}
      <div className="mt-auto px-4 pb-8">
        <Button
          status={isNextEnabled ? 'primary' : 'disabled'}
          onClick={onNext}
          disabled={!isNextEnabled}
          fullWidth
        >
          다음
        </Button>
      </div>
    </div>
  );
};

export default Step2;