import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

// 원문 교정문 비교
export const useCompareScriptStore = create((set) => ({
  compareScriptToggle: false,
  setcompareScriptToggle: (value) => set({ compareScriptToggle: value }),
}));

export const useNextMoveBtnStore = create((set) => ({
  nextMoveBtn: false,
  setNextMoveBtn: (value) => set({ nextMoveBtn: value }),
}));

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

// Loading
export const useScriptLoadingStore = create((set) => ({
  scriptLoading: false,
  setScriptLoading: (value) => set({ scriptLoading: value }),
}));
export const useQaLoadingStore = create((set) => ({
  qaLoading: false,
  setQaLoading: (value) => set({ qaLoading: value }),
}));

// login
export const useLoginModalStore = create((set) => ({
  login: false,
  setLogin: (value) => set({ login: value }),
}));

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
