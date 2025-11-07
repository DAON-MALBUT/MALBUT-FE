import { useNavigate, useLocation } from 'react-router-dom';
import MobileLayout from '@/layouts/mobile';

interface CallState {
  characterName?: string;
  characterImage?: string;
}

export default function IncomingCall() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as CallState;

  const characterName = state?.characterName || '딸램❤️';
  const characterImage = state?.characterImage || '';

  const handleAccept = () => {
    // 통화 수락 - calling 화면으로 이동
    navigate('/calling', { 
      state: { 
        characterName,
        characterImage,
      } 
    });
  };

  const handleDecline = () => {
    // 통화 거절 - 홈으로 돌아가기
    navigate('/home');
  };

  return (
    <MobileLayout showNavBar={false}>
      <div 
        className="absolute inset-0 -mx-6 -mt-11 flex flex-col items-center justify-between"
        style={{
          background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 100%)',
        }}
      >
        {/* 배경 이미지 (블러 처리) */}
        <div 
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage: characterImage ? `url(${characterImage})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(20px)',
            transform: 'scale(1.1)',
          }}
        />

        {/* 상단 영역 - 발신자 정보 */}
        <div className="flex flex-col items-center pt-32 z-10">
          {/* 프로필 이미지 */}
          <div className="w-[118px] h-[118px] rounded-full bg-white flex items-center justify-center overflow-hidden shadow-2xl mb-6">
            {characterImage ? (
              <img
                src={characterImage}
                alt={characterName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-[48px] text-[#FF7038] font-bold">
                {characterName[0]}
              </span>
            )}
          </div>

          {/* 발신자 이름 */}
          <h1 className="text-[40px] font-bold text-white mb-3 drop-shadow-lg">
            {characterName}
          </h1>

          {/* AI 캐릭터 안내 */}
          <p className="text-[24px] font-bold text-white opacity-60 drop-shadow-md">
            해당 전화는 AI 캐릭터 입니다.
          </p>
        </div>

        {/* 하단 영역 - 통화 버튼 */}
        <div className="flex items-center justify-center gap-20 pb-32 z-10">
          {/* 거절 버튼 */}
          <div className="flex flex-col items-center gap-3">
            <button
              onClick={handleDecline}
              className="w-20 h-20 bg-[#EB5545] rounded-full shadow-2xl hover:bg-[#D94A3C] transition-all active:scale-95 flex items-center justify-center"
              aria-label="통화 거절"
            >
              <img
                src="/icon/end.svg"
                alt="거절"
                className="w-10 h-10"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            </button>
            <span className="text-[16px] font-semibold text-white drop-shadow-md">
              거절
            </span>
          </div>

          {/* 수락 버튼 */}
          <div className="flex flex-col items-center gap-3">
            <button
              onClick={handleAccept}
              className="w-20 h-20 bg-[#67CE67] rounded-full shadow-2xl hover:bg-[#5BBB5B] transition-all active:scale-95 flex items-center justify-center"
              aria-label="통화 수락"
            >
              <img
                src="/icon/call.svg"
                alt="수락"
                className="w-10 h-10"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            </button>
            <span className="text-[16px] font-bold text-white drop-shadow-md">
              수락
            </span>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
