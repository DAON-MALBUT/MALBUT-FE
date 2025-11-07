# 다온말벗 페이지 구조 문서

## 📄 작성된 페이지 목록

### 1. 온보딩 페이지들

#### 1.1 Splash Page (`/src/pages/splash.tsx`)
- **경로**: `/splash`
- **용도**: 앱 초기 로딩 화면
- **주요 기능**:
  - 다온 로고 표시
  - 웰컴 메시지 ("다온에 오신 것을 환영합니다!")
  - 로딩 애니메이션 (파도 효과로 "서비스가 로딩중입니다" 텍스트 표시)
- **특징**: NavBar 미표시

#### 1.2 Permission Page (`/src/pages/permission.tsx`)
- **경로**: `/permission`
- **용도**: 앱 사용을 위한 필수 권한 요청 및 동의
- **주요 기능**:
  - 필수 접근 권한 안내 (카메라, 마이크, 알림, 백그라운드 실행)
  - 각 권한별 아코디언 메뉴로 상세 설명 제공
  - 권한 상태 실시간 표시
  - 개인정보 처리 방침 동의 체크박스
  - 페이지 진입 시 자동으로 권한 요청
- **특징**: NavBar 미표시

#### 1.3 Signup Info Page (`/src/pages/signupInfo.tsx`)
- **경로**: `/signup-info`
- **용도**: 사용자 정보 입력 및 프로필 설정
- **주요 기능**:
  - 프로필 사진 업로드 (카메라 아이콘 클릭)
  - 사용자 정보 입력 폼:
    - 이름 (필수, 음성 입력 지원)
    - 생년월일 (필수, 음성 입력 지원)
    - 성별 (선택, 드롭다운)
    - 전화번호 (필수, 음성 입력 지원)
  - 필수 항목 입력 시에만 확인 버튼 활성화
- **특징**: NavBar 미표시, 모든 필수 입력 필드에 음성 입력 기능 포함

---

### 2. 메인 서비스 페이지들

#### 2.1 Home Page (`/src/pages/home.tsx`)
- **경로**: `/` (홈)
- **용도**: 메인 대시보드 - 최근 활동 및 추천 활동 표시
- **주요 기능**:
  - 사용자 인사말 및 환영 메시지
  - **오늘의 추천 활동**:
    - 오늘의 안부 전화
    - 감정 일기 쓰기
    - 추억 돌아보기
  - **최근 활동**:
    - 최근 통화 기록
    - 최근 메시지 기록
    - 활동 시간 및 통화 시간 표시
  - **빠른 액션 버튼**:
    - 친구 목록으로 이동
    - 전화하기로 이동
- **특징**: 
  - NavBar 표시
  - 그라디언트 배경의 추천 활동 카드
  - 최근 활동 전체보기 링크

#### 2.2 Settings Page (`/src/pages/settings.tsx`)
- **경로**: `/settings`
- **용도**: 사용자 설정 및 앱 관리
- **주요 기능**:
  - **프로필 카드**: 사용자 프로필 정보 (이름, 전화번호, 프로필 이미지)
  - **계정 메뉴**:
    - 프로필 수정
    - 비밀번호 변경
  - **앱 설정 메뉴**:
    - 알림 설정
    - 권한 관리
    - 언어 설정
  - **지원 메뉴**:
    - 자주 묻는 질문
    - 문의하기
    - 이용약관
    - 개인정보 처리방침
  - **앱 정보**: 현재 버전 및 업데이트 상태
  - **로그아웃 / 회원탈퇴 버튼**
- **특징**: 
  - NavBar 표시
  - 주황색 그라디언트 프로필 카드
  - 카테고리별 메뉴 그룹화

#### 2.3 Profile Edit Page (`/src/pages/profileEdit.tsx`)
- **경로**: `/profile/edit`
- **용도**: 사용자 프로필 정보 수정
- **주요 기능**:
  - 프로필 사진 수정 (카메라 버튼)
  - 사용자 정보 수정:
    - 이름 (필수, 음성 입력 지원)
    - 생년월일 (필수, 음성 입력 지원)
    - 성별 (선택, 드롭다운)
    - 전화번호 (필수, 음성 입력 지원)
  - 저장 / 취소 버튼
- **특징**: 
  - NavBar 미표시
  - 뒤로가기 및 취소 기능
  - 필수 항목 검증 후 저장 버튼 활성화

