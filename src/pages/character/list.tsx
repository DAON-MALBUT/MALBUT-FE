import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileLayout from '@/layouts/mobile';
import { characterApi } from '@/api/client';

interface Character {
  id: string;
  name: string;
  image: string;
  relationship: string;
  phone: string;
  birthDate: string;
  voice_id: string;
  personality?: string;
  createdAt?: string;
}

// 초성 추출 함수
const getChosung = (str: string): string => {
  const cho = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
  const firstChar = str.charAt(0);
  const code = firstChar.charCodeAt(0) - 44032;
  if (code > -1 && code < 11172) {
    return cho[Math.floor(code / 588)];
  }
  return firstChar;
};

export default function CharacterList() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCharacters = async () => {
      try {
        const response = await characterApi.listCharacters();
        const mappedCharacters: Character[] = response.map((char) => ({
          id: char.character_id,
          name: char.name,
          image: '',
          relationship: char.description || '',
          phone: '',
          birthDate: '',
          voice_id: char.voice_id || '',
          personality: char.personality_traits?.join(', '),
          createdAt: char.created_at,
        }));
        setCharacters(mappedCharacters);
      } catch (error) {
        console.error('Failed to load characters:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCharacters();
  }, []);

  // 검색 필터링
  const filteredCharacters = useMemo(() => {
    if (!searchQuery) return characters;
    return characters.filter((char) =>
      char.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [characters, searchQuery]);

  // 초성별 그룹화
  const groupedCharacters = useMemo(() => {
    const groups: { [key: string]: Character[] } = {};
    filteredCharacters.forEach((char) => {
      const chosung = getChosung(char.name);
      if (!groups[chosung]) {
        groups[chosung] = [];
      }
      groups[chosung].push(char);
    });
    // 초성 순서대로 정렬
    return Object.keys(groups)
      .sort()
      .reduce((acc, key) => {
        acc[key] = groups[key];
        return acc;
      }, {} as { [key: string]: Character[] });
  }, [filteredCharacters]);

  const handleCharacterClick = (characterId: string) => {
    console.log('캐릭터 상세:', characterId);
  };

  const handleCall = (character: Character) => {
    navigate('/calling', {
      state: {
        characterId: character.id,
        characterName: character.name,
        characterImage: character.image,
        phoneNumber: character.phone,
        voiceId: character.voice_id,
      }
    });
  };

  const handleAddCharacter = () => {
    navigate('/character/init');
  };

  return (
    <MobileLayout>
      <div className="flex flex-col h-full">
        {/* 검색창 */}
        <div className="pt-6 pb-4">
          <div className="relative bg-[#F1F1F1] border-2 border-[#AAAAAA] rounded-full h-12 flex items-center px-5">
            <img
              src="/icon/search.svg"
              alt="검색"
              className="w-7 h-7 mr-3"
              style={{
                filter: 'brightness(0) saturate(100%) invert(71%) sepia(0%) saturate(0%) hue-rotate(201deg) brightness(92%) contrast(87%)',
              }}
            />
            <input
              type="text"
              placeholder="검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none text-[20px] text-[#111111] placeholder-[#AAAAAA]"
            />
          </div>
        </div>

        {/* 나(본인) 섹션 - 제거 또는 숨김 */}
        {/* <div className="mb-6">
          <div className="border-b-2 border-[#AAAAAA] border-opacity-40 pb-4">
            <button
              onClick={() => handleCharacterClick('me')}
              className="w-full flex items-center gap-4 px-0 py-3 hover:bg-gray-50 transition-colors rounded-lg active:scale-98"
            >
              <span className="text-[20px] font-bold text-[#111111]">
                나(조하민)
              </span>
            </button>
          </div>
        </div> */}

        {/* 친구 목록 */}
        <div className="flex-1 overflow-y-auto pb-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <p className="text-[20px] text-[#AAAAAA] mb-6">
                로딩 중...
              </p>
            </div>
          ) : Object.keys(groupedCharacters).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <p className="text-[20px] text-[#AAAAAA] mb-6">
                검색 결과가 없습니다
              </p>
            </div>
          ) : (
            Object.entries(groupedCharacters).map(([chosung, chars]) => (
              <div key={chosung} className="mb-8">
                {/* 초성 헤더 */}
                <div className="text-[18px] font-semibold text-[#AAAAAA] mb-4 px-1">
                  {chosung}
                </div>

                {/* 캐릭터 리스트 */}
                <div className="space-y-0">
                  {chars.map((character, index) => (
                    <div
                      key={character.id}
                      className={`w-full flex items-center gap-4 px-0 py-4 ${
                        index !== chars.length - 1
                          ? 'border-b-2 border-[#AAAAAA] border-opacity-40'
                          : ''
                      }`}
                    >
                      {/* 프로필 이미지 */}
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FFE8DD] to-[#FFD4C4] flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm">
                        {character.image ? (
                          <img
                            src={character.image}
                            alt={character.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-[20px] text-[#FF7038] font-bold">
                            {character.name[0]}
                          </span>
                        )}
                      </div>

                      {/* 이름 */}
                      <button
                        onClick={() => handleCharacterClick(character.id)}
                        className="flex-1 text-left"
                      >
                        <span className="text-[20px] font-bold text-[#111111]">
                          {character.name}
                        </span>
                      </button>

                      {/* 전화 버튼 */}
                      <button
                        onClick={() => handleCall(character)}
                        className="w-10 h-10 bg-[#22C55E] rounded-full flex items-center justify-center hover:bg-[#16A34A] transition-all active:scale-95 shadow-md"
                        aria-label="전화 걸기"
                      >
                        <img
                          src="/icon/call.svg"
                          alt="전화"
                          className="w-5 h-5"
                          style={{ filter: 'brightness(0) invert(1)' }}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* 추가 버튼 - 플로팅 */}
        <div className="absolute bottom-24 right-6">
          <button
            onClick={handleAddCharacter}
            className="w-14 h-14 bg-[#FF7038] rounded-full shadow-xl hover:bg-[#E6622F] transition-all active:scale-95 flex items-center justify-center"
          >
            <span className="text-white text-[28px] font-light leading-none">
              +
            </span>
          </button>
        </div>
      </div>
    </MobileLayout>
  );
}