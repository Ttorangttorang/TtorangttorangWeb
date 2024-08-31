## 또랑또랑 :: 클로바 스튜디오 AI 발표 교정 서비스

<!-- Table of Contents -->

## :notebook_with_decorative_cover: 목차

- [About the Project](#star2-about-the-project)
- [Tech Stack & Architecture](#tech-stack--architecture)
- [또랑또랑 특징](#dart-또랑또랑-특징)
- [트러블 슈팅](#boom-트러블-슈팅)
- [주요 색상](#art-주요-색상)
- [페이지별 기능](#hammer_and_wrench-페이지별-기능)

<!-- About the Project -->

## :star2: About the Project

<h3>AI 발표 교정 서비스 또랑또랑</h3>
<p>또랑또랑은 발표 준비에 어려움을 겪는 사용자들을 위한 AI 기반 발표문 교정 & 예상 질문 제공 서비스예요. 사용자가 입력한 주제와 목적에 맞춰 발표문을 교정하고, 예상 질문과 답변을 제공하여 발표 준비를 도와드려요</p>

**팀구성** - FE 1명, BE 1명, 디자이너 1명, 기획자 2명

- [또랑또랑](https://www.ttorang.site/)
- [고도화 서비스 소개서](https://drive.google.com/file/d/1KZk_mwY65ydV1TKN7F1UNat-uy_lvvfm/view)
- [서비스 소개서](https://drive.google.com/file/d/1rtE8eVL8l9gB7KzA06shHdTQpuRtSsv6/view)

<!-- Screenshots -->

### :camera: 또랑또랑 Screenshots

<div> 
  <img width="1280" alt="ttorangcapture" src="https://github.com/user-attachments/assets/df8af666-b8d5-40ad-a881-d00e4265c4cc" alt="screenshot">
</div>

<br><br>

<!-- TechStack -->

## :space_invader: Tech Stack & Architecture

### ⚙️ Service Architecture

<p align="center">
<img src="https://github.com/user-attachments/assets/b2687677-351f-46c0-8940-c5ddec54de6d"  width="488" height="200">
</p>

### 🔨 Tech Stack

- **Frontend** : Javsscript, Next.js, React.js, axios, TanStack Query, zustand, TailwindCSS
- **Backend** : SpringBoot 3.2, MySQL 8.0, Docker, Github Actions, Ncloud Server, Clova Studio
- **서비스 배포 환경** : Vercel

<!-- Features -->

## :dart: 또랑또랑 특징

- **클로바 스튜디오 AI를 활용한 발표문 교정 & 예상 질문 제공 서비스** : Next.js로 제작하고 Vercel로 배포한 웹사이트로, 클로바 AI를 통해 실시간으로 발표문 교정과 예상 질문을 제공합니다.
- **발표문 교정 및 예상 질문 생성 기능** : 클로바 AI에서 제공하는 Content-Type: "text/event-stream" 형식의 스트리밍 데이터를 처리하여, 사용자가 입력한 발표문을 AI가 실시간으로 분석하고, 개선된 발표문과 Q&A 리스트를 UI에 반영합니다.
- **발표문 CRUD** : React Query와 Axios를 사용하여 API와의 통신을 통해 발표문 데이터를 효율적으로 관리합니다.
- **초안, 교정하기 설정 값, 교정문, 예상 질문** : Zustand를 활용해 사용자가 입력한 발표문 관련 정보와 초기 설정 값을 관리하며, 이를 로컬 스토리지에 저장하여 초안과 교정본을 비교할 수 있도록 구현했습니다. 또한, 설정 값, 교정문, 예상 질문도 로컬 스토리지에 저장하여, 선 작성 후 로그인 시에도 해당 값들이 유지되도록 하여 사용자 편의성을 높였습니다.
- **카카오 로그인** : 카카오 OAuth2.0을 사용하여 인가 코드를 받아오고, 이를 통해 서버와 통신하여 DB에 유저 정보를 저장합니다. 또한, Zustand를 사용하여 로컬 스토리지에 토큰과 유저 정보를 저장해 로그인 유지 기능을 구현했습니다.
- **하이라이팅 기능** : diff 라이브러리를 활용하여 초안과 교정본을 비교해 차이점을 하이라이팅 처리했습니다.
- **복사하기 기능** : clipboard 라이브러리를 활용해 초안, 교정문, 완성된 발표문을 복사할 수 있는 기능을 구현했습니다.

<!-- 트러블 슈팅 -->

## :boom: 트러블 슈팅

### **HyperCLOVA X 적용**

### 1. timeout 에러

❗️배경

- 서비스 특성상 사용자 요청이 2~3천 자 이상이면 요청시간이 너무 길어져 **Caused by: io.netty.handler.timeout.ReadTimeoutException: null** 에러가 발생했습니다. 동기식 처리 방식으로 인해 모든 응답이 완료될때까지 시간이 너무 길어져 에러가 발생하고 있다고 판단했습니다.

<br>

🎉해결

<p align="center">
<img src="https://github.com/user-attachments/assets/a63e662b-ee85-4784-b837-675e1228fe38"  width="60%" height="120">
</p>

- 이 문제를 해결하기 위해 백엔드에서 비동기 방식인 Flux를 도입하여 처리했습니다. 이를 통해 적은 리소스로 더 많은 요청을 효율적으로 처리할 수 있게 되었고, 프론트엔드에서는 text/event-stream 형식의 데이터를 받아 화면 구성에 맞게 파싱하여 사용자가 교정본과 예상 질문 및 답변을 확인할 수 있도록 했습니다. 이러한 방식을 적용한 결과, 사용자 요청이 길어지더라도 timeout 에러가 발생하지 않게 되었습니다.

<br>

### 2. 서비스 안정화

❗️배경

- 초기 서비스 단계에서는 "교정하기" 버튼을 클릭하면 교정문, 개선사항, 예상 질문 및 답변을 한 번에 도출하는 프로세스로 구성되었습니다. 그러나 다량의 텍스트가 입력 및 출력될 때 응답 시간이 길어지는 문제가 발생했고, 동시에 3개 이상의 요청을 처리할 경우 일정한 패턴으로 결과를 얻지 못하는 문제가 있었습니다.

<br>

🎉해결

<p align="center">
  <img src="https://github.com/user-attachments/assets/0a47e335-51d0-4682-b4d0-44aeab1eb6bf" alt="process"  width="55%"  height="100" style="margin-right: 10px;">
  <img src="https://github.com/user-attachments/assets/ac9b2298-fa0a-4261-a780-ad34c5573f32" alt="speed"   width="35%"  height="100">
</p>

- 서비스 고도화 과정에서 팀원들과 논의하여, 추가 기능보다는 서비스 안정화와 사용자 편의성 확보에 중점을 두기로 했습니다. 이에 따라 발표문 교정과 예상 질문 도출 API를 분리하여 2단계로 UI를 개편하고, 답변의 정확도를 높이며 응답 시간을 단축할 수 있었습니다.

<!-- Color Reference -->

## :art: 주요 색상

| Color           | Hex                                                              |
| --------------- | ---------------------------------------------------------------- |
| Primary Color   | ![#fff](https://via.placeholder.com/10/fbfbfa?text=+) #fff       |
| Secondary Color | ![#FEFEFE](https://via.placeholder.com/10/f3f4f6?text=+) #FEFEFE |
| Accent Color    | ![#509BF8](https://via.placeholder.com/10/2c82f2?text=+) #509BF8 |
| Text Color      | ![#757575](https://via.placeholder.com/10/000000?text=+) #757575 |

## :hammer_and_wrench: 페이지별 기능

<!-- 페이지별 기능 -->

**홈**
| 시연 | 설명 |
| ----------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| <img width="400" alt="home" src="https://github.com/user-attachments/assets/8a02b6a9-0b21-4402-a8ec-efdaaa153bdd" alt="home"> | <p>홈</p> <ul><li>풀페이지 스크롤 이벤트로 스크롤 시 가이드 노출</li></ul> |

<br><br>

**교정하기**
| 시연 | 설명 |
| ----------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| <img width="400" alt="step1" src="https://github.com/user-attachments/assets/378b0ea0-766c-40bf-a2c7-c1d8043cd617" alt="step1"> | <p>교정하기 1step::발표문 교정</p> <ul><li>초안, 주제 작성 설정 선택 후 교정하기 가능</li><li>초안 정보를 불러오는 모달 노출</li><li>초안에 없는 정보 교정본에 하이라이팅 처리</li><li>원문보기 / 교정문 보기 선택으로 비교가능</li><li>복사하기 버튼으로 초안/ 교정문 복사 가능</li><li>초안/교정본 글자수, 예상 발표 시간 도출</li><li>1차 교정 후 교정본, 주제 수정 또는 설정 이전과 다른 선택 시 재 교정가능</li><li>초기화 버튼 클릭시 리셋</li><li>교정 후 다음 스텝 이동가능</li></ul> |
| <img width="400" alt="step2" src="https://github.com/user-attachments/assets/a3f1a78d-ab21-4a7b-a433-208f0b861681" alt="step2"> | <p>교정하기 2step::예상 질문&답변</p> <ul><li>완성 발표문에서 사용자 추가 수정 가능</li><li>완성 발표문 복사하기 가능</li><li>예상질문 받기 버튼 클릭 시 로딩 모달 노출 후 완성 발표문에 대한 얘상 질문과 답변 도출</li><li>비로그인 상태에서 저장하기 버튼 클릭 시 로그인 모달</li><li>로그인 상태에서 저장하기 버튼 클릭 시 저장 후 마이페이지로 이동</li></ul> |

<br><br>

**로그인 / 마이페이지**
| 시연 | 설명 |
| ----------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| <img width="400" alt="login" src="https://github.com/user-attachments/assets/883d8bcf-3963-43bf-b197-b5aa1a03f1ff" alt="login"> | <p>로그인</p> <ul><li>로그인 클릭 시 카카오 로그인/로그인 없이 체험 모달 노출</li></ul> |
| <img width="400" alt="withdrawal" src="https://github.com/user-attachments/assets/077bb329-dcaa-4345-88fb-da00e35b933c" alt="withdrawal"> | <p>탈퇴</p> <ul><li>회원탈퇴 클릭 시 서비스 탈퇴 모달 노출</li></ul> |
| <img width="400" alt="mypage" src="https://github.com/user-attachments/assets/97eeba10-fe7c-4c53-a228-06c004502340" alt="mypage"> | <p>마이페이지</p> <ul><li>저장된 발표문 리스트 노출</li><li>5개씩 발표문 슬라이드 노출</li><li>발표문 X 선택시 삭제 확인모달 노출 후 삭제</li><li>발표문 선택시 해당 발표문 상세페이지로 이동</li></ul> |
| <img width="400" alt="deatail" src="https://github.com/user-attachments/assets/6c988e0c-bb20-4a4c-8f27-77fb12f4eaa3" alt="deatail"> | <p>저장한 발표문 상세</p> <ul><li>저장한 발표대본 / 예상 질문과 답변 노출</li><li>수정하기 클릭 시 발표문 제목, 발표문 수정 후 저장 가능</li><li>뒤로가기 클릭 시 마이페이지로 이동</li></ul>|
