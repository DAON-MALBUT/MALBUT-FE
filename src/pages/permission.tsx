import { useEffect, useState } from 'react';
import MobileLayout from '@/layouts/mobile';
import Button from '@/components/button';

export default function Permission() {
  const [isAgreed, setIsAgreed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  const [permissionStatus, setPermissionStatus] = useState<Record<string, string>>({});

  // ✅ 페이지 진입 시 권한 자동 요청
  useEffect(() => {
    async function requestPermissions() {
      // 1️⃣ 카메라
      try {
        await navigator.mediaDevices.getUserMedia({ video: true });
        setPermissionStatus((p) => ({ ...p, camera: 'granted' }));
      } catch {
        setPermissionStatus((p) => ({ ...p, camera: 'denied' }));
      }

      // 2️⃣ 마이크
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setPermissionStatus((p) => ({ ...p, microphone: 'granted' }));
      } catch {
        setPermissionStatus((p) => ({ ...p, microphone: 'denied' }));
      }

      // 3️⃣ 알림
      try {
        const result = await Notification.requestPermission();
        setPermissionStatus((p) => ({ ...p, notification: result }));
      } catch {
        setPermissionStatus((p) => ({ ...p, notification: 'denied' }));
      }

      // 4️⃣ 백그라운드 실행 (웹에선 불가능)
      setPermissionStatus((p) => ({
        ...p,
        background: 'unavailable',
      }));
    }

    requestPermissions();
  }, []);

  const permissions = [
    {
      id: 1,
      icon: '/icon/camera.svg',
      title: '사진 및 카메라 접근',
      description: '프로필 사진 등록 및 사진 촬영을 위해 필요합니다.',
      key: 'camera',
    },
    {
      id: 2,
      icon: '/icon/mike.svg',
      title: '마이크 접근',
      description: '음성 녹음 및 음성 인식 기능을 위해 필요합니다.',
      key: 'microphone',
    },
    {
      id: 3,
      icon: '/icon/notification.svg',
      title: '알림 허용',
      description: '중요한 알림을 받기 위해 필요합니다.',
      key: 'notification',
    },
    {
      id: 4,
      icon: '/icon/background.svg',
      title: '백그라운드 실행',
      description: '앱이 백그라운드에서 실행되도록 허용합니다.',
      key: 'background',
    },
  ];

  const toggleAccordion = (id: number) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleStart = () => {
    if (isAgreed) {
      console.log('권한 동의 완료 - 다음 페이지로 이동');
      // 라우팅 추가
    } else {
      alert('개인정보 처리 방침에 동의해주세요.');
    }
  };

  return (
    <MobileLayout showNavBar={false}>
      <div className="flex flex-col h-full">
        {/* 상단 타이틀 */}
        <div className="pt-8 px-4">
          <h1 className="text-[36px] font-semibold leading-[43px] text-[#111111] mb-2 tracking-tight">
            다온 이용 권한을
            <br />
            허용해 주세요
          </h1>
          <p className="text-[16px] text-[#AAAAAA]">
            필요한 권한에 대한 안내를 확인해 주세요.
          </p>
        </div>

        {/* 권한 목록 */}
        <div className="mt-10 px-4">
          <h2 className="text-[16px] text-[#AAAAAA] mb-5">필수 접근 권한</h2>
          <div className="space-y-6">
            {permissions.map((permission) => (
              <div key={permission.id} className="w-full">
                <button
                  onClick={() => toggleAccordion(permission.id)}
                  className="w-full flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={permission.icon}
                      alt={permission.title}
                      className="w-6 h-6"
                    />
                    <span className="text-[18px] text-[#111111]">
                      {permission.title}
                    </span>
                  </div>
                  <img
                    src="/icon/arrow.svg"
                    alt="toggle"
                    className={`w-6 h-3.5 transition-transform ${
                      expandedItems.includes(permission.id) ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {expandedItems.includes(permission.id) && (
                  <div className="mt-2 pl-11 pr-6">
                    <p className="text-[14px] text-[#666666] mb-1">
                      {permission.description}
                    </p>
                    <p className="text-[12px] text-[#FF7038]">
                      상태: {permissionStatus[permission.key] || '요청 중...'}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 하단 */}
        <div className="mt-auto pb-8 px-4">
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setIsAgreed(!isAgreed)}
              className="flex-shrink-0 w-4 h-4 rounded border border-[#AAAAAA] flex items-center justify-center"
              style={{
                backgroundColor: isAgreed ? '#FF7038' : 'transparent',
                borderColor: isAgreed ? '#FF7038' : '#AAAAAA',
              }}
            >
              {isAgreed && (
                <svg
                  className="w-3 h-3"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 6L5 9L10 3"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
            <span className="text-[12px] text-[#AAAAAA]">
              위 내용을 이해했으며 개인정보 처리 방침에 동의합니다.
            </span>
          </div>

          <Button
            status={isAgreed ? 'primary' : 'disabled'}
            fullWidth
            onClick={handleStart}
          >
            시작하기
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
}