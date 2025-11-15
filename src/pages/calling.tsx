import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import MobileLayout from '@/layouts/mobile';
import { callApi, characterApi, apiClient } from '@/api/client';
import { CallWebSocket, base64ToBlob } from '@/utils/websocket';
import type { 
  TranscriptionMessage, 
  AIResponseTextMessage, 
  AIResponseAudioMessage 
} from '@/utils/websocket';

interface CallingState {
  characterId?: string;
  characterName?: string;
  characterImage?: string;
  phoneNumber?: string;
  voiceId?: string;
}

export default function Calling() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as CallingState;
  
  const {
    transcript,
    finalTranscript,
    interimTranscript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();
  
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const wsRef = useRef<CallWebSocket | null>(null);
  const sessionIdRef = useRef<string | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const callStartTimeRef = useRef<Date | null>(null);
  const canListenRef = useRef<boolean>(true);
  const lastSentTranscriptRef = useRef<string>('');
  const silenceTimerRef = useRef<number | null>(null);

  const characterId = state?.characterId || '';
  const characterName = state?.characterName || '알 수 없음';
  const characterImage = state?.characterImage || '';
  const phoneNumber = state?.phoneNumber || '';

  // 브라우저가 음성 인식을 지원하지 않는 경우
  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      alert('브라우저가 음성 인식을 지원하지 않습니다.');
      navigate('/home');
    }
  }, [browserSupportsSpeechRecognition, navigate]);

  // transcript 변경 감지 및 전송
  useEffect(() => {
    if (!wsRef.current || !canListenRef.current || isAiSpeaking) return;

    // interim transcript가 있으면 화면에 표시 (아직 전송하지 않음)
    if (interimTranscript) {
      console.log('🎤 Interim:', interimTranscript);
      setTranscription(transcript); // 전체 transcript 표시 (final + interim)
      
      // 침묵 타이머 리셋
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
      
      // 1.5초 침묵 후 전송
      silenceTimerRef.current = window.setTimeout(() => {
        if (transcript && transcript !== lastSentTranscriptRef.current) {
          console.log('📤 Sending after silence:', transcript);
          wsRef.current?.sendTextInput(transcript);
          lastSentTranscriptRef.current = transcript;
          setTranscription(transcript);
          resetTranscript();
        }
      }, 1800);
    }
    
    // final transcript가 있으면 즉시 전송
    if (finalTranscript && finalTranscript !== lastSentTranscriptRef.current) {
      console.log('✅ Final transcript:', finalTranscript);
      
      // 침묵 타이머 취소
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
      
      wsRef.current.sendTextInput(finalTranscript);
      lastSentTranscriptRef.current = finalTranscript;
      setTranscription(finalTranscript);
      
      // 약간의 지연 후 리셋 (다음 입력 준비)
      setTimeout(() => {
        resetTranscript();
        lastSentTranscriptRef.current = '';
      }, 500);
    }
  }, [transcript, finalTranscript, interimTranscript, isAiSpeaking, resetTranscript]);

  // 통화 세션 시작 및 WebSocket 연결
  useEffect(() => {
    const initCall = async () => {
      try {
        console.log('📞 Starting call session...');
        const response = await callApi.startSession(characterId || undefined);
        console.log('✅ Session created:', response);
        
        sessionIdRef.current = response.session_id;
        callStartTimeRef.current = new Date();

        const baseUrl = apiClient.defaults.baseURL || '';
        console.log('🌐 Base URL:', baseUrl);
        
        const ws = new CallWebSocket(baseUrl);
        wsRef.current = ws;

        await ws.connect(response.session_id);
        console.log('✅ WebSocket connected');
        setIsConnected(true);

        ws.on('transcription', (msg) => {
          const transcriptMsg = msg as TranscriptionMessage;
          console.log('📝 Transcription received:', transcriptMsg);
          if (transcriptMsg.is_final) {
            setTranscription(transcriptMsg.text);
          }
        });

        ws.on('ai_response_text', (msg) => {
          const textMsg = msg as AIResponseTextMessage;
          console.log('💬 AI Response Text:', textMsg.text);
          setAiResponse(textMsg.text);
        });

        ws.on('ai_response_audio', async (msg) => {
          const audioMsg = msg as AIResponseAudioMessage;
          console.log('🔊 AI Response Audio received:', audioMsg.audio_url);
          
          // AI 응답 시작 - 음성 인식 중지
          canListenRef.current = false;
          setIsAiSpeaking(true);
          SpeechRecognition.stopListening();
          resetTranscript();
          
          if (audioRef.current && audioMsg.audio_data) {
            const blob = base64ToBlob(audioMsg.audio_data);
            const url = URL.createObjectURL(blob);
            audioRef.current.src = url;
            
            // 오디오 재생 완료 후 음성 인식 다시 시작
            audioRef.current.onended = () => {
              console.log('✅ AI finished speaking');
              setIsAiSpeaking(false);
              canListenRef.current = true;
              if (!isMuted) {
                SpeechRecognition.startListening({ 
                  language: 'ko-KR', 
                  continuous: true 
                });
              }
            };
            
            await audioRef.current.play().catch(err => {
              console.error('Audio play failed:', err);
              setIsAiSpeaking(false);
              canListenRef.current = true;
              if (!isMuted) {
                SpeechRecognition.startListening({ 
                  language: 'ko-KR', 
                  continuous: true 
                });
              }
            });
          }
        });

        ws.on('error', (msg) => {
          console.error('❌ WebSocket error:', msg);
        });

        ws.on('*', (msg) => {
          console.log('📨 WebSocket message:', msg);
        });

        await startMicrophone();
      } catch (error) {
        console.error('❌ Failed to start call:', error);
        
        let errorMessage = '통화 연결에 실패했습니다.';
        if (error instanceof Error) {
          if (error.message.includes('timeout')) {
            errorMessage = '서버 응답 시간 초과. 서버 상태를 확인해주세요.';
          } else if (error.message.includes('closed')) {
            errorMessage = 'WebSocket 연결이 거부되었습니다. 서버가 실행 중인지 확인해주세요.';
          } else {
            errorMessage = `연결 실패: ${error.message}`;
          }
        }
        
        alert(errorMessage);
        navigate('/character');
      }
    };

    initCall();

    return () => {
      if (wsRef.current) {
        wsRef.current.stopListening();
        wsRef.current.close();
      }
      SpeechRecognition.stopListening();
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
    };
  }, [characterId, navigate]);

  // 통화 시간 타이머
  useEffect(() => {
    if (!isConnected) return;
    
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isConnected]);

  // 통화 시간 포맷팅 (00:00)
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 마이크 권한 요청 및 음성 인식 시작
  const startMicrophone = async () => {
    try {
      console.log('🎤 Requesting microphone access...');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          channelCount: 1,
          sampleRate: 48000,
          echoCancellation: true,
          noiseSuppression: true,
        } 
      });
      audioStreamRef.current = stream;
      console.log('✅ Microphone access granted');

      // 음성 인식 시작
      if (wsRef.current) {
        wsRef.current.startListening('ko-KR', 48000);
      }
      
      SpeechRecognition.startListening({ 
        language: 'ko-KR', 
        continuous: true 
      });
      console.log('🚀 Speech recognition started');
    } catch (error) {
      console.error('❌ Failed to start microphone:', error);
      alert('마이크 접근 권한이 필요합니다.');
    }
  };

  const handleEndCall = async () => {
    if (sessionIdRef.current) {
      const duration = callStartTimeRef.current 
        ? Math.floor((Date.now() - callStartTimeRef.current.getTime()) / 1000)
        : callDuration;

      // 세션 종료
      try {
        await callApi.endSession(sessionIdRef.current);
        console.log('✅ Call session ended');
      } catch (error) {
        console.error('❌ Failed to end session:', error);
      }
      
      // 사용 로깅 (선택적, 실패해도 무시)
      if (characterId) {
        try {
          await characterApi.logUsage(characterId, duration);
          console.log('✅ Usage logged');
        } catch (error) {
          console.warn('⚠️ Failed to log usage (optional):', error);
        }
      }
    }
    
    navigate('/home');
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
    
    if (audioStreamRef.current) {
      audioStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = isMuted;
      });
    }
    
    // 음소거 토글
    if (isMuted) {
      // 음소거 해제 - 음성 인식 시작
      SpeechRecognition.startListening({ 
        language: 'ko-KR', 
        continuous: true 
      });
    } else {
      // 음소거 - 음성 인식 중지
      SpeechRecognition.stopListening();
      resetTranscript();
    }
  };

  const handleToggleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn);
  };

  const handleStopListening = () => {
    console.log('⏹️ User stopped listening');
    
    // 침묵 타이머 정리
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    
    // 현재 transcript가 있으면 전송
    if (transcript && transcript !== lastSentTranscriptRef.current) {
      console.log('📤 Sending before stop:', transcript);
      wsRef.current?.sendTextInput(transcript);
      lastSentTranscriptRef.current = transcript;
      setTranscription(transcript);
    }
    
    SpeechRecognition.stopListening();
    resetTranscript();
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

          {/* 실시간 전사 및 AI 응답 표시 */}
          {(transcription || aiResponse || listening || isAiSpeaking) && (
            <div className="mt-8 px-8 max-w-md">
              {listening && !isAiSpeaking && (
                <div className="bg-red-500 bg-opacity-30 backdrop-blur-sm rounded-2xl p-4 mb-3 animate-pulse">
                  <p className="text-[14px] text-white opacity-90">
                    <span className="font-semibold">🎙️ 듣는 중...</span>
                  </p>
                </div>
              )}
              {transcription && (
                <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-4 mb-3">
                  <p className="text-[14px] text-white opacity-90">
                    <span className="font-semibold">사용자:</span> {transcription}
                  </p>
                </div>
              )}
              {isAiSpeaking && (
                <div className="bg-blue-500 bg-opacity-30 backdrop-blur-sm rounded-2xl p-4 mb-3 animate-pulse">
                  <p className="text-[14px] text-white opacity-90">
                    <span className="font-semibold">🔊 {characterName} 말하는 중...</span>
                  </p>
                </div>
              )}
              {aiResponse && !isAiSpeaking && (
                <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-4">
                  <p className="text-[14px] text-white opacity-90">
                    <span className="font-semibold">{characterName}:</span> {aiResponse}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 숨겨진 오디오 엘리먼트 */}
        <audio ref={audioRef} hidden />

        {/* 하단 영역 - 컨트롤 버튼 */}
        <div className="w-full pb-20 z-10">
          {/* 인디케이터 */}
          <div className="flex justify-center mb-6">
            <div className="w-9 h-1 bg-white rounded-full opacity-60" />
          </div>

          {/* 버튼 그룹 */}
          <div className="flex items-center justify-center gap-6 px-8 mb-8">
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

            {/* 녹음 중단 버튼 (듣는 중일 때만 표시) */}
            {listening && !isAiSpeaking && (
              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={handleStopListening}
                  className="w-14 h-14 bg-red-500 rounded-full flex items-center justify-center transition-all shadow-lg hover:bg-red-600 active:scale-95 animate-pulse"
                  aria-label="듣기 중단"
                >
                  <div className="w-4 h-4 bg-white rounded-sm" />
                </button>
                <span className="text-[12px] text-white font-normal">
                  중단
                </span>
              </div>
            )}

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
