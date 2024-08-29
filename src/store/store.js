import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 모바일디바이스 여부
export const useIsMobileStore = create((set) => ({
  isMobileDevice: false,
  setIsMobileDevice: (value) => set({ isMobileDevice: value }),
}));

//// 교정하기 현재 페이지 ////
// pc
export const useCurrentSlideStore = create((set) => ({
  currentSlide: 0,
  setCurrentSlide: (value) => set({ currentSlide: value }),
}));
// Mobile
export const useCurrentSlideMobileStore = create((set) => ({
  currentMobileSlide: 0,
  setCurrentMobileSlide: (value) => set({ currentMobileSlide: value }),
}));

/// ======================================================================= ///

//// 초안 정보 - 로컬 스토리지 저장(settings) ////
export const useSettingStore = create(
  persist(
    (set) => ({
      originScript: '',
      setOriginScript: (value) => set({ originScript: value }),
      subject: '',
      setSubject: (value) => set({ subject: value }),
      presentPurpose: '회사 컨퍼런스',
      setPresentPurpose: (value) => set({ presentPurpose: value }),
      endingTxt: '합니다체',
      setEndingTxt: (value) => set({ endingTxt: value }),
      repeat: false,
      setRepeat: (value) => set({ repeat: value }),
      newScript: '',
      setNewScript: (value) => set({ newScript: value }),
      clearSettings: () => set({ originScript: '', subject: '', presentPurpose: '회사 컨퍼런스', endingTxt: '합니다체', repeat: false, newScript: '' }),
    }),
    {
      name: 'settings', // 로컬 스토리지 키
    },
  ),
);

//// 최초 초안 정보 - 로컬 스토리지 저장(initialSettings) ////
export const useInitialSettingStore = create(
  persist(
    (set) => ({
      initialSubject: '',
      setInitialSubject: (value) => set({ initialSubject: value }),
      initialPresentPurpose: '회사 컨퍼런스',
      setInitialPresentPurpose: (value) => set({ initialPresentPurpose: value }),
      initialEndingTxt: '합니다체',
      setInitialEndingTxt: (value) => set({ initialEndingTxt: value }),
      initialrepeat: false,
      setInitialRepeat: (value) => set({ initialrepeat: value }),
      clearInitialSettings: () => set({ initialSubject: '', initialPresentPurpose: '회사 컨퍼런스', initialEndingTxt: '합니다체', initialrepeat: false }),
    }),
    {
      name: 'initialSettings', // 로컬 스토리지 키
    },
  ),
);

// 원문 <-> 교정문 비교 //
export const useCompareScriptStore = create((set) => ({
  compareScriptToggle: false,
  setcompareScriptToggle: (value) => set({ compareScriptToggle: value }),
}));

// 개선내용 //
export const useImprovementStore = create((set) => ({
  improvementMent: [],
  setImprovementMent: (value) => set({ improvementMent: value }),
  improveModal: false,
  setImproveModal: (value) => set({ improveModal: value }),
}));

// pc 2step 이동 //
export const useNextMoveBtnStore = create((set) => ({
  nextMoveBtn: false,
  setNextMoveBtn: (value) => set({ nextMoveBtn: value }),
}));

//// 완성본 - 로컬 스토리지 저장(final) ////
export const useFinalScriptStore = create(
  persist(
    (set) => ({
      finalScript: '',
      setFinalScript: (value) => set({ finalScript: value }),
      qaArray: [],
      setQaArray: (value) => set({ qaArray: value }),
      clearFinal: () => set({ finalScript: '', qaArray: [] }),
    }),
    {
      name: 'final', // 로컬 스토리지 키
    },
  ),
);

//// 발표문 정보 ////
export const useScriptInfoStore = create((set) => ({
  // 예상 발표시간
  estimatedPresentTime: '0분 0초',
  setEstimatedPresentTime: (value) => set({ estimatedPresentTime: value }),
  // 글자 수 - 초안
  charCountOrigin: 0,
  setCharCountOrigin: (value) => set({ charCountOrigin: value }),
  // 글자 수 - 주제
  subjectCharCount: 0,
  setSubjectCharCount: (value) => set({ subjectCharCount: value }),
  resetScriptInfo: () =>
    set({
      estimatedPresentTime: '0분 0초',
      charCountOrigin: 0,
      subjectCharCount: 0,
    }),
}));

//// 예상질문 및 답변 ////
export const useAskListStateStore = create((set) => ({
  askListState: [false, false, false, false],
  setAskListState: (value) => set({ askListState: value }),
}));

/// ======================================================================= ///

//// Loading ////
export const useScriptLoadingStore = create((set) => ({
  scriptLoading: false,
  setScriptLoading: (value) => set({ scriptLoading: value }),
}));
export const useQaLoadingStore = create((set) => ({
  qaLoading: false,
  setQaLoading: (value) => set({ qaLoading: value }),
}));

//// login ////
export const useLoginModalStore = create((set) => ({
  login: false,
  setLogin: (value) => set({ login: value }),
}));

//// 유저정보 - 로컬 스토리지 저장(user) ////
export const useUserStore = create(
  persist(
    (set) => ({
      userEmail: '',
      setUserEmail: (value) => set({ userEmail: value }),
      accessToken: '',
      setAccessToken: (value) => set({ accessToken: value }),
      userAccessToken: '',
      setUserAccessToken: (value) => set({ userAccessToken: value }),
      clearUser: () => set({ userEmail: '', accessToken: '', userAccessToken: '' }),
    }),
    {
      name: 'user', // 로컬 스토리지 키
    },
  ),
);
