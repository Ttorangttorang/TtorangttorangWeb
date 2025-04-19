import { useCallback } from 'react';
import * as stores from '@/store/store';

export function useOriginInputHandler(setCharCountOrigin) {
  const settings = stores.useSettingStore();

  // 초안 작성
  const handleOriginInput = useCallback(
    (e) => {
      const MAX_LENGTH = 3000;
      let value = e.target.value;

      if (value.length > MAX_LENGTH) {
        value = value.slice(0, MAX_LENGTH);
      }

      settings.setOriginScript(value);
      setCharCountOrigin(value.length);
    },
    [setCharCountOrigin, settings],
  );

  return { handleOriginInput };
}
