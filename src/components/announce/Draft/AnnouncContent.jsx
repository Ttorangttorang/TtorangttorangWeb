import { useCompareScriptStore, useFinalScriptStore, useIsMobileStore, useSettingStore } from '@/store/store';
import { cls, formatNumber } from '@/utils/config';
import { ANNOUNCE_TXT, GLOBAL_TXT } from '@/utils/constants';
import HighlightWithinTextarea from 'react-highlight-within-textarea';

export default function AnnouncContent(props) {
  const { isMobileDevice } = useIsMobileStore();
  const { scriptWriteBoxRef, writeOriginScript, charCountOrigin, highlightedText, charCountNew, setCharCountNew } = props;
  const { compareScriptToggle } = useCompareScriptStore();
  const { originScript, newScript, setNewScript } = useSettingStore();
  const { setFinalScript } = useFinalScriptStore();
  const MAX_LENGTH = 3000;
  const filterOut = ['-', '"', '"', '!.', '!', '[', ']', ':'];

  const normalTxtArea = () => (
    <>
      <div
        ref={scriptWriteBoxRef}
        className="textSize"
      >
        <textarea
          placeholder={ANNOUNCE_TXT.scriptWrite.inputDescription}
          maxLength={MAX_LENGTH}
          value={originScript}
          onChange={writeOriginScript}
        />
      </div>
      <p>
        {formatNumber(charCountOrigin)} / {MAX_LENGTH}
      </p>
    </>
  );

  const modifyTxtArea = () => (
    <>
      <div className="textSize">
        <div className="newScript">
          <HighlightWithinTextarea
            highlight={[
              {
                highlight: highlightedText.filter((item) => !filterOut.includes(item) && item.length > 1),
                className: '!bg-[#cbeaff]',
              },
            ]}
            value={newScript}
            onChange={(value) => {
              setNewScript(value);
              setFinalScript(value);
              setCharCountNew(value.length);
              if (value.length > MAX_LENGTH) {
                setCharCountNew(MAX_LENGTH);
              }
            }}
          />
        </div>
      </div>
      <p>
        {formatNumber(charCountNew)} / {MAX_LENGTH}
      </p>
    </>
  );

  const textareaHeight = isMobileDevice ? 'h-[calc(100%-32px)]' : 'h-[calc(100%-3.06vmin)]';

  return (
    <>
      <p className="title">
        <span className="required">{GLOBAL_TXT.required}</span>
        {ANNOUNCE_TXT.scriptWrite.title}
      </p>
      <div className={cls('scriptTxt', textareaHeight)}>{!compareScriptToggle ? normalTxtArea() : modifyTxtArea()}</div>
    </>
  );
}
