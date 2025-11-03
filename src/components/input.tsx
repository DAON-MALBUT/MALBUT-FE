import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * 인풋 라벨 (상단에 표시)
   */
  label?: string;
  
  /**
   * 에러 메시지
   */
  error?: string;
  
  /**
   * 전체 너비 사용
   */
  fullWidth?: boolean;
  
  /**
   * 입력 값
   * @example value={name}
   */
  value?: string;
  
  /**
   * 변경 이벤트 핸들러
   * @example onChange={(e) => setName(e.target.value)}
   */
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  
  /**
   * 플레이스홀더
   * @example placeholder="이름을 입력하세요"
   */
  placeholder?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      fullWidth = false,
      className = '',
      ...props
    },
    ref
  ) => {
    // 컨테이너 너비
    const containerWidth = fullWidth ? 'w-full' : 'w-[343px]';

    return (
      <div className={`${containerWidth}`}>
        {/* 라벨 */}
        {label && (
          <label className="block mb-2 text-[16px] font-normal leading-[22.4px] text-black">
            {label}
          </label>
        )}

        {/* 인풋 필드 */}
        <input
          ref={ref}
          className={`
            w-full h-[33px]
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

        {/* 에러 메시지 */}
        {error && (
          <p className="mt-1 text-sm text-red-500">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
