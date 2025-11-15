import React, { useRef, useState, useEffect } from 'react';
import MicRecorder from 'mic-recorder-to-mp3';
import Button from '@/components/button';

// lamejs를 전역으로 로드
if (typeof window !== 'undefined' && !(window as any).lamejs) {
  import('lamejs').then((lamejs) => {
    (window as any).lamejs = lamejs;
  });
}

interface Step3Props {
  audioFile: File | null;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSkip: () => void;
  onComplete: () => void;
  isCompleteEnabled: boolean;
}

const Step3: React.FC<Step3Props> = ({
  audioFile,
  onFileUpload,
  onSkip,
  onComplete,
  isCompleteEnabled,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recorderRef = useRef<MicRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedFile, setRecordedFile] = useState<File | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    // lamejs 로드 확인 및 MicRecorder 인스턴스 생성
    const initRecorder = async () => {
      // lamejs가 로드될 때까지 대기
      if (typeof window !== 'undefined' && !(window as any).lamejs) {
        const lamejs = await import('lamejs');
        (window as any).lamejs = lamejs;
      }
      
      recorderRef.current = new MicRecorder({ bitRate: 128 });
    };

    initRecorder();

    return () => {
      // 컴포넌트 언마운트 시 녹음 중지
      if (isRecording && recorderRef.current) {
        recorderRef.current.stop();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isRecording) {
      // 녹음 시간 타이머 시작
      timerRef.current = window.setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      // 녹음 중지 시 타이머 정리
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const startRecording = async () => {
    try {
      if (!recorderRef.current) return;
      
      await recorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);
      console.log('🎤 Recording started');
    } catch (error) {
      console.error('Failed to start recording:', error);
      alert('마이크 접근 권한이 필요합니다.');
    }
  };

  const stopRecording = async () => {
    try {
      if (!recorderRef.current) return;

      const [, blob] = await recorderRef.current.stop().getMp3();
      
      // Blob을 File로 변환
      const file = new File(
        [blob],
        `recording_${Date.now()}.mp3`,
        { type: 'audio/mp3' }
      );

      console.log('✅ Recording stopped:', file);
      setRecordedFile(file);
      setIsRecording(false);
      
      // 부모 컴포넌트에 파일 전달
      const fakeEvent = {
        target: {
          files: [file]
        }
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      
      onFileUpload(fakeEvent);
    } catch (error) {
      console.error('Failed to stop recording:', error);
      setIsRecording(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentFile = recordedFile || audioFile;


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
          음성파일이 있다면
          <br />
          업로드해 주세요
        </h1>
        <p className="text-[16px] font-normal leading-[22.4px] text-[#AAAAAA]">
          최대 1개까지 올릴 수 있어요.
        </p>
      </div>

      {/* 파일 업로드 영역 */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 gap-6">
        {/* 녹음 또는 파일 업로드 선택 */}
        {!currentFile && !isRecording && (
          <>
            {/* 녹음 버튼 */}
            <div
              onClick={startRecording}
              className="w-[200px] h-[200px] border-2 border-[#FF7038] bg-[#FFF5F0] rounded-xl flex items-center justify-center cursor-pointer hover:bg-[#FFE5D9] transition-colors"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-[#FF7038] rounded-full flex items-center justify-center">
                  <div className="w-6 h-6 bg-white rounded-full" />
                </div>
                <p className="text-[16px] font-semibold text-[#FF7038]">
                  음성 녹음하기
                </p>
              </div>
            </div>

            {/* 구분선 */}
            <div className="flex items-center gap-4 w-full max-w-[200px]">
              <div className="flex-1 h-[1px] bg-[#E0E0E0]" />
              <span className="text-[14px] text-[#AAAAAA]">또는</span>
              <div className="flex-1 h-[1px] bg-[#E0E0E0]" />
            </div>

            {/* 파일 업로드 버튼 */}
            <div
              onClick={handleUploadClick}
              className="w-[200px] h-[80px] border border-[#AAAAAA] rounded-xl flex items-center justify-center cursor-pointer hover:border-[#FF7038] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 flex items-center justify-center">
                  <img
                    src="/icon/file_upload.svg"
                    alt="파일 업로드"
                    className="w-full h-full"
                  />
                </div>
                <p className="text-[15px] font-normal text-[#AAAAAA]">
                  파일에서 선택
                </p>
              </div>
            </div>
          </>
        )}

        {/* 녹음 중 */}
        {isRecording && (
          <div className="w-[200px] h-[200px] border-2 border-[#FF7038] bg-[#FFF5F0] rounded-xl flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-[#FF7038] rounded-full flex items-center justify-center animate-pulse">
                <div className="w-6 h-6 bg-white rounded-full" />
              </div>
              <p className="text-[16px] font-semibold text-[#FF7038]">
                녹음 중...
              </p>
              <p className="text-[20px] font-mono text-[#FF7038]">
                {formatTime(recordingTime)}
              </p>
              <button
                onClick={stopRecording}
                className="mt-2 px-6 py-2 bg-[#FF7038] text-white rounded-lg hover:bg-[#E66030] transition-colors"
              >
                녹음 중지
              </button>
            </div>
          </div>
        )}

        {/* 파일이 선택/녹음된 경우 */}
        {currentFile && !isRecording && (
          <div className="w-[200px] border-2 border-[#FF7038] bg-[#FFF5F0] rounded-xl p-6">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-[#FF7038] rounded-full flex items-center justify-center">
                <img
                  src="/icon/file_upload.svg"
                  alt="파일"
                  className="w-8 h-8 brightness-0 invert"
                />
              </div>
              <p className="text-[14px] font-normal text-[#333333] text-center break-all">
                {currentFile.name}
              </p>
              <p className="text-[12px] text-[#AAAAAA]">
                {(currentFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
              <button
                onClick={() => {
                  setRecordedFile(null);
                  // 파일 입력 리셋
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
                className="text-[14px] text-[#FF7038] hover:underline"
              >
                다시 선택
              </button>
            </div>
          </div>
        )}

        {/* 숨겨진 파일 입력 */}
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          onChange={(e) => {
            setRecordedFile(null);
            onFileUpload(e);
          }}
          className="hidden"
        />
      </div>

      {/* 하단 버튼 영역 */}
      <div className="flex gap-2 px-4 pb-8">
        {/* 건너뛰기 버튼 */}
        <div className="flex-1">
          <Button status="outlined" onClick={onSkip} fullWidth>
            건너뛰기
          </Button>
        </div>

        {/* 완료 버튼 */}
        <div className="flex-1">
          <Button
            status={isCompleteEnabled ? 'primary' : 'disabled'}
            onClick={onComplete}
            disabled={!isCompleteEnabled}
            fullWidth
          >
            완료
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Step3;
