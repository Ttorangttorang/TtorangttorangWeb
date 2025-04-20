import { useCompareScriptStore } from '@/store/store';
import { ANNOUNCE_TXT } from '@/utils/constants';

export default function ScriptInfo(props) {
  const { improvementMent, estimatedPresentTime } = props;
  const { compareScriptToggle } = useCompareScriptStore();
  const scriptInfoTxt = ANNOUNCE_TXT.scriptWrite;

  return (
    <div className="script_info">
      <p>
        {estimatedPresentTime} ({scriptInfoTxt.estimatedPresentTime})
      </p>
      <p>
        {scriptInfoTxt.improvementMent} <span>{compareScriptToggle ? improvementMent : scriptInfoTxt.improvementMentNone}</span>
      </p>
    </div>
  );
}
