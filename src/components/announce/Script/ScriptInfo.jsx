import { useCompareScriptStore, useImprovementStore, useScriptInfoStore } from '@/store/store';
import { ANNOUNCE_TXT } from '@/utils/constants';

export default function ScriptInfo() {
  const { estimatedPresentTime } = useScriptInfoStore();
  const { improvementMent, improveModal, setImproveModal } = useImprovementStore();
  const { compareScriptToggle } = useCompareScriptStore();
  const scriptInfoTxt = ANNOUNCE_TXT.scriptWrite;

  const renderImprovement = () => {
    // 원본 개선내용 : 없음
    if (!compareScriptToggle) return scriptInfoTxt.improvementMentNone;

    const manyMents = improvementMent.length > 1;
    const firstMent = improvementMent[0] || '';
    const isFirstMentLong = firstMent.length > 25;

    // "더보기" 버튼을 보여줘야 하는 경우
    const showMoreBtn = !improveModal && (manyMents || isFirstMentLong);
    const previewMent = firstMent.length > 30 ? firstMent.slice(0, 25) + '...' : firstMent;

    return (
      <>
        <span className="block text-sm">{previewMent}</span>
        {showMoreBtn && (
          <button
            onClick={() => setImproveModal(true)}
            className="inline-block pl-3 text-sm text-blue-500 underline"
          >
            더보기
          </button>
        )}
      </>
    );
  };

  return (
    <>
      <div className="script_info">
        <p>
          {estimatedPresentTime} ({scriptInfoTxt.estimatedPresentTime})
        </p>
        <p className="flex">
          {scriptInfoTxt.improvementMent} &nbsp;{renderImprovement()}
        </p>
      </div>
    </>
  );
}
