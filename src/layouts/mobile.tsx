import React from 'react'


interface MobileLayoutProps {
  children: React.ReactNode
  showNavBar?: boolean
}


const MobileLayout: React.FC<MobileLayoutProps> = ({ children, showNavBar = true }) => {
  return (
    <div className="flex justify-center items-center w-full h-screen bg-gray-100">
      {/* 모바일 기기 프레임 */}
      <div
        className="relative bg-white shadow-2xl rounded-[20px] overflow-hidden border border-gray-300"
        style={{
          width: '375px',
          height: '812px',
        }}
      >
        {/* 상단 노치 영역 */}
        <div className="absolute top-0 left-0 w-full h-11 bg-white flex justify-between items-center px-6 pt-2">
          {/* 시간 */}
          <div className="text-sm font-semibold text-black">
            2:54
          </div>
          
          {/* 우측 상태 아이콘들 */}
          <div className="flex items-center gap-2">
            {/* 신호 강도 */}
            <svg width="18" height="12" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="0" y="8" width="2" height="4" rx="0.5" fill="black"/>
              <rect x="4" y="6" width="2" height="6" rx="0.5" fill="black"/>
              <rect x="8" y="4" width="2" height="8" rx="0.5" fill="black"/>
              <rect x="12" y="2" width="2" height="10" rx="0.5" fill="black"/>
              <rect x="16" y="0" width="2" height="12" rx="0.5" fill="black"/>
            </svg>
            
            {/* WiFi */}
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 12C8.82843 12 9.5 11.3284 9.5 10.5C9.5 9.67157 8.82843 9 8 9C7.17157 9 6.5 9.67157 6.5 10.5C6.5 11.3284 7.17157 12 8 12Z" fill="black"/>
              <path d="M8 7.5C9.933 7.5 11.683 8.308 12.95 9.575L14.364 8.161C12.703 6.5 10.457 5.5 8 5.5C5.543 5.5 3.297 6.5 1.636 8.161L3.05 9.575C4.317 8.308 6.067 7.5 8 7.5Z" fill="black"/>
              <path d="M8 2C11.325 2 14.35 3.346 16.485 5.485L15.071 6.899C13.331 5.159 10.804 4 8 4C5.196 4 2.669 5.159 0.929 6.899L-0.485 5.485C1.65 3.346 4.675 2 8 2Z" fill="black"/>
            </svg>
            
            {/* 배터리 */}
            <div className="flex items-center">
              <svg width="25" height="12" viewBox="0 0 25 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* 배터리 본체 */}
                <rect x="0.5" y="1.5" width="20" height="9" rx="2" stroke="black" strokeWidth="1" fill="none"/>
                {/* 배터리 충전 상태 (거의 가득참) */}
                <rect x="2" y="3" width="17" height="6" rx="1" fill="black"/>
                {/* 배터리 돌출부 */}
                <rect x="21" y="4" width="2" height="4" rx="0.5" fill="black"/>
              </svg>
            </div>
          </div>
        </div>

        {/* 실제 앱 컨텐츠 */}
        <div className={`pt-11 px-6 h-full overflow-y-auto ${showNavBar ? 'pb-20' : ''}`}>
          {children}
        </div>

        {/* 하단 NavBar */}
        {showNavBar && (
          <div className="px-6 absolute bottom-0 left-0 w-full h-16 bg-white border-t border-gray-200 flex justify-around items-center">
            
          </div>
        )}
      </div>
    </div>
  )
}

export default MobileLayout