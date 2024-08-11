## 클로바 스튜디오 AI 발표 교정 서비스 또랑또랑

<!-- Table of Contents -->

## :notebook_with_decorative_cover: 목차

- [About the Project](#star2-about-the-project)
  - [또랑또랑 Screenshots](#camera-또랑또랑-screenshots)
  - [Tech Stack](#space_invader-tech-stack)
  - [또랑또랑 특징](#dart-또랑또랑-특징)
  - [주요 색상](#art-주요-색상)
  - [프로젝트 구조](#space-프로젝트-구조)

<!-- About the Project -->

## :star2: About the Project

<h3>AI 발표 교정 서비스 또랑또랑</h3>
<p>또랑또랑은 발표 준비에 어려움을 겪는 사용자들을 위한 AI 기반 발표문 교정 & 예상 질문 제공 서비스예요. 사용자가 입력한 주제와 목적에 맞춰 발표문을 교정하고, 예상 질문과 답변을 제공하여 발표 준비를 도와드려요</p>

팀구성 - FE 2명, BE 1명, 디자이너 1명, 기획자 2명

Project Link: [https://www.ttorang.site/](https://www.ttorang.site/)
고도화 서비스 소개서: [https://drive.google.com/file/d/1KZk_mwY65ydV1TKN7F1UNat-uy_lvvfm/view](https://drive.google.com/file/d/1KZk_mwY65ydV1TKN7F1UNat-uy_lvvfm/view)
서비스 소개서: [https://drive.google.com/file/d/1rtE8eVL8l9gB7KzA06shHdTQpuRtSsv6/view](https://drive.google.com/file/d/1rtE8eVL8l9gB7KzA06shHdTQpuRtSsv6/view)

<!-- Screenshots -->

### :camera: 또랑또랑 Screenshots

<div align="center"> 
  <img width="1280" alt="ttorangcapture" src="https://github.com/user-attachments/assets/df8af666-b8d5-40ad-a881-d00e4265c4cc" alt="screenshot">
</div>

<!-- TechStack -->

### :space_invader: Tech Stack

<p>기술스택</p>

Frontend : Javsscript, Next.js, React.js, axios, TanStack Query, zustand, TailwindCSS
Backend : SpringBoot 3.2, MySQL 8.0, Docker, Github Actions, Ncloud Server, Clova Studio
서비스 배포 환경 : Vercel

<!-- Features -->

### :dart: 또랑또랑 특징

- 클로바 스튜디오 AI를 활용한 발표문 교정 & 예상 질문 제공 서비스: Next.js로 제작하고 Vercel로 배포한 웹사이트로, 클로바 AI를 통해 실시간으로 발표문 교정과 예상 질문을 제공합니다.
- 발표문 교정 및 예상 질문 생성 기능 : 클로바 AI에서 제공하는 Content-Type: "text/event-stream" 형식의 스트리밍 데이터를 처리하여, 사용자가 입력한 발표문을 AI가 실시간으로 분석하고, 개선된 발표문과 Q&A 리스트를 UI에 반영합니다.
- 발표문 CRUD : React Query와 Axios를 사용하여 API와의 통신을 통해 발표문 데이터를 효율적으로 관리합니다.
- 초안, 교정하기 설정 값, 교정문, 예상 질문 : Zustand를 활용해 사용자가 입력한 발표문 관련 정보와 초기 설정 값을 관리하며, 이를 로컬 스토리지에 저장하여 초안과 교정본을 비교할 수 있도록 구현했습니다. 또한, 설정 값, 교정문, 예상 질문도 로컬 스토리지에 저장하여, 선 작성 후 로그인 시에도 해당 값들이 유지되도록 하여 사용자 편의성을 높였습니다.
- 카카오 로그인 : 카카오 OAuth2.0을 사용하여 인가 코드를 받아오고, 이를 통해 서버와 통신하여 DB에 유저 정보를 저장합니다. 또한, Zustand를 사용하여 로컬 스토리지에 토큰과 유저 정보를 저장해 로그인 유지 기능을 구현했습니다.
- 하이라이팅 기능 : diff 라이브러리를 활용하여 초안과 교정본을 비교해 차이점을 하이라이팅 처리했습니다.
- 복사하기 기능 : clipboard 라이브러리를 활용해 초안, 교정문, 완성된 발표문을 복사할 수 있는 기능을 구현했습니다.

<!-- Color Reference -->

### :art: 주요 색상

| Color           | Hex                                                              |
| --------------- | ---------------------------------------------------------------- |
| Primary Color   | ![#fff](https://via.placeholder.com/10/fbfbfa?text=+) #fff       |
| Secondary Color | ![#FEFEFE](https://via.placeholder.com/10/f3f4f6?text=+) #FEFEFE |
| Accent Color    | ![#509BF8](https://via.placeholder.com/10/2c82f2?text=+) #509BF8 |
| Text Color      | ![#757575](https://via.placeholder.com/10/000000?text=+) #757575 |

<!-- 프로젝트 구조 -->

### :space_invader: 프로젝트 구조
