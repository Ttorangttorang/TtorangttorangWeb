import { useEffect, useState, useRef } from 'react';
import GuideMent from '../Shared/GuideMent';
import AnnouncContent from '../Script/AnnouncContent';
import ScriptInfo from '../Script/ScriptInfo';
import ScriptFunc from '../Script/ScriptFunc';
import DetailSetting from '../Script/DetailSetting';
import { cls } from '@/utils/config';
import { ANNOUNCE_TXT } from '@/utils/constants';
import * as stores from '@/store/store';
import { useScriptCorrection } from '@/hooks/useScriptCorrection';
import { deleteAllScript } from '@/store/store';

export default function ModifyAnnounce() {
  const [modifyBtn, setModifyBtn] = useState(false);
  const [highlightedText, setHighlightedText] = useState([]);
  const settings = stores.useSettingStore();
  const { userEmail } = stores.useUserStore();
  const { setNextMoveBtn } = stores.useNextMoveBtnStore();
  const scriptWriteBoxRef = useRef(null);

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

  // 교정하기 버튼 활성화
  useEffect(() => {
    setModifyBtn(settings.originScript && settings.subject);
  }, [settings.originScript, settings.subject]);

  //  교정하기 버튼 클릭시
  const { modifyScript } = useScriptCorrection(setHighlightedText);

  // 버튼활성화 조건 css
  const getButtonClass = (condition) => cls(condition ? 'active_color cursor-pointer' : 'cursor-default');

  return (
    <section className="main_container">
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
                  highlightedText={highlightedText}
                />
              </div>
              <div className="contentInfo_area">
                <ScriptFunc />
                <ScriptInfo />
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
                      modifyScript({ modifyBtn });
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
