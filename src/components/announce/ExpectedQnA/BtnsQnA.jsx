import { useFinalScriptStore, useLoginModalStore, useSettingStore, useUserStore } from '@/store/store';
import { cls } from '@/utils/config';
import { ANNOUNCE_TXT, MYPAGE_TXT } from '@/utils/constants';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useGenerateQnA } from '@/hooks/useGenerateQnA';
import { fetchSaveScript } from '@/api/fetchData';

export default function BtnsQnA(props) {
  const { announcePage } = props;
  const { finalScript, qaArray } = useFinalScriptStore();
  const { setLogin } = useLoginModalStore();
  const { subject } = useSettingStore();
  const { getQAList } = useGenerateQnA();
  const { userEmail, userAccessToken } = useUserStore();
  const router = useRouter();

  // 조건별 css
  const qnaBtnActiveClass = cls(finalScript.length > 0 ? 'active_color cursor-pointer' : 'cursor-default');
  const saveTotalAnnounceClass = cls(qaArray?.length > 0 ? 'active_color cursor-pointer' : 'cursor-default bg-[#fff]');

  // 예상질문 여부 버튼 텍스트 변경
  const getQnaBtnTxt = qaArray?.length > 0 ? ANNOUNCE_TXT.scriptFinal.AgainGetQna : ANNOUNCE_TXT.scriptFinal.initialGetQna;

  // 최종 저장
  const saveScriptToAccount = async () => {
    try {
      const data = {
        content: finalScript,
        topic: subject,
        qnaList: qaArray,
      };
      await fetchSaveScript(data, userAccessToken);
    } catch (error) {
      console.error('Error fetching save script:', error);
    }
  };

  // 저장시 로그인 여부
  const handleSaveClick = () => {
    if (userEmail && qaArray.length > 0) {
      saveScriptToAccount();
      router.push('/mypage');
    } else if (qaArray.length > 0) {
      setLogin(true);
    }
  };

  return (
    <>
      {/* 교정하기 2step */}
      {announcePage && (
        <div className="finalBtn_box">
          <button
            type="button"
            onClick={getQAList}
            className={qnaBtnActiveClass}
          >
            {getQnaBtnTxt}
          </button>
          <button
            type="button"
            onClick={handleSaveClick}
            className={saveTotalAnnounceClass}
          >
            {ANNOUNCE_TXT.scriptFinal.saveBtn}
          </button>
        </div>
      )}
      {/* 마이페이지 상세 발표문 */}
      {!announcePage && (
        <Link
          href={'/mypage'}
          type="button"
          className="back_btn"
        >
          {MYPAGE_TXT.detailMyScript.backBtn}
        </Link>
      )}
    </>
  );
}
