import React from 'react'
import Header from '@/components/header'
import NavBar from '@/components/navBar'

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
          <NavBar />
        )}
      </div>
    </div>
  )
}

export default MobileLayout