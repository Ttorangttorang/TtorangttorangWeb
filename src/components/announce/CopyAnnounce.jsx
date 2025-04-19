import Image from 'next/image';
import * as LocalImages from '@/utils/imageImports';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useCurrentSlideStore, useFinalScriptStore, useSettingStore } from '@/store/store';
import { usePathname } from 'next/navigation';
import { GLOBAL_TXT } from '@/utils/constants';

const ICON_SIZE = 24;

function CopyIcon() {
  return (
    <>
      <div className="icon">
        <Image
          src={LocalImages.ImageIconCopy}
          alt="ImageIconCopy"
          width={ICON_SIZE}
          height={ICON_SIZE}
        />
      </div>
      <p>{GLOBAL_TXT.copy.copyTxt}</p>
    </>
  );
}

export default function CopyAnnounce(props) {
  const { compareScriptToggle, saveAnnounce } = props;
  const pathname = usePathname();
  const { originScript } = useSettingStore();
  const { currentSlide } = useCurrentSlideStore();
  const { finalScript } = useFinalScriptStore();
  let textToCopy;
  let copyMessage;

  // 비활성화
  const isDisabled = pathname === '/announce' && originScript?.length === 0;

  // announce(currentSlide), mypage 별 변경
  if (pathname === '/announce') {
    if (currentSlide === 0) {
      textToCopy = compareScriptToggle ? finalScript : originScript;
      copyMessage = GLOBAL_TXT.copy.aleretModifyCopy;
    } else if (currentSlide === 1) {
      textToCopy = finalScript;
      copyMessage = GLOBAL_TXT.copy.alertFinalCopy;
    }
  } else {
    textToCopy = saveAnnounce;
    copyMessage = GLOBAL_TXT.copy.alertFinalCopy;
  }

  return (
    <>
      {isDisabled ? (
        <div className="!cursor-default">
          <CopyIcon />
        </div>
      ) : (
        // 복사 기능이 활성화된 경우
        <CopyToClipboard
          className="copyClipboard"
          text={textToCopy}
          onCopy={() => alert(copyMessage)}
        >
          <div>
            <CopyIcon />
          </div>
        </CopyToClipboard>
      )}
    </>
  );
}
