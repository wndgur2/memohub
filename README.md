---
date_started: 2023.11.23
date_finished: 2023.11.29
head_count: 2
role: FE
---

# Memohub

### Memo by anyone at everywhere.

### https://memohub.vercel.app/

<img width="367" alt="image" src="https://github.com/wndgur2/memohub/assets/65120311/e6232f19-a2ac-4f2e-a75e-72da3e6877ae">

Memohub은 URL 기반의 공유 메모 보드입니다. 누구나 링크만 알면 같은 공간에 접속해 메모를 남기고, 실시간으로 서로의 메모를 확인할 수 있습니다.

**주요 기능**

- URL로 방 생성/접속 (예: `/hub/coffee`)
- 실시간 메모 동기화 (Socket.io)
- 메모 저장/불러오기 (MongoDB)
- 링크 복사 및 모바일 공유

**사용 방법**

1. 홈 화면에서 추천 URL 또는 원하는 키워드를 입력합니다.
2. 해당 URL의 허브로 이동하면 메모를 작성하고 공유할 수 있습니다.

**기술 스택**

- Next.js 14 (App Router)
- React 18
- MongoDB
- Socket.io

**스크립트**

- `npm run dev`: 개발 서버
- `npm run build`: 프로덕션 빌드
- `npm run start`: 프로덕션 서버
- `npm run lint`: 린트

**프로젝트 구조**

- `app/`: App Router 기반 페이지
- `pages/api/`: MongoDB 연동 API
- `components/`: UI 컴포넌트
- `util/`: API 호출/소켓 클라이언트/설정

**메모**

- 실시간 동기화를 위한 Socket.io 서버 주소는 `util/config.js`에서 설정합니다.
