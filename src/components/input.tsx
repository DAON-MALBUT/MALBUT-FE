
import React, { useState, useEffect, useRef, useCallback, useId } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useVoiceStore } from '@/stores/voiceStore';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  required?: boolean;
  error?: string;
  fullWidth?: boolean;
  useMicrophone?: boolean;
  videoUrl?: string;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      required = false,
      error,
      fullWidth = false,
      useMicrophone = false,
      videoUrl,
      value,
      onChange,
      className = '',
      ...props
    },
    ref
  ) => {
    const containerWidth = fullWidth ? 'w-full' : 'w-[343px]';
    const inputId = useId(); // 각 Input의 고유 ID

    const [isListening, setIsListening] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const silenceTimerRef = useRef<number | null>(null);
    const lastTranscriptRef = useRef<string>('');
    const isActiveRef = useRef<boolean>(false);

    // Zustand store
    const { activeInputId, setActiveInputId, stopCurrentInput, setStopCurrentInput } = useVoiceStore();

    const {
      transcript,
      listening, // from hook (may not be used directly but available)
      resetTranscript,
      browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    // 안정적인 stop 함수 (useCallback 으로 고정)
    const stopListening = useCallback(() => {
      console.log('[stopListening] called for inputId:', inputId);
      try {
        SpeechRecognition.stopListening();
      } catch (e) {
        console.warn('[stopListening] SpeechRecognition.stopListening() failed', e);
      }
      setIsListening(false);
      isActiveRef.current = false;
      if (silenceTimerRef.current) {
        window.clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
      
      // 전역 상태 초기화 (현재 활성화된 input이 이 input일 경우만)
      if (activeInputId === inputId) {
        setActiveInputId(null);
        setStopCurrentInput(null);
      }
    }, [inputId, activeInputId, setActiveInputId, setStopCurrentInput]);

    // transcript 변경 + isListening 상태를 관찰하여 5초 무응답 자동종료 처리
    useEffect(() => {
      // 로그로 상태 확인
      console.log('[useEffect transcript] inputId=', inputId, ' transcript=', transcript, ' isActive=', isActiveRef.current, ' isListening=', isListening, ' lastTranscript=', lastTranscriptRef.current, ' timer=', silenceTimerRef.current);

      // 현재 활성화된 input이 아니면 무시
      if (!isActiveRef.current || activeInputId !== inputId) {
        return;
      }

      // 만약 새 transcript가 들어왔고 이전과 다르면 값 업데이트 + 타이머 리셋
      if (transcript && transcript !== lastTranscriptRef.current) {
        console.log('[useEffect] new transcript detected:', transcript);
        lastTranscriptRef.current = transcript;

        // 부모 onChange 호출 (synthetic event)
        if (onChange) {
          const syntheticEvent = {
            target: { value: transcript },
            currentTarget: { value: transcript },
          } as React.ChangeEvent<HTMLInputElement>;
          onChange(syntheticEvent);
        }

        // 기존 타이머가 있으면 클리어
        if (silenceTimerRef.current) {
          window.clearTimeout(silenceTimerRef.current);
          silenceTimerRef.current = null;
        }

        // 새 5초 타이머 시작 (마지막 말 이후 5초 무응답시 종료)
        silenceTimerRef.current = window.setTimeout(() => {
          console.log('🕒 5초 무응답 탐지 - 자동 종료');
          stopListening();
        }, 5000);

        return;
      }

      // transcript가 비어있고(아직 아무 말 안함) && 수신 중이면 최초 5초 타이머 시작
      if (!transcript && isListening && !silenceTimerRef.current) {
        console.log('[useEffect] no transcript yet, starting initial 5s timer');
        silenceTimerRef.current = window.setTimeout(() => {
          console.log('🕒 초기 5초 무응답 - 자동 종료');
          stopListening();
        }, 5000);
      }
      // cleanup는 따로 필요 없음 (타이머는 stopListening에서 정리 혹은 다음 new transcript에서 정리)
    }, [transcript, isListening, onChange, stopListening, inputId, activeInputId]);

    // 비디오 재생 완료 후 음성 인식 시작
    const handleVideoEnd = useCallback(() => {
      if (!browserSupportsSpeechRecognition) {
        console.warn('브라우저가 음성 인식을 지원하지 않습니다.');
        return;
      }

      console.log('[handleVideoEnd] start listening for inputId:', inputId);
      resetTranscript();
      lastTranscriptRef.current = '';
      isActiveRef.current = true; // 이 input을 활성화
      
      // 전역 상태 업데이트
      setActiveInputId(inputId);
      setStopCurrentInput(() => stopListening);
      
      try {
        SpeechRecognition.startListening({
          continuous: true,
          language: 'ko-KR'
        });
      } catch (e) {
        console.warn('[handleVideoEnd] startListening failed', e);
      }
      setIsListening(true);

      // 기존 타이머가 있으면 제거하고 새로 시작 (중복 방지)
      if (silenceTimerRef.current) {
        window.clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
      silenceTimerRef.current = window.setTimeout(() => {
        console.log('🕒 handleVideoEnd initial 5s timer expired -> stop');
        stopListening();
      }, 5000);
    }, [browserSupportsSpeechRecognition, resetTranscript, inputId, setActiveInputId, setStopCurrentInput, stopListening]);

    // 마이크 버튼 클릭 핸들러
    const handleMicrophoneClick = () => {
      if (!browserSupportsSpeechRecognition) {
        alert('브라우저가 음성 인식을 지원하지 않습니다.');
        return;
      }

      // 현재 이 input이 활성화 중이면 중지
      if (isListening && activeInputId === inputId) {
        stopListening();
        return;
      }

      // 다른 input이 활성화 중이면 먼저 중지
      if (activeInputId && activeInputId !== inputId && stopCurrentInput) {
        console.log('[handleMicrophoneClick] stopping other input:', activeInputId);
        stopCurrentInput();
      }

      // 비디오가 있으면 재생 시도
      if (videoUrl && videoRef.current) {
        videoRef.current.play().catch((error) => {
          console.warn('비디오 재생 실패, 바로 음성 인식 시작:', error);
          handleVideoEnd();
        });
      } else {
        // 비디오 없으면 바로 음성 인식 시작
        handleVideoEnd();
      }
    };

    // 컴포넌트 언마운트 시 정리
    useEffect(() => {
      return () => {
        console.log('[unmount] cleaning up');
        if (silenceTimerRef.current) {
          window.clearTimeout(silenceTimerRef.current);
          silenceTimerRef.current = null;
        }
        try {
          SpeechRecognition.stopListening();
        } catch (e) {
          // 무시
        }
        isActiveRef.current = false;
      };
    }, []);

    const [isListening, setIsListening] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const silenceTimerRef = useRef<number | null>(null);
    const lastTranscriptRef = useRef<string>('');
    const isActiveRef = useRef<boolean>(false);

    const {
      transcript,
      listening, // from hook (may not be used directly but available)
      resetTranscript,
      browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    // 안정적인 stop 함수 (useCallback 으로 고정)
    const stopListening = useCallback(() => {
      console.log('[stopListening] called');
      try {
        SpeechRecognition.stopListening();
      } catch (e) {
        console.warn('[stopListening] SpeechRecognition.stopListening() failed', e);
      }
      setIsListening(false);
      isActiveRef.current = false;
      if (silenceTimerRef.current) {
        window.clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
    }, []);

    // transcript 변경 + isListening 상태를 관찰하여 5초 무응답 자동종료 처리
    useEffect(() => {
      // 로그로 상태 확인
      console.log('[useEffect transcript] transcript=', transcript, ' isActive=', isActiveRef.current, ' isListening=', isListening, ' lastTranscript=', lastTranscriptRef.current, ' timer=', silenceTimerRef.current);

      if (!isActiveRef.current) {
        // 활성화(이 input에 대한 음성 인식)가 아니면 무시
        return;
      }

      // 만약 새 transcript가 들어왔고 이전과 다르면 값 업데이트 + 타이머 리셋
      if (transcript && transcript !== lastTranscriptRef.current) {
        console.log('[useEffect] new transcript detected:', transcript);
        lastTranscriptRef.current = transcript;

        // 부모 onChange 호출 (synthetic event)
        if (onChange) {
          const syntheticEvent = {
            target: { value: transcript },
            currentTarget: { value: transcript },
          } as React.ChangeEvent<HTMLInputElement>;
          onChange(syntheticEvent);
        }

        // 기존 타이머가 있으면 클리어
        if (silenceTimerRef.current) {
          window.clearTimeout(silenceTimerRef.current);
          silenceTimerRef.current = null;
        }

        // 새 5초 타이머 시작 (마지막 말 이후 5초 무응답시 종료)
        silenceTimerRef.current = window.setTimeout(() => {
          console.log('🕒 5초 무응답 탐지 - 자동 종료');
          stopListening();
        }, 5000);

        return;
      }

      // transcript가 비어있고(아직 아무 말 안함) && 수신 중이면 최초 5초 타이머 시작
      if (!transcript && isListening && !silenceTimerRef.current) {
        console.log('[useEffect] no transcript yet, starting initial 5s timer');
        silenceTimerRef.current = window.setTimeout(() => {
          console.log('🕒 초기 5초 무응답 - 자동 종료');
          stopListening();
        }, 5000);
      }
      // cleanup는 따로 필요 없음 (타이머는 stopListening에서 정리 혹은 다음 new transcript에서 정리)
    }, [transcript, isListening, onChange, stopListening]);

    // 비디오 재생 완료 후 음성 인식 시작
    const handleVideoEnd = () => {
      if (!browserSupportsSpeechRecognition) {
        console.warn('브라우저가 음성 인식을 지원하지 않습니다.');
        return;
      }

      console.log('[handleVideoEnd] start listening');
      resetTranscript();
      lastTranscriptRef.current = '';
      isActiveRef.current = true; // 이 input을 활성화
      try {
        SpeechRecognition.startListening({
          continuous: true,
          language: 'ko-KR'
        });
      } catch (e) {
        console.warn('[handleVideoEnd] startListening failed', e);
      }
      setIsListening(true);

      // 기존 타이머가 있으면 제거하고 새로 시작 (중복 방지)
      if (silenceTimerRef.current) {
        window.clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
      silenceTimerRef.current = window.setTimeout(() => {
        console.log('🕒 handleVideoEnd initial 5s timer expired -> stop');
        stopListening();
      }, 5000);
    };

    // 마이크 버튼 클릭 핸들러
    const handleMicrophoneClick = () => {
      if (!browserSupportsSpeechRecognition) {
        alert('브라우저가 음성 인식을 지원하지 않습니다.');
        return;
      }

      if (isListening) {
        stopListening();
        return;
      }

      // 비디오가 있으면 재생 시도
      if (videoUrl && videoRef.current) {
        videoRef.current.play().catch((error) => {
          console.warn('비디오 재생 실패, 바로 음성 인식 시작:', error);
          handleVideoEnd();
        });
      } else {
        // 비디오 없으면 바로 음성 인식 시작
        handleVideoEnd();
      }
    };

    // 컴포넌트 언마운트 시 정리
    useEffect(() => {
      return () => {
        console.log('[unmount] cleaning up');
        if (silenceTimerRef.current) {
          window.clearTimeout(silenceTimerRef.current);
          silenceTimerRef.current = null;
        }
        try {
          SpeechRecognition.stopListening();
        } catch (e) {
          // 무시
        }
        isActiveRef.current = false;
      };
    }, []);

    return (
      <div className={`${containerWidth}`}>
        {label && (
          <label className="block mb-2 text-[16px] font-normal leading-[22.4px] text-black">
            {label}
            {required && <span className="text-[16px] font-normal leading-[22.4px] text-[#000000]">*</span>}
          </label>
        )}

        <div className="relative">
          <input
            ref={ref}
            required={required}
            value={value}
            onChange={onChange}
            className={`
              w-full h-[33px]
              ${useMicrophone ? 'pr-8' : 'pr-0'}
              px-0
              text-[18px] font-normal leading-[25.2px] text-black
              placeholder:text-[#AAAAAA]
              bg-transparent
              border-0 border-b border-[#AAAAAA]
              rounded-none
              transition-colors duration-200
              focus:outline-none focus:border-b-[#FF7038] focus:ring-0
              disabled:bg-gray-50 disabled:cursor-not-allowed
              ${error ? 'border-b-red-500 focus:border-b-red-500' : ''}
              ${className}
            `.trim().replace(/\s+/g, ' ')}
            {...props}
          />

          {useMicrophone && (
            <button
              type="button"
              onClick={handleMicrophoneClick}
              className="absolute right-0 bottom-1 w-6 h-6 flex items-center justify-center transition-opacity hover:opacity-70"
            >
              <img
                src="/icon/mike_gray.svg"
                alt="음성 입력"
                className={`w-full h-full ${isListening ? 'animate-pulse' : ''}`}
              />
            </button>
          )}
        </div>

        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}

        {isListening && <p className="mt-1 text-xs text-[#FF7038]">음성을 듣고 있습니다...</p>}

        {videoUrl && (
          <video
            ref={videoRef}
            src={videoUrl}
            onEnded={handleVideoEnd}
            onError={(e) => {
              console.warn('비디오 로드 실패:', e);
              handleVideoEnd();
            }}
            className="hidden"
          />
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;