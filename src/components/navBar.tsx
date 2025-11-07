

import { useNavigate, useLocation } from 'react-router-dom';

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: 'home', icon: 'home.svg', label: '홈', path: '/' },
    { id: 'friend', icon: 'people.svg', label: '친구', path: '/friends' },
    { id: 'call', icon: 'call.svg', label: '전화', path: '/call' },
    { id: 'setting', icon: 'setting.svg', label: '설정', path: '/settings' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="px-6 absolute bottom-0 left-0 w-full h-16 bg-white border-t border-gray-200 flex justify-around items-center">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => navigate(item.path)}
          className="flex flex-col items-center justify-center gap-1 min-w-[67.75px]"
        >
          {/* 아이콘 */}
          <div className="w-6 h-6 flex items-center justify-center">
            <img
              src={`/icon/${item.icon}`}
              alt={item.label}
              className="w-full h-full object-contain"
              style={{
                filter: isActive(item.path) ? 'none' : 'brightness(0) saturate(100%) invert(71%) sepia(0%) saturate(0%) hue-rotate(201deg) brightness(92%) contrast(87%)',
              }}
            />
          </div>
          
          {/* 라벨 */}
          <span
            className={`text-[16px] font-normal leading-[22px] ${
              isActive(item.path) ? 'text-[#FF7038]' : 'text-[#AAAAAA]'
            }`}
          >
            {item.label}
          </span>
        </button>
      ))}
    </div>
  );
}