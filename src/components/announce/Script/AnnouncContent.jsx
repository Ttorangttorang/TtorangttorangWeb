import * as stores from '@/store/store';
import { useEstimateTime } from '@/hooks/useEstimateTime';
import { useOriginInputHandler } from '@/hooks/useOriginInputHandler';
import { cls, formatNumber } from '@/utils/config';
import { ANNOUNCE_TXT, GLOBAL_TXT } from '@/utils/constants';
import HighlightWithinTextarea from 'react-highlight-within-textarea';

export default function AnnouncContent(props) {
  const { highlightedText } = props;
  const { isMobileDevice } = stores.useIsMobileStore();
  const { compareScriptToggle } = stores.useCompareScriptStore();
  const { originScript } = stores.useSettingStore();
  const { finalScript, setFinalScript } = stores.useFinalScriptStore();
  const { setEstimatedPresentTime, charCountOrigin, setCharCountOrigin } = stores.useScriptInfoStore();
  const MAX_LENGTH = 3000;
  const filterOut = ['-', '"', '"', '!.', '!', '[', ']', ':'];

  // 초안 작성
  const { handleOriginInput } = useOriginInputHandler(setCharCountOrigin);

  // 예상 발표 시간
  useEstimateTime({
    charCountOrigin,
    charCountNew: finalScript.length,
    compareScriptToggle,
    setEstimatedPresentTime,
  });

  const normalTxtArea = () => (
    <>
      <div
        ref={props.scriptWriteBoxRef}
        className="textSize"
      >
        <textarea
          placeholder={ANNOUNCE_TXT.scriptWrite.inputDescription}
          maxLength={MAX_LENGTH}
          value={originScript}
          onChange={handleOriginInput}
          readOnly={finalScript.length > 0}
          className={cls(finalScript.length > 0 && 'cursor-default')}
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
            value={finalScript}
            onChange={(value) => {
              setFinalScript(value);
            }}
          />
        </div>
      </div>
      <p>
        {formatNumber(Math.min(finalScript.length, MAX_LENGTH))} / {MAX_LENGTH}
      </p>
    </>
  );

  const textareaHeight = isMobileDevice ? 'h-[calc(100%-60px)]' : 'h-[calc(100%-3.06vmin)]';

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
