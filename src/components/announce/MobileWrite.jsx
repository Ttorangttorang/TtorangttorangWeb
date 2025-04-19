import { useEffect, useRef, useState } from 'react';
import { ANNOUNCE_TXT } from '@/utils/constants';
import * as stores from '@/store/store';
import GuideMent from './GuideMent';
import AnnouncContent from './Draft/AnnouncContent';
import ScriptFunc from './Draft/ScriptFunc';
import { cls } from '@/utils/config';
import { PiArrowClockwiseBold } from 'react-icons/pi';
import BackSlideBtn from '../layout/BackSlideBtn';
import { useScriptCorrection } from '@/hooks/useScriptCorrection';
import { useOriginInputHandler } from '@/hooks/useOriginInputHandler';
import { useEstimateTime } from '@/hooks/useEstimateTime';

export default function MobileWrite({ userEmail, sliderMobileRef }) {
  const scriptWriteBoxRef = useRef(null);
  const settings = stores.useSettingStore();
  const { finalScript } = stores.useFinalScriptStore();
  const { improvementMent, setImprovementMent, setImproveModal } = stores.useImprovementStore();
  const { compareScriptToggle } = stores.useCompareScriptStore();
  const { setcompareScriptToggle } = stores.useCompareScriptStore();
  const { resetScriptInfo, estimatedPresentTime, setEstimatedPresentTime, charCountOrigin, setCharCountOrigin } = stores.useScriptInfoStore();
  const { setCurrentMobileSlide } = stores.useCurrentSlideMobileStore();
  const [charCountNew, setCharCountNew] = useState(0);
  const [highlightedText, setHighlightedText] = useState([]);
  const scriptFuncTxt = ANNOUNCE_TXT.scriptWrite;

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
    resetScriptInfo();
    setcompareScriptToggle(false);
  };

  //  교정하기 버튼 클릭시
  const { modifyScript } = useScriptCorrection(setCharCountNew, setHighlightedText, setImprovementMent);

  return (
    <>
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
            <div className="improve_area">
              <span onClick={() => setImproveModal(true)}>개선내용({improvementMent.length || 0})</span>
              <span onClick={() => setcompareScriptToggle(!compareScriptToggle)}>{compareScriptToggle ? scriptFuncTxt.showOriginScript : scriptFuncTxt.showModifyScript}</span>
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
      <div className="slideMove_btn_area">
        {/* 뒤로가기 */}
        <BackSlideBtn
          backSlideNum={0}
          sliderMobileRef={sliderMobileRef}
        />
        {/* 초기화 */}
        <div
          className={cls('small_btn', settings.originScript.length > 0 ? 'active_color' : 'disabled_color')}
          onClick={() => {
            if (settings.originScript.length > 0) {
              deleteAllScript();
              setCurrentMobileSlide(0);
              sliderMobileRef.current.slickGoTo(0);
            }
          }}
        >
          <PiArrowClockwiseBold fontSize={18} />
        </div>
        {/* 교정하기 */}
        <div
          onClick={() => {
            if (settings.originScript.length > 0) {
              modifyScript({ compareScriptToggle, modifyBtn: true });
            }
          }}
          className={cls('next_step', settings.originScript.length > 0 ? 'active_color' : 'disabled_color')}
        >
          {finalScript.length > 0 ? '재 교정하기' : '교정하기'}
        </div>
        {/* 완성본 */}
        {finalScript.length > 0 && (
          <div
            onClick={() => {
              setCurrentMobileSlide(2);
              sliderMobileRef.current.slickGoTo(2);
            }}
            className="next_step active_color"
          >
            완성발표문 확인
          </div>
        )}
      </div>
    </>
  );
}