#### 2.4 Call Page (`/src/pages/call.tsx`)
- **경로**: `/call`
- **용도**: 전화 걸기 다이얼 패드
- **주요 기능**:
  - **전화번호 입력**:
    - 상단에 포맷팅된 전화번호 표시 (010-1234-5678)
    - 실시간 포맷팅
  - **숫자 키패드**:
    - 3x4 그리드 레이아웃 (1-9, *, 0, #)
    - 64px 원형 버튼
    - 회색 테두리
  - **통화 버튼**:
    - 하단 중앙 초록색 원형 버튼
    - 통화 아이콘
  - **삭제 버튼**:
    - 백스페이스 아이콘
    - 전화번호 한 자리씩 삭제
- **특징**: 
  - NavBar 표시
  - Figma 디자인 적용
  - 깔끔한 다이얼 패드 UI

---

### 3. 캐릭터 관련 페이지들

#### 3.1 Character List Page (`/src/pages/character/list.tsx`)
- **경로**: `/character/list` 또는 `/friends`
- **용도**: 등록된 말벗 캐릭터 목록 조회 및 관리
- **주요 기능**:
  - 말벗 캐릭터 리스트 표시
  - 각 캐릭터별 상세 정보:
    - 프로필 이미지
    - 이름 및 관계
    - 전화번호
    - 생년월일
  - 캐릭터 수정 버튼 (각 카드에 편집 아이콘)
  - 새로운 말벗 추가 버튼
  - 캐릭터가 없을 때 안내 화면
- **특징**: 
  - NavBar 표시
  - 캐릭터 카드 디자인
  - 수정 버튼으로 빠른 편집 가능

#### 3.2 Character Create Page (`/src/pages/character/create.tsx`)
- **경로**: `/character/create`
- **용도**: 새로운 캐릭터 생성 (Step1만 포함)
- **주요 기능**:
  - Step1 컴포넌트 활용
  - 캐릭터 기본 정보 입력 (이름, 전화번호, 생년월일, 관계)
  - 프로필 이미지 업로드
- **특징**: NavBar 미표시

#### 3.3 Character Init Page (`/src/pages/character/init.tsx`)
- **경로**: `/character/init`
- **용도**: 초기 캐릭터 설정 (전체 플로우)
- **주요 기능**:
  - **Step 1**: 캐릭터 기본 정보 입력
    - 프로필 사진 업로드
    - 이름, 전화번호, 생년월일, 관계 입력
    - "기본 캐릭터로 시작하기" 옵션
  - **Step 2**: 캐릭터 성격 선택
    - 다양한 성격 옵션 중 선택
  - **Step 3**: 음성 파일 업로드
    - 캐릭터 음성 파일 업로드
    - 건너뛰기 옵션 제공
  - **Loading**: 캐릭터 생성 중 로딩 화면
  - **Complete**: 캐릭터 생성 완료 화면
- **특징**: 
  - 5단계 스텝 진행 (Step1 → Step2 → Step3 → Loading → Complete)
  - NavBar 미표시
  - 각 단계별 유효성 검사

---

## 🎨 공통 컴포넌트

### 레이아웃
- **MobileLayout** (`/src/layouts/mobile.tsx`): 모바일 화면 레이아웃 (NavBar 옵션 포함)

### 입력 컴포넌트
- **Input** (`/src/components/input.tsx`): 텍스트 입력 필드 (음성 입력 지원)
- **Dropdown** (`/src/components/dropdown.tsx`): 드롭다운 선택 필드
- **Button** (`/src/components/button.tsx`): 버튼 컴포넌트 (primary/disabled 상태)

### 네비게이션
- **Header** (`/src/components/header.tsx`): 헤더 컴포넌트
- **NavBar** (`/src/components/navBar.tsx`): 네비게이션 바

### 캐릭터 관련 컴포넌트
- **Step1** (`/src/components/character/step1.tsx`): 캐릭터 기본 정보 입력
- **Init/Step1** (`/src/components/character/init/step1.tsx`): 초기 설정 1단계
- **Init/Step2** (`/src/components/character/init/step2.tsx`): 초기 설정 2단계 (성격 선택)
- **Init/Step3** (`/src/components/character/init/step3.tsx`): 초기 설정 3단계 (음성 업로드)
- **Init/Loading** (`/src/components/character/init/loading.tsx`): 로딩 화면
- **Init/Complete** (`/src/components/character/init/complete.tsx`): 완료 화면

---

## 📊 페이지 플로우

### 온보딩 플로우
```
Splash → Permission → SignupInfo → Character Init (Step1 → Step2 → Step3 → Loading → Complete) → Home
```

### 메인 서비스 플로우
```
Home ↔ Settings ↔ Profile Edit
  ↓
Character Init / Create
  ↓
Chat (구현 예정)
```

---

## 📝 특이사항

1. **노인 친화 UI/UX 적용** ⭐
   - **큰 글씨**: 제목 32-36px, 본문 18-24px, 버튼 텍스트 20-24px
   - **큰 버튼**: 최소 높이 64px (16), 터치 영역 충분히 확보
   - **단순한 구조**: 홈 화면은 2개의 큰 버튼만 표시
   - **명확한 아이콘**: 아이콘 크기 40-64px
   - **충분한 여백**: 버튼/카드 간격 16-24px
   - **고대비 색상**: 읽기 쉬운 색상 조합
2. **음성 입력 기능**: Input 컴포넌트에 마이크 아이콘과 비디오 URL을 통한 음성 입력 지원
3. **반응형 디자인**: 모든 페이지가 MobileLayout 기반으로 모바일 최적화
4. **접근성**: 각 입력 필드에 레이블과 플레이스홀더 제공
5. **유효성 검사**: 필수 입력 항목 검증 후 버튼 활성화
6. **단계별 진행**: Character Init 페이지는 5단계로 구성된 멀티 스텝 폼

---

## 🔄 구현 필요 사항

- [x] Home 페이지 구현 ✅ (대시보드 형태, 노인 친화 + 세련된 디자인)
- [x] Settings 페이지 구현 ✅ (노인 친화 UI)
- [x] Profile Edit 페이지 구현 ✅
- [x] Character List 페이지 구현 ✅ (Figma 디자인 적용)
- [x] Call 페이지 구현 ✅ (Figma 디자인 적용)
- [ ] Chat 페이지 구현
- [ ] History 페이지 구현 (활동 전체보기)
- [ ] Character Detail 페이지 구현
- [ ] Character Edit 페이지 구현
- [ ] 감정 일기 페이지 구현
- [ ] 추억 돌아보기 페이지 구현
- [ ] 페이지 간 라우팅 연결 (React Router 설정)
- [ ] 백엔드 API 연동
- [ ] 실제 권한 요청 처리 로직 구현
- [ ] 음성 파일 업로드 및 처리 로직
- [ ] 실제 통화 기능 구현
- [ ] 설정 메뉴 상세 기능 구현
  - [ ] 비밀번호 변경
  - [ ] 알림 설정
  - [ ] 언어 설정
  - [ ] FAQ
  - [ ] 문의하기
