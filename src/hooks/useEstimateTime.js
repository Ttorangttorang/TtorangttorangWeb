import { useEffect } from 'react';

export function useEstimateTime({ charCountOrigin, charCountNew, compareScriptToggle, setEstimatedPresentTime }) {
  useEffect(() => {
    const charCount = compareScriptToggle ? charCountNew : charCountOrigin;
    const estimatedTime = Math.ceil(charCount / 5); // 초 단위
    const minutes = Math.floor(estimatedTime / 60);
    const seconds = estimatedTime % 60;

    const formatTime = `${minutes < 10 ? '0' + minutes : minutes}분 ${seconds < 10 ? '0' + seconds : seconds}초`;

    setEstimatedPresentTime(formatTime);
  }, [charCountOrigin, charCountNew, compareScriptToggle, setEstimatedPresentTime]);
}
