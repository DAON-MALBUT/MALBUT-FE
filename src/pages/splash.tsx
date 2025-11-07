import MobileLayout from '@/layouts/mobile';
import './splash.css';

export default function SplashPage() {
  return (
    <MobileLayout showNavBar={false}>
      <div className="flex flex-col items-center justify-center h-full">
        {/* 로고 */}
        <img src="/icon/logo.svg" alt="Daon Logo" className="w-32 h-32 mb-12" />
        <h1 className="text-[24px] font-semibold leading-[33.6px] text-[#000000] mb-4">
          다온에 오신 것을 환영합니다!
        </h1>
        {/* 로딩 텍스트 - 파도 애니메이션 */}
        <div className="flex gap-1">
          {['서', '비', '스', '가', ' ', '로', '딩', '중', '입', '니', '다'].map((char, index) => (
            <span
              key={index}
              className="text-[16px] font-normal text-[#AAAAAA] inline-block wave-animation"
              style={{
                animationDelay: `${index * 0.1}s`,
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </div>
      </div>
    </MobileLayout>
  );
}