import React from 'react'
import Header from '@/components/header'


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
        <Header />

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