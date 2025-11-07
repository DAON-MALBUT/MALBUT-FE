import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MobileLayout from '@/layouts/mobile';

interface CallingState {
  characterName?: string;
  characterImage?: string;
  phoneNumber?: string;
}

export default function Calling() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as CallingState;
  
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);

  const characterName = state?.characterName || '알 수 없음';
  const characterImage = state?.characterImage || '';
  const phoneNumber = state?.phoneNumber || '';

  // 통화 시간 타이머
  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 통화 시간 포맷팅 (00:00)
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    // 통화 종료 - 홈으로 이동
    navigate('/home');
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleToggleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn);
  };

  return (
    <MobileLayout showNavBar={false}>
      <div 
        className="absolute inset-0 -mx-6 -mt-11 flex flex-col items-center justify-between"
        style={{
          background: 'linear-gradient(180deg, rgba(30,30,30,0.5) 0%, rgba(30,30,30,0.5) 100%)',
        }}
      >
        {/* 배경 이미지 (블러 처리) */}
        <div 
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage: characterImage ? `url(${characterImage})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(40px)',
            transform: 'scale(1.2)',
          }}
        />

        {/* 상단 영역 - 발신자 정보 */}
        <div className="flex flex-col items-center pt-32 z-10 flex-1">
          {/* 프로필 이미지 */}
          <div className="w-[120px] h-[120px] rounded-full bg-white flex items-center justify-center overflow-hidden shadow-2xl mb-6">
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
          <h1 className="text-[32px] font-bold text-white mb-2 drop-shadow-lg">
            {characterName}
          </h1>

          {/* 전화번호 */}
          {phoneNumber && (
            <p className="text-[18px] text-white opacity-70 mb-4 drop-shadow-md">
              {phoneNumber}
            </p>
          )}

          {/* 통화 시간 */}
          <p className="text-[24px] font-semibold text-white drop-shadow-lg">
            {formatDuration(callDuration)}
          </p>
        </div>

        {/* 하단 영역 - 컨트롤 버튼 */}
        <div className="w-full pb-20 z-10">
          {/* 인디케이터 */}
          <div className="flex justify-center mb-6">
            <div className="w-9 h-1 bg-white rounded-full opacity-60" />
          </div>

          {/* 버튼 그룹 */}
          <div className="flex items-center justify-center gap-8 px-12 mb-8">
            {/* 음소거 버튼 */}
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={handleToggleMute}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg ${
                  isMuted ? 'bg-[#838080] bg-opacity-100' : 'bg-white bg-opacity-16'
                }`}
                aria-label="음소거"
              >
                <img
                  src={isMuted ? "/icon/no_mike.svg" : "/icon/mike.svg"}
                  alt="음소거"
                  className="w-7 h-7 transition-all duration-300"
                  style={{
                    filter: isMuted ? 'brightness(0) invert(1)' : 'brightness(0) saturate(100%) invert(60%) sepia(0%) saturate(0%)'
                  }}
                />
              </button>
              <span className="text-[12px] text-white font-normal">
                음소거
              </span>
            </div>

            {/* 스피커 버튼 */}
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={handleToggleSpeaker}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
                  isSpeakerOn
                    ? 'bg-[#838080] bg-opacity-100'
                    : 'bg-white bg-opacity-16'
                }`}
                aria-label="스피커"
              >
                <img
                  src="/icon/speacker.svg"
                  alt="스피커"
                  className="w-7 h-7 transition-all duration-300"
                  style={{
                    filter: isSpeakerOn ? 'brightness(0) invert(1)' : 'brightness(0) saturate(100%) invert(60%) sepia(0%) saturate(0%)'
                  }}
                />
              </button>
              <span className="text-[12px] text-white font-normal">
                스피커
              </span>
            </div>

            {/* 종료 버튼 */}
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={handleEndCall}
                className="w-14 h-14 bg-[#EB5545] rounded-full flex items-center justify-center transition-all shadow-lg hover:bg-[#D94A3C] active:scale-95"
                aria-label="통화 종료"
              >
                <img
                  src="/icon/end.svg"
                  alt="종료"
                  className="w-8 h-8"
                  style={{ filter: 'brightness(0) invert(1)' }}
                />
              </button>
              <span className="text-[12px] text-white font-normal">
                end
              </span>
            </div>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
