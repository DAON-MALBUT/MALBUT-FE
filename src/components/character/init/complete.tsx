import React from 'react';
import Button from '@/components/button';

interface CompleteProps {
  onConfirm: () => void;
}

const Complete: React.FC<CompleteProps> = ({ onConfirm }) => {
  return (
    <div className="flex flex-col h-full">

      {/* 제목 영역 */}
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <img src='/icon/complete.svg' alt='완료 일러스트' className='w-120 mx-auto' />
        <h1 className="text-[24px] font-semibold leading-[33.6px] text-[#000000] text-center mb-4">
          캐릭터 생성이 완료되었습니다!
        </h1>
        <p className="text-[16px] font-normal leading-[22.4px] text-[#AAAAAA] text-center">
          이제 캐릭터와 대화를 시작할 수 있습니다
        </p>
      </div>

      {/* 하단 버튼 영역 */}
      <div className="px-4 pb-8">
        <Button status="primary" onClick={onConfirm} fullWidth>
          확인
        </Button>
      </div>
    </div>
  );
};

export default Complete;
