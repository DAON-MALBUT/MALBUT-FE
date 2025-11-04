import { useState, useRef, useEffect } from 'react';

interface DropdownProps {
  /**
   * 드롭다운 라벨 (상단에 표시)
   */
  label?: string;
  
  /**
   * 선택된 값
   */
  value: string;
  
  /**
   * 선택 변경 이벤트 핸들러
   */
  onChange: (value: string) => void;
  
  /**
   * 드롭다운 옵션 목록
   */
  options: string[];
  
  /**
   * 플레이스홀더
   */
  placeholder?: string;
  
  /**
   * 전체 너비 사용
   */
  fullWidth?: boolean;
}

export default function Dropdown({
  label,
  value,
  onChange,
  options,
  placeholder = '선택해주세요',
  fullWidth = false,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  const containerWidth = fullWidth ? 'w-full' : 'w-[343px]';

  return (
    <div className={`${containerWidth} relative`} ref={dropdownRef}>
      {/* 라벨 */}
      {label && (
        <label className="block mb-2 text-[16px] font-normal leading-[22.4px] text-[#000000]">
          {label}
        </label>
      )}

      {/* 드롭다운 버튼 */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-[33px] px-0 flex items-center justify-between border-0 border-b border-[#AAAAAA] bg-transparent text-left transition-colors duration-200 focus:outline-none focus:border-b-[#FF7038]"
      >
        <span className="text-[18px] font-normal leading-[25.2px] text-[#111111]">
          {value || placeholder}
        </span>
        <div className="w-6 h-6 flex items-center justify-center">
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 6L8 10L12 6"
              stroke="#111111"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </button>

      {/* 드롭다운 메뉴 */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#AAAAAA] rounded-[4px] shadow-lg z-50 max-h-[192px] overflow-y-auto">
          {options.map((option, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSelect(option)}
              className="w-full h-[44px] px-2 text-left text-[18px] font-normal leading-[25.2px] text-[#000000] hover:bg-gray-50 transition-colors duration-150"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
