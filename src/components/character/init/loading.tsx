import React, { useEffect, useState } from 'react';

interface LoadingProps {
  onComplete: () => void;
}

const Loading: React.FC<LoadingProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // 5초 동안 0%에서 99%까지 애니메이션
    const duration = 5000; // 5초
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 99, 99);
      setProgress(Math.floor(newProgress));

      if (elapsed >= duration) {
        clearInterval(interval);
        // 99%에서 100%로 전환
        setTimeout(() => {
          setProgress(100);
          // 100% 도달 후 onComplete 호출
          setTimeout(() => {
            onComplete();
          }, 500);
        }, 100);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [onComplete]);

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
          보이스 클론을 생성하고 있어요
        </h1>
        <p className="text-[16px] font-normal leading-[22.4px] text-[#AAAAAA]">
          잠시만 기다려 주세요
        </p>
      </div>

      {/* 프로그레스 바 영역 */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 gap-8">
        {/* 로딩 GIF */}
        <div className="flex items-center justify-center">
          <img
            src="/gif/loading.gif"
            alt="로딩 중"
            className="w-32 h-32 object-contain"
          />
        </div>

        {/* 프로그레스 바 */}
        <div className="w-full max-w-[343px]">
          {/* 프로그레스 바 */}
          <div className="relative w-full h-3 bg-[#FF7038] bg-opacity-30 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-[#FF7038] transition-all duration-300 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* 퍼센트 텍스트 */}
          <div className="mt-4 text-center">
            <span className="text-[18px] font-bold leading-[25.2px] text-[#000000]">
              {progress}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
