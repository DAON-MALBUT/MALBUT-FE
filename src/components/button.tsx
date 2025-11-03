import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * 버튼 상태
   * - primary: 주요 액션 버튼 (주황색 배경)
   * - outlined: 테두리 버튼 (주황색 테두리)
   * - disabled: 비활성화 버튼 (회색)
   */
  status?: 'primary' | 'outlined' | 'disabled';
  
  /**
   * 전체 너비 사용
   */
  fullWidth?: boolean;
  
  /**
   * 버튼 내용
   */
  children: React.ReactNode;
  
  /**
   * 클릭 이벤트 핸들러
   * @example onClick={() => console.log('clicked')}
   */
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      status = 'primary',
      fullWidth = false,
      children,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    // 기본 스타일 - Figma 디자인 기준
    const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
    
    // Figma에서 가져온 정확한 크기
    // width: 343px, height: 44px
    const sizeStyles = 'h-[44px] px-6';
    
    // Status별 스타일 (Figma 디자인 정확히 반영)
    const statusStyles = {
      // Primary: 배경 #FF7038, 텍스트 #F5F5F5
      primary: 'bg-[#FF7038] text-[#F5F5F5] hover:bg-[#FF5520] active:bg-[#E65020] focus:ring-[#FF7038]',
      
      // Outlined: 테두리 #FF7038, 텍스트 #FF7038, 배경 투명
      outlined: 'border-2 border-[#FF7038] text-[#FF7038] bg-white hover:bg-[#FFF5F0] active:bg-[#FFE5DC] focus:ring-[#FF7038]',
      
      // Disabled: 배경 #AAAAAA, 텍스트 #F5F5F5
      disabled: 'bg-[#AAAAAA] text-[#F5F5F5] cursor-not-allowed',
    };

    // 전체 너비 스타일
    const widthStyle = fullWidth ? 'w-full' : 'w-[343px]';

    // 최종 클래스 조합
    const buttonClasses = `
      ${baseStyles}
      ${sizeStyles}
      ${statusStyles[status]}
      ${widthStyle}
      ${className}
    `.trim().replace(/\s+/g, ' ');

    // disabled 상태 처리
    const isDisabled = disabled || status === 'disabled';

    return (
      <button
        ref={ref}
        className={buttonClasses}
        disabled={isDisabled}
        {...props}
      >
        <span className="text-[15px] font-semibold leading-[17.9px] text-center">
          {children}
        </span>
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
