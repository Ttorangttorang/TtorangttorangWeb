import { ANNOUNCE_TXT } from '@/utils/constants';
import GuideMent from './GuideMent';
import FinalAnnounce from './ExpectedQnA/FinalAnnounce';
import { cls, formatNumber } from '@/utils/config';
import { useState } from 'react';
import CopyAnnounce from './CopyAnnounce';
import { useFinalScriptStore } from '@/store/store';

export default function MobileFinalAnnounce() {
  const [saveAnnounce, setSaveAnnounce] = useState('');
  const [charCountFinal, setCharCountFinal] = useState(0);
  const [modifySaveAnnounce, setModifySaveAnnounce] = useState(false);
  const [saveAnnounceCharCount, setSaveAnnounceCharCount] = useState(0);
  const MAX_LENGTH = 3000;
  const { finalScript, setFinalScript } = useFinalScriptStore();

  // 발표문 수정
  const userModifyScript = (event) => {
    const MAX_LENGTH = 3000;
    let draft = event.target.value;

    if (draft.length > MAX_LENGTH) {
      draft = event.target.value.slice(0, MAX_LENGTH);
    }

    setFinalScript(draft);
    setCharCountFinal(draft.length);
  };

  return (
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
            {formatNumber(charCountFinal)}/ {MAX_LENGTH}
          </p>
        </div>
        <div className="contentInfo_area">
          <CopyAnnounce saveAnnounce={saveAnnounce} />
        </div>
      </div>
    </div>
  );
}
