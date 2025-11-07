import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileLayout from '@/layouts/mobile';

export default function Call() {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedContact] = useState<{ name: string; phone: string } | null>(null); // 추후 연락처 선택 기능 추가 시 사용

  const handleNumberClick = (num: string) => {
    setPhoneNumber((prev) => prev + num);
  };

  const handleDelete = () => {
    setPhoneNumber((prev) => prev.slice(0, -1));
  };

  const handleCall = () => {
    if (phoneNumber) {
      console.log('전화 걸기:', phoneNumber);
      // calling 페이지로 이동
      navigate('/calling', {
        state: {
          characterName: selectedContact?.name || '알 수 없음',
          characterImage: '',
          phoneNumber: formatPhoneNumber(phoneNumber),
        }
      });
    }
  };

  const formatPhoneNumber = (num: string) => {
    // 전화번호 포맷팅 (010-1234-5678)
    const cleaned = num.replace(/\D/g, '');
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 7) return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7, 11)}`;
  };

  const keypadButtons = [
    [
      { value: '1', label: '1' },
      { value: '2', label: '2' },
      { value: '3', label: '3' },
    ],
    [
      { value: '4', label: '4' },
      { value: '5', label: '5' },
      { value: '6', label: '6' },
    ],
    [
      { value: '7', label: '7' },
      { value: '8', label: '8' },
      { value: '9', label: '9' },
    ],
    [
      { value: '*', label: '*' },
      { value: '0', label: '0' },
      { value: '#', label: '#' },
    ],
  ];

  return (
    <MobileLayout>
      <div className="flex flex-col h-full">
        {/* 상단 전화번호 디스플레이 */}
        <div className="pt-6 pb-6">
          <div className="text-center mb-4">
            <div className="text-[32px] font-semibold text-[#000000] tracking-wider min-h-[40px]">
              {formatPhoneNumber(phoneNumber) || ' '}
            </div>
          </div>

          {/* 연락처 정보 */}
          {selectedContact && (
            <div className="flex items-center justify-center gap-3">
              <img
                src="/icon/person.svg"
                alt="연락처"
                className="w-7 h-7"
                style={{
                  filter: 'brightness(0) saturate(100%) invert(71%) sepia(0%) saturate(0%) hue-rotate(201deg) brightness(92%) contrast(87%)',
                }}
              />
              <div className="flex items-center gap-2">
                <span className="text-[20px] text-[#AAAAAA]">
                  {selectedContact.name}
                </span>
                <span className="text-[20px] text-[#000000]">
                  {formatPhoneNumber(selectedContact.phone)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 키패드 */}
        <div className="flex-1 flex flex-col justify-center px-4 pb-6">
          <div className="space-y-5">
            {keypadButtons.map((row, rowIndex) => (
              <div key={rowIndex} className="flex justify-center gap-5">
                {row.map((button) => (
                  <button
                    key={button.value}
                    onClick={() => handleNumberClick(button.value)}
                    className="w-20 h-20 border-2 border-[#AAAAAA] rounded-full flex items-center justify-center text-[28px] font-bold text-[#111111] hover:bg-gray-50 active:bg-gray-100 transition-colors shadow-sm"
                  >
                    {button.label}
                  </button>
                ))}
              </div>
            ))}
          </div>

          {/* 통화 및 삭제 버튼 */}
          <div className="flex justify-center gap-6 mt-10">
            {/* 삭제 버튼 */}
            <button
              onClick={handleDelete}
              disabled={!phoneNumber}
              className="w-20 h-20 rounded-full flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 transition-colors disabled:opacity-30 border-2 border-gray-300"
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21 4H8L1 12L8 20H21C21.5304 20 22.0391 19.7893 22.4142 19.4142C22.7893 19.0391 23 18.5304 23 18V6C23 5.46957 22.7893 4.96086 22.4142 4.58579C22.0391 4.21071 21.5304 4 21 4Z"
                  stroke="#111111"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M18 9L12 15M12 9L18 15"
                  stroke="#111111"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* 통화 버튼 */}
            <button
              onClick={handleCall}
              disabled={!phoneNumber}
              className="w-20 h-20 bg-[#22C55E] rounded-full flex items-center justify-center hover:bg-[#16A34A] active:bg-[#15803D] transition-colors shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <img
                src="/icon/call.svg"
                alt="전화"
                className="w-8 h-8"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            </button>

            {/* 빈 공간 (대칭 맞추기) */}
            <div className="w-20 h-20"></div>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
