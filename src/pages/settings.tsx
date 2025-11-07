import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileLayout from '@/layouts/mobile';

interface UserProfile {
  name: string;
  birthDate: string;
  gender: string;
  profileImage: string | null;
}

export default function Settings() {
  const navigate = useNavigate();
  const [userProfile] = useState<UserProfile>({
    name: '홍길동',
    birthDate: '1990.01.01',
    gender: '남자',
    profileImage: null,
  });

  const settingsMenu = [
    {
      category: '앱 설정',
      items: [
        {
          id: 'permission',
          icon: '/icon/athentication.svg',
          label: '권한 관리',
          onClick: () => {
            navigate('/permission');
          },
        },
      ],
    },
    {
      category: '도움말',
      items: [
        {
          id: 'faq',
          icon: '/icon/question.svg',
          label: '자주 묻는 질문',
          onClick: () => navigate('/faq'),
        },
      ],
    },
  ];

  return (
    <MobileLayout>
      <div className="flex flex-col h-full">
        {/* 상단 타이틀 */}
        <div className="pt-6 pb-6">
          <h1 className="text-[32px] font-bold text-[#111111]">설정</h1>
        </div>

        {/* 프로필 카드 */}
        <div className="bg-gradient-to-br from-[#FF7038] to-[#FF8C5A] rounded-3xl p-6 mb-8 shadow-lg">
          <div className="flex items-center gap-4">
            {/* 프로필 이미지 */}
            <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center overflow-hidden shadow-md">
              {userProfile.profileImage ? (
                <img
                  src={userProfile.profileImage}
                  alt="프로필"
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src="/icon/person.svg"
                  alt="프로필"
                  className="w-10 h-10 opacity-60"
                />
              )}
            </div>

            {/* 사용자 정보 */}
            <div className="flex-1">
              <h2 className="text-[24px] font-bold text-white mb-2">
                {userProfile.name}
              </h2>
            </div>
          </div>
        </div>

        {/* 설정 메뉴 */}
        <div className="flex-1 overflow-y-auto pb-4">
          {settingsMenu.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-8">
              {/* 카테고리 제목 */}
              <h3 className="text-[18px] font-bold text-[#111111] mb-4 px-2">
                {section.category}
              </h3>

              {/* 메뉴 아이템 */}
              <div className="space-y-3">
                {section.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={item.onClick}
                    className="w-full bg-white rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition-all active:scale-98"
                  >
                    <div className="flex items-center gap-4 px-6 py-5">
                      {/* 아이콘 */}
                      <div className="w-12 h-12 bg-gradient-to-br from-[#FFF5F0] to-[#FFE8DD] rounded-full flex items-center justify-center flex-shrink-0">
                        <img
                          src={item.icon}
                          alt={item.label}
                          className="w-7 h-7"
                          style={{
                            filter: 'brightness(0) saturate(100%) invert(47%) sepia(79%) saturate(2476%) hue-rotate(346deg) brightness(104%) contrast(97%)',
                          }}
                        />
                      </div>

                      {/* 라벨 */}
                      <span className="flex-1 text-left text-[20px] font-semibold text-[#111111]">
                        {item.label}
                      </span>

                      {/* 화살표 */}
                      <img
                        src="/icon/arrow_right.svg"
                        alt="이동"
                        className="w-10 h-10 flex-shrink-0"
                        style={{
                          filter: 'brightness(0) saturate(100%) invert(71%) sepia(0%) saturate(0%) hue-rotate(201deg) brightness(92%) contrast(87%)',
                        }}
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}


          {/* 앱 버전 정보 */}
          <div className="mt-6 text-center">
            <p className="text-[16px] text-[#AAAAAA]">
              버전 1.0.0
            </p>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
