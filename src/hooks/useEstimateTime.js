import { useEffect } from 'react';
import * as stores from '@/store/store';

export function useEstimateTime() {
  const { finalScript } = stores.useFinalScriptStore();
  const { compareScriptToggle } = stores.useCompareScriptStore();
  const { setEstimatedPresentTime, charCountOrigin } = stores.useScriptInfoStore();

  useEffect(() => {
    const charCount = compareScriptToggle ? finalScript.length : charCountOrigin;
    const estimatedTime = Math.ceil(charCount / 5); // 초 단위
    const minutes = Math.floor(estimatedTime / 60);
    const seconds = estimatedTime % 60;

    const formatTime = `${minutes < 10 ? '0' + minutes : minutes}분 ${seconds < 10 ? '0' + seconds : seconds}초`;

    setEstimatedPresentTime(formatTime);
  }, [charCountOrigin, finalScript.length, compareScriptToggle, setEstimatedPresentTime]);
}
