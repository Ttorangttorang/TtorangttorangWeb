import { useEffect, useState, useRef } from 'react';
import GuideMent from './GuideMent';
import { cls } from '@/utils/config';
import * as stores from '@/store/store';
import AnnouncContent from './Draft/AnnouncContent';
import ScriptInfo from './Draft/ScriptInfo';
import ScriptFunc from './Draft/ScriptFunc';
import DetailSetting from './Draft/DetailSetting';
import { ANNOUNCE_TXT } from '@/utils/constants';
import { useScriptCorrection } from '@/hooks/useScriptCorrection';
import { useOriginInputHandler } from '@/hooks/useOriginInputHandler';
import { useEstimateTime } from '@/hooks/useEstimateTime';

export default function ModifyAnnounce({ userEmail }) {
  const settings = stores.useSettingStore();
  const { setNextMoveBtn } = stores.useNextMoveBtnStore();
  const { setFinalScript } = stores.useFinalScriptStore();
  const [modifyBtn, setModifyBtn] = useState(false);
  //교정문
  const scriptWriteBoxRef = useRef(null);
  const [improvementMent, setImprovementMent] = useState('없음');
  const [charCountNew, setCharCountNew] = useState(0);
  const [highlightedText, setHighlightedText] = useState([]);
  const { compareScriptToggle, setcompareScriptToggle } = stores.useCompareScriptStore();
  const { resetScriptInfo, estimatedPresentTime, setEstimatedPresentTime, charCountOrigin, setCharCountOrigin } = stores.useScriptInfoStore();

  // 선 작성 후 로그인 시 작성문 유지
  useEffect(() => {
    const savedSettings = localStorage.getItem('settings');
    if (userEmail && savedSettings) {
      const { originScript = '', subject = '', presentPurpose = '회사 컨퍼런스', endingTxt = '합니다체', repeat = false } = JSON.parse(savedSettings);

      settings.setOriginScript(originScript);
      settings.setSubject(subject);
      settings.setPresentPurpose(presentPurpose);
      settings.setEndingTxt(endingTxt);
      settings.setRepeat(repeat);

      setNextMoveBtn(true);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userEmail]);

  // 초안 작성
  const { handleOriginInput } = useOriginInputHandler(setCharCountOrigin);

  // 예상 발표 시간
  useEstimateTime({
    charCountOrigin,
    charCountNew,
    compareScriptToggle,
    setEstimatedPresentTime,
  });

  // script 초기화 버튼
  const deleteAllScript = () => {
    settings.clearSettings();
    setcompareScriptToggle(false);
    setNextMoveBtn(false);
    resetScriptInfo();
    setFinalScript('');
  };

  // 교정하기 버튼 활성화
  useEffect(() => {
    setModifyBtn(settings.originScript && settings.subject);
  }, [settings.originScript, settings.subject]);

  //  교정하기 버튼 클릭시
  const { modifyScript } = useScriptCorrection(setCharCountNew, setHighlightedText, setImprovementMent);

  // 버튼활성화 조건
  const getButtonClass = (condition) => cls(condition ? 'active_color cursor-pointer' : 'cursor-default');

  return (
    <section className="main_container">
      <div className="progress_bar"></div>
      <section className="correction_area">
        <form>
          <div className="scriptWrite_box">
            <GuideMent
              firstMent={ANNOUNCE_TXT.GuideTxt.oneStep.left.firstMent}
              secondMent={ANNOUNCE_TXT.GuideTxt.oneStep.left.secondMent}
            />
            <div>
              <div className="scriptMain_area">
                <AnnouncContent
                  scriptWriteBoxRef={scriptWriteBoxRef}
                  writeOriginScript={handleOriginInput}
                  charCountOrigin={charCountOrigin}
                  highlightedText={highlightedText}
                  charCountNew={charCountNew}
                  setCharCountNew={setCharCountNew}
                />
              </div>
              <div className="contentInfo_area">
                <ScriptFunc />
                <ScriptInfo
                  improvementMent={improvementMent}
                  estimatedPresentTime={estimatedPresentTime}
                />
              </div>
            </div>
          </div>
          <div className="scriptSetting_box">
            <GuideMent
              firstMent={ANNOUNCE_TXT.GuideTxt.oneStep.right.firstMent}
              secondMent={ANNOUNCE_TXT.GuideTxt.oneStep.right.secondMent}
            />
            <div>
              <DetailSetting />
              <div className="modifyBtn_box">
                <button
                  type="button"
                  onClick={() => {
                    if (settings.originScript.length > 0 || settings.subject.length > 0) {
                      deleteAllScript();
                    }
                  }}
                  className={getButtonClass(settings.originScript.length > 0 || settings.subject.length > 0)}
                >
                  {ANNOUNCE_TXT.modifyBtn.reset}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (modifyBtn) {
                      modifyScript({ compareScriptToggle, modifyBtn });
                    }
                  }}
                  className={getButtonClass(modifyBtn)}
                >
                  {ANNOUNCE_TXT.modifyBtn.modify}
                </button>
              </div>
            </div>
          </div>
        </form>
      </section>
    </section>
  );
}
