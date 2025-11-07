import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileLayout from '@/layouts/mobile';

export default function Home() {
  const navigate = useNavigate();
  const [userName] = useState('사용자');
  const currentTime = new Date();

  // 시간대별 인사말
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return '좋은 아침입니다';
    if (hour < 18) return '좋은 오후입니다';
    return '좋은 저녁입니다';
  };

  const mainButtons = [
    {
      id: 'friends',
      icon: '/icon/people.svg',
      label: '친구 목록',
      description: '소중한 사람들과 연결하세요',
      path: '/friends',
      color: 'from-[#FF7038] to-[#FF8C5A]',
    },
    {
      id: 'call',
      icon: '/icon/call.svg',
      label: '전화하기',
      description: '따뜻한 목소리를 나누세요',
      path: '/call',
      color: 'from-[#4CAF50] to-[#66BB6A]',
    },
  ];

  return (
    <MobileLayout>
      <div className="flex flex-col h-full">
        {/* 상단 인사 카드 */}
        <div className="pt-8 pb-6">
          <div className="bg-gradient-to-br from-[#FFFFFF] to-[#F9FAFB] rounded-3xl p-6 shadow-md border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-[16px] text-[#AAAAAA] mb-1">
                  {getGreeting()}
                </p>
                <h1 className="text-[32px] font-bold text-[#111111] leading-tight">
                  {userName}님
                </h1>
              </div>
            </div>
            <div className="h-px bg-gradient-to-r from-[#FFE8DD] via-[#FFD4C4] to-transparent mb-4"></div>
            <p className="text-[18px] text-[#666666] leading-relaxed">
              오늘도 건강하고 행복한 하루 보내세요!
            </p>
          </div>
        </div>

        {/* 메인 기능 섹션 */}
        <div className="flex-1 flex flex-col justify-center px-2">
          <h2 className="text-[20px] font-semibold text-[#111111] mb-6 px-2">
            빠른 시작
          </h2>
          
          <div className="space-y-5">
            {mainButtons.map((button, index) => (
              <button
                key={button.id}
                onClick={() => navigate(button.path)}
                className={`w-full bg-gradient-to-r ${button.color} rounded-3xl shadow-xl hover:shadow-2xl transition-all active:scale-98 overflow-hidden relative`}
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                }}
              >
                {/* 배경 패턴 */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -mr-16 -mt-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full -ml-12 -mb-12"></div>
                </div>

                <div className="relative flex items-center px-6 py-6 h-28">
                  {/* 아이콘 */}
                  <div className="w-16 h-16 bg-white bg-opacity-30 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg mr-5">
                    <img
                      src={button.icon}
                      alt={button.label}
                      className="w-9 h-9"
                      style={{ filter: 'brightness(0) invert(1)' }}
                    />
                  </div>

                  {/* 텍스트 */}
                  <div className="flex-1 text-left">
                    <h3 className="text-[24px] font-bold text-white mb-1">
                      {button.label}
                    </h3>
                    <p className="text-[15px] text-white text-opacity-90">
                      {button.description}
                    </p>
                  </div>

                  {/* 화살표 */}
                  <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center ml-3">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2 6H10M10 6L6 2M10 6L6 10"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 하단 인포 */}
        <div className="pb-6 pt-4">
          <div className="text-center">
            <p className="text-[14px] text-[#AAAAAA]">
              언제든지 편하게 이용하세요
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </MobileLayout>
  );
}
