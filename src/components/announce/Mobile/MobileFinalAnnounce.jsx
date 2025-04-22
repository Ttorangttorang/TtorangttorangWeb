import * as stores from '@/store/store';
import GuideMent from '../Shared/GuideMent';
import { ANNOUNCE_TXT } from '@/utils/constants';
import { cls, formatNumber } from '@/utils/config';
import CopyAnnounce from '../Shared/CopyAnnounce';
import BackSlideBtn from '../../layout/BackSlideBtn';
import { useGenerateQnA } from '@/hooks/useGenerateQnA';

export default function MobileFinalAnnounce({ sliderMobileRef }) {
  const { finalScript, setFinalScript, qaArray } = stores.useFinalScriptStore();
  const { setCurrentMobileSlide } = stores.useCurrentSlideMobileStore();
  const { getQAList } = useGenerateQnA();
  const MAX_LENGTH = 3000;

  // 발표문 수정
  const userModifyScript = (event) => {
    const MAX_LENGTH = 3000;
    let draft = event.target.value;

    if (draft.length > MAX_LENGTH) {
      draft = event.target.value.slice(0, MAX_LENGTH);
    }

    setFinalScript(draft);
  };

  return (
    <>
      <div className="userModify_box">
        <GuideMent
          firstMent={ANNOUNCE_TXT.GuideTxt.twoStep.left.firstMent}
          secondMent={ANNOUNCE_TXT.GuideTxt.twoStep.left.secondMent}
        />
        {/* 최종 발표문 */}
        <div className={cls('scriptFinal_area')}>
          <p className="title">{ANNOUNCE_TXT.scriptFinal.title}</p>
          <div className="scriptTxt">
            <textarea
              placeholder={ANNOUNCE_TXT.scriptWrite.inputDescription}
              maxLength={MAX_LENGTH}
              value={finalScript}
              onChange={userModifyScript}
              disabled={false}
            />
            <p className="charCount">
              {formatNumber(finalScript.length)}/ {MAX_LENGTH}
            </p>
          </div>
          <div className="contentInfo_area">
            <CopyAnnounce />
          </div>
        </div>
      </div>
      <div className="slideMove_btn_area">
        <BackSlideBtn
          backSlideNum={1}
          sliderMobileRef={sliderMobileRef}
        />
        <div
          onClick={() => {
            getQAList();
          }}
          className={cls('next_step', finalScript.length > 0 ? 'active_color' : 'disabled_color')}
        >
          {qaArray.length > 0 ? '예상질문 다시 받기' : '예상질문 받기'}
        </div>
        {qaArray.length > 0 && (
          <div
            onClick={() => {
              setCurrentMobileSlide(3);
              sliderMobileRef.current.slickGoTo(3);
            }}
            className="next_step active_color"
          >
            예상질문 확인하기
          </div>
        )}
      </div>
    </>
  );
}
