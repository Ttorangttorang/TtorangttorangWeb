import Image from 'next/image';
import * as LocalImages from '@/utils/imageImports';
import { useCompareScriptStore, useSettingStore } from '@/store/store';
import { ANNOUNCE_TXT } from '@/utils/constants';
import CopyAnnounce from '../CopyAnnounce';

export default function ScriptFunc() {
  const { newScript } = useSettingStore();
  const { compareScriptToggle, setcompareScriptToggle } = useCompareScriptStore();
  const scriptFuncTxt = ANNOUNCE_TXT.scriptWrite;

  return (
    <div className="script_fun">
      <div className="copy_box">
        <CopyAnnounce compareScriptToggle={compareScriptToggle} />
      </div>
      {newScript.length > 0 && (
        <div
          className="compare_box"
          onClick={() => setcompareScriptToggle(!compareScriptToggle)}
        >
          <div className="icon">
            <Image
              src={LocalImages.ImageIconSyncAlt}
              alt="ImageIconSyncAlt"
              width={24}
              height={24}
            />
          </div>
          <p>{compareScriptToggle ? scriptFuncTxt.showOriginScript : scriptFuncTxt.showModifyScript}</p>
        </div>
      )}
    </div>
  );
}
