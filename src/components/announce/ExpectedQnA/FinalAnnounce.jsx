import { cls, formatNumber } from '@/utils/config';
import { ANNOUNCE_TXT } from '@/utils/constants';
import { useFinalScriptStore } from '@/store/store';
import CopyAnnounce from '../CopyAnnounce';

export default function FinalAnnounce(props) {
  const { announcePage, saveAnnounce, userModifyScript, modifySaveAnnounce, charCountFinal, saveAnnounceCharCount } = props;
  const { finalScript } = useFinalScriptStore();
  const MAX_LENGTH = 3000;

  // 조건별 css
  const scriptAreaClass = cls('scriptTxt', announcePage ? 'h-[calc(100%-8vmin)]' : 'h-[44vmin]');
  const scriptClass = cls(announcePage ? 'h-[36vmin]' : '!h-[39vmin]');

  // announce, maypage 별
  const scriptValue = announcePage ? finalScript : saveAnnounce;
  const scriptDisabled = modifySaveAnnounce || announcePage ? false : true;
  const scriptLength = announcePage ? formatNumber(charCountFinal) : formatNumber(saveAnnounceCharCount);

  return (
    <>
      <div className={scriptAreaClass}>
        <textarea
          placeholder={ANNOUNCE_TXT.scriptWrite.inputDescription}
          maxLength={MAX_LENGTH}
          value={scriptValue}
          onChange={userModifyScript}
          disabled={scriptDisabled}
          className={scriptClass}
        />
        <p>
          {scriptLength}/ {MAX_LENGTH}
        </p>
      </div>
      <div className="copy_box mt-[1.3vmin]">
        <CopyAnnounce />
      </div>
    </>
  );
}
