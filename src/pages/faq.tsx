import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileLayout from '@/layouts/mobile';

interface FAQItem {
  id: number;
  category: string;
  question: string;
  answer: string;
}

export default function FAQ() {
  const navigate = useNavigate();
  const [openId, setOpenId] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');

  const categories = ['전체', '사용법', '계정/프로필', '통화', '기타'];

  const faqData: FAQItem[] = [
    {
      id: 1,
      category: '사용법',
      question: '다온말벗은 어떻게 사용하나요?',
      answer: '다온말벗은 AI 기반 통화 서비스입니다. 캐릭터를 등록한 후 통화 버튼을 눌러 대화를 시작할 수 있습니다. 캐릭터의 정보를 입력할수록 더 자연스러운 대화가 가능합니다.',
    },
    {
      id: 2,
      category: '계정/프로필',
      question: '프로필 정보는 어떻게 수정하나요?',
      answer: '설정 > 프로필 수정 메뉴에서 이름, 전화번호, 생년월일 등의 정보를 수정할 수 있습니다.',
    },
    {
      id: 3,
      category: '통화',
      question: '통화가 연결되지 않아요.',
      answer: '마이크 권한이 허용되어 있는지 확인해주세요. 설정 > 권한 관리에서 마이크 권한을 확인할 수 있습니다. 네트워크 연결 상태도 확인해주세요.',
    },
    {
      id: 4,
      category: '사용법',
      question: '캐릭터는 몇 명까지 등록할 수 있나요?',
      answer: '캐릭터 등록 개수에는 제한이 없습니다. 원하시는 만큼 캐릭터를 추가하실 수 있습니다.',
    },
    {
      id: 5,
      category: '통화',
      question: '통화 중 소리가 잘 안들려요.',
      answer: '스피커 볼륨을 확인해주세요. 또한 조용한 환경에서 통화하시는 것을 권장드립니다. 블루투스 이어폰 사용 시 연결 상태를 확인해주세요.',
    },
    {
      id: 6,
      category: '계정/프로필',
      question: '캐릭터 정보를 수정할 수 있나요?',
      answer: '네, 캐릭터 목록에서 원하는 캐릭터를 선택하여 정보를 수정할 수 있습니다.',
    },
    {
      id: 7,
      category: '기타',
      question: '데이터는 안전하게 보관되나요?',
      answer: '모든 개인정보는 암호화되어 안전하게 보관됩니다. 사용자의 동의 없이 제3자에게 제공되지 않습니다.',
    },
    {
      id: 8,
      category: '사용법',
      question: '캐릭터를 삭제하고 싶어요.',
      answer: '캐릭터 상세 페이지에서 삭제 버튼을 눌러 캐릭터를 삭제할 수 있습니다. 삭제된 캐릭터는 복구할 수 없으니 신중하게 선택해주세요.',
    },
  ];

  const filteredFAQ = selectedCategory === '전체'
    ? faqData
    : faqData.filter((item) => item.category === selectedCategory);

  const toggleFAQ = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <MobileLayout>
      <div className="flex flex-col h-full">
        {/* 헤더 */}
        <div className="pt-6 pb-4 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors active:scale-95"
          >
            <img
              src="/icon/arrow_left.svg"
              alt="뒤로가기"
              className="w-6 h-6"
              style={{
                filter: 'brightness(0) saturate(100%) invert(7%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(0%) contrast(100%)',
              }}
            />
          </button>
          <h1 className="text-[32px] font-bold text-[#111111]">
            자주 묻는 질문
          </h1>
        </div>

        {/* 카테고리 필터 */}
        <div className="pb-6">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2.5 rounded-full font-semibold text-[16px] whitespace-nowrap transition-all flex-shrink-0 ${
                  selectedCategory === category
                    ? 'bg-[#FF7038] text-white shadow-md'
                    : 'bg-[#F1F1F1] text-[#666666] hover:bg-[#E5E5E5]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ 리스트 */}
        <div className="flex-1 overflow-y-auto pb-4">
          {filteredFAQ.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <p className="text-[20px] text-[#AAAAAA]">
                해당 카테고리에 질문이 없습니다
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredFAQ.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => toggleFAQ(item.id)}
                    className="w-full px-6 py-5 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      {/* Q 아이콘 */}
                      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-[#FF7038] to-[#FF8C5A] rounded-full flex items-center justify-center">
                        <span className="text-white text-[18px] font-bold">
                          Q
                        </span>
                      </div>

                      {/* 질문 */}
                      <div className="flex-1">
                        <p className="text-[18px] font-semibold text-[#111111] leading-relaxed">
                          {item.question}
                        </p>
                      </div>

                      {/* 화살표 아이콘 */}
                      <div className="flex-shrink-0 pt-1">
                        <img
                          src="/icon/arrow_down.svg"
                          alt="펼치기"
                          className={`w-5 h-5 transition-transform ${
                            openId === item.id ? 'rotate-180' : ''
                          }`}
                          style={{
                            filter: 'brightness(0) saturate(100%) invert(71%) sepia(0%) saturate(0%) hue-rotate(201deg) brightness(92%) contrast(87%)',
                          }}
                        />
                      </div>
                    </div>
                  </button>

                  {/* 답변 */}
                  {openId === item.id && (
                    <div className="px-6 pb-5 pt-2 bg-[#FAFAFA]">
                      <div className="flex items-start gap-4">
                        {/* A 아이콘 */}
                        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-[#FFE8DD] to-[#FFD4C4] rounded-full flex items-center justify-center">
                          <span className="text-[#FF7038] text-[18px] font-bold">
                            A
                          </span>
                        </div>

                        {/* 답변 내용 */}
                        <p className="flex-1 text-[16px] text-[#555555] leading-relaxed pt-1">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </MobileLayout>
  );
}
