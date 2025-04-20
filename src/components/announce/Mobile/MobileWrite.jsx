import { useRef, useState } from 'react';
import GuideMent from '../Shared/GuideMent';
import AnnouncContent from '../Script/AnnouncContent';
import ScriptFunc from '../Script/ScriptFunc';
import BackSlideBtn from '../../layout/BackSlideBtn';
import { cls } from '@/utils/config';
import { ANNOUNCE_TXT } from '@/utils/constants';
import { PiArrowClockwiseBold } from 'react-icons/pi';
import * as stores from '@/store/store';
import { useScriptCorrection } from '@/hooks/useScriptCorrection';
import { deleteAllScript } from '@/store/store';

export default function MobileWrite({ userEmail, sliderMobileRef }) {
  const scriptWriteBoxRef = useRef(null);
  const settings = stores.useSettingStore();
  const { finalScript } = stores.useFinalScriptStore();
  const { improvementMent, setImprovementMent, setImproveModal } = stores.useImprovementStore();
  const { compareScriptToggle } = stores.useCompareScriptStore();
  const { estimatedPresentTime } = stores.useScriptInfoStore();
  const { setCurrentMobileSlide } = stores.useCurrentSlideMobileStore();
  const [highlightedText, setHighlightedText] = useState([]);

  //  교정하기 버튼 클릭시
  const { modifyScript } = useScriptCorrection(setHighlightedText, setImprovementMent);

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
              highlightedText={highlightedText}
            />
            <div className="improve_area">
              <span onClick={() => setImproveModal(true)}>개선내용({improvementMent.length || 0})</span>
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
