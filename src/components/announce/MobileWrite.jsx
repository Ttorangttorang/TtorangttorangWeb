import { useEffect, useRef, useState } from 'react';
import { ANNOUNCE_TXT } from '@/utils/constants';
import * as stores from '@/store/store';
import GuideMent from './GuideMent';
import AnnouncContent from './Draft/AnnouncContent';
import ScriptFunc from './Draft/ScriptFunc';

export default function MobileWrite({ userEmail }) {
  const scriptWriteBoxRef = useRef(null);
  const settings = stores.useSettingStore();
  const { compareScriptToggle } = stores.useCompareScriptStore();
  const { charCountOrigin, setCharCountOrigin } = stores.useCharCountOriginStore();
  const { setNextMoveBtn } = stores.useNextMoveBtnStore();
  const { estimatedPresentTime, setEstimatedPresentTime } = stores.useEstimatedPresentTimeStore();
  const [charCountNew, setCharCountNew] = useState(0);
  const [highlightedText] = useState([]);

  // 선 작성 후 로그인 시 작성문 유지
  useEffect(() => {
    const savedSettings = localStorage.getItem('settings');
    if (userEmail && savedSettings) {
      // 로컬 스토리지에서 설정을 불러오기
      const { originScript = '', subject = '', newScript = '', presentPurpose = '회사 컨퍼런스', endingTxt = '합니다체', repeat = false } = JSON.parse(savedSettings);

      settings.setOriginScript(originScript);
      settings.setSubject(subject);
      settings.setNewScript(newScript);
      settings.setPresentPurpose(presentPurpose);
      settings.setEndingTxt(endingTxt);
      settings.setRepeat(repeat);

      if (settings.newScript) {
        setNextMoveBtn(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userEmail]);

  // 초안 작성
  const writeOriginScript = (event) => {
    const MAX_LENGTH = 3000;
    let draft = event.target.value;

    if (draft.length > MAX_LENGTH) {
      draft = event.target.value.slice(0, MAX_LENGTH);
    }
    settings.setOriginScript(draft);
    setCharCountOrigin(draft.length);
  };

  // 예상 발표 시간
  useEffect(() => {
    const estimatedTime = compareScriptToggle ? Math.ceil(charCountNew / 5) : Math.ceil(charCountOrigin / 5); // 초 단위
    const minutes = Math.floor(estimatedTime / 60);
    const seconds = estimatedTime % 60;
    setEstimatedPresentTime(`${minutes < 10 ? '0' + minutes : minutes}분 ${seconds < 10 ? '0' + seconds : seconds}초`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [charCountOrigin, charCountNew, settings.originScript, compareScriptToggle]);

  return (
    <div className="scriptWrite_box">
      <GuideMent
        firstMent={ANNOUNCE_TXT.GuideTxt.oneStep.left.firstMent}
        secondMent={ANNOUNCE_TXT.GuideTxt.oneStep.left.secondMent}
      />
      <div>
        <div className="scriptMain_area">
          <AnnouncContent
            scriptWriteBoxRef={scriptWriteBoxRef}
            writeOriginScript={writeOriginScript}
            charCountOrigin={charCountOrigin}
            highlightedText={highlightedText}
            charCountNew={charCountNew}
            setCharCountNew={setCharCountNew}
          />
          <div className="improve_area">
            <span>개선내용(0)</span>
          </div>
        </div>
        <div className="contentInfo_area">
          <p className="estimatedPresentTime">
            {estimatedPresentTime} ({ANNOUNCE_TXT.scriptWrite.estimatedPresentTime})
          </p>
          <ScriptFunc />
        </div>
      </div>
    </div>
  );
}
