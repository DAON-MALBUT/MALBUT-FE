# 다온말벗

React + TypeScript + Vite 기반 프로젝트

## 🛠 기술 스택

- **프레임워크**: React 18 + TypeScript
- **빌드 도구**: Vite
- **라우팅**: React Router DOM
- **스타일링**: Tailwind CSS
- **상태 관리**: Zustand
- **데이터 페칭**: TanStack Query (React Query)
- **HTTP 클라이언트**: Axios

## 📁 프로젝트 구조

```
daon/
├── src/
│   ├── api/           # API 클라이언트 설정
│   ├── components/    # 재사용 가능한 컴포넌트
│   ├── hooks/         # 커스텀 훅 (TanStack Query 등)
│   ├── layouts/       # 레이아웃 컴포넌트
│   ├── pages/         # 페이지 컴포넌트
│   ├── stores/        # Zustand 상태 관리 스토어
│   ├── types/         # TypeScript 타입 정의
│   ├── utils/         # 유틸리티 함수
│   ├── App.tsx        # 메인 App 컴포넌트 (라우터 설정)
│   └── main.tsx       # 진입점
├── public/            # 정적 파일
└── package.json
```

## 🚀 시작하기

### 설치

```bash
npm install
```

### 환경 변수 설정

`.env.example` 파일을 복사하여 `.env` 파일을 생성하고 필요한 값을 설정하세요.

```bash
cp .env.example .env
```

### 개발 서버 실행

```bash
npm run dev
```

### 빌드

```bash
npm run build
```

### 미리보기

```bash
npm run preview
```

## 📚 주요 라이브러리 사용법

### Zustand (상태 관리)

```typescript
// stores/exampleStore.ts
import { create } from 'zustand';

export const useExampleStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));

// 컴포넌트에서 사용
const { count, increment } = useExampleStore();
```

### TanStack Query (데이터 페칭)

```typescript
// hooks/useExample.ts
import { useQuery } from '@tanstack/react-query';

export const useGetData = () => {
  return useQuery({
    queryKey: ['data'],
    queryFn: async () => {
      const response = await apiClient.get('/data');
      return response.data;
    },
  });
};
```

### Axios (HTTP 클라이언트)

```typescript
// api/client.ts에서 설정된 인스턴스 사용
import { apiClient } from '../api/client';

const response = await apiClient.get('/endpoint');
```

### Tailwind CSS (스타일링)

```tsx
<div className="p-6 bg-white rounded-lg shadow-md">
  <h1 className="text-2xl font-bold">제목</h1>
</div>
```

### React Router DOM (라우팅)

```typescript
// App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
```

### 글로벌 스타일

`src/index.css`에 정의된 커스텀 클래스:
- `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-outline` - 버튼 스타일
- `.card` - 카드 컨테이너
- `.input` - 입력 필드
- `.page-title`, `.section-title` - 제목 스타일

## 📝 개발 가이드

1. **페이지 작성**: `src/pages/` 디렉토리에 페이지 컴포넌트 작성
2. **레이아웃 작성**: `src/layouts/` 디렉토리에 공통 레이아웃 작성
3. **컴포넌트 작성**: `src/components/` 디렉토리에 재사용 가능한 컴포넌트 작성
4. **상태 관리**: 전역 상태는 `src/stores/`에 Zustand 스토어 생성
5. **API 호출**: `src/hooks/`에 TanStack Query 커스텀 훅 작성
6. **타입 정의**: `src/types/`에 공통 타입 정의
7. **유틸리티**: `src/utils/`에 재사용 가능한 함수 작성

## 🔧 설정 파일

- `vite.config.ts`: Vite 설정
- `tailwind.config.js`: Tailwind CSS 설정
- `tsconfig.json`: TypeScript 설정
- `eslint.config.js`: ESLint 설정

## 📦 주요 의존성

- `react`: ^18.3.1
- `react-dom`: ^18.3.1
- `react-router-dom`: ^7.0.2
- `vite`: ^7.1.12
- `typescript`: ~5.6.2
- `tailwindcss`: ^3.4.17
- `zustand`: ^5.0.2
- `@tanstack/react-query`: ^5.62.11
- `axios`: ^1.7.9

