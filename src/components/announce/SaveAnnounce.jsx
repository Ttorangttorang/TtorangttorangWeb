import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useFinalScriptStore, useSettingStore, useQaLoadingStore, useAskListStateStore } from '@/store/store';
import { cls } from '@/utils/config';
import { fetchModifyScript, fetchQnAData, fetchSaveScript, getDetailScript } from '@/api/fetchData';
import { useRouter } from 'next/router';
import { ANNOUNCE_TXT, MYPAGE_TXT } from '@/utils/constants';
import GuideMent from './GuideMent';
import FinalAnnounce from './ExpectedQnA/FinalAnnounce';
import QnABox from './ExpectedQnA/QnABox';

export default function SaveAnnounce({ userEmail, userAccessToken }) {
  const pathname = usePathname();
  const { subject } = useSettingStore();
  const [announcePage, setAnnouncePage] = useState(true);
  const { finalScript, setFinalScript, qaArray, setQaArray } = useFinalScriptStore();
  const [charCountFinal, setCharCountFinal] = useState(0);
  const { setAskListState } = useAskListStateStore();
  const { setQaLoading } = useQaLoadingStore();
  // 저장한 발표문
  const [modifySaveAnnounce, setModifySaveAnnounce] = useState(false);
  const [saveAnnounce, setSaveAnnounce] = useState('');
  const [saveAnnounceCharCount, setSaveAnnounceCharCount] = useState(0);
  const [modifyTitle, setModifyTitle] = useState('');
  const [modifyTitleCharCount, setModifyTitleCharCount] = useState(0);
  const [saveQaArray, setSaveQaArray] = useState([]);

  // 교정하기 페이지 = true / 마이 발표문 상세 = false
  useEffect(() => {
    if (pathname === '/announce') {
      setAnnouncePage(true);
    } else {
      setAnnouncePage(false);
    }
  }, [pathname]);

  // 선 작성 후 로그인 시 작성문 유지
  useEffect(() => {
    const savedFinals = localStorage.getItem('final');
    if (userEmail && savedFinals) {
      // 로컬 스토리지에서 설정을 불러오기
      const { finalScript = '', qaArray = [] } = JSON.parse(savedFinals);

      setFinalScript(finalScript);
      setQaArray(qaArray);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userEmail]);

  // 발표문 수정
  const userModifyScript = (event) => {
    const MAX_LENGTH = 3000;
    let draft = event.target.value;

    if (draft.length > MAX_LENGTH) {
      draft = event.target.value.slice(0, MAX_LENGTH);
    }

    // 교정하기, 저장본 페이지 구분
    if (announcePage) {
      setFinalScript(draft);
      setCharCountFinal(draft.length);
    } else {
      setSaveAnnounce(draft);
      setSaveAnnounceCharCount(draft.length);
    }
  };

  useEffect(() => {
    setCharCountFinal(finalScript.length);
  }, [finalScript]);

  // 예상질문 답변
  const getQAList = async () => {
    setQaLoading(true);
    try {
      const data = {
        content: finalScript.replace(/\n/g, ''),
      };

      //data
      const response = await fetchQnAData(data);
      const redData = response.data.replace(/data:/g, '');
      const events = redData.split('\n\n'); // 이벤트 분리
      const newQnaContentQueue = [];
      events.forEach((event) => {
        if (event.trim()) {
          try {
            const jsonData = JSON.parse(event);
            const content = jsonData.message?.content || '';

            if (content) {
              // 상태를 업데이트하여 새 content 값을 배열에 추가
              newQnaContentQueue.push(content);
            }
          } catch (error) {
            console.error('Failed to parse JSON:', error);
          }
        }
      });
      const finaldata = newQnaContentQueue.join('');

      // Q&A 데이터 파싱
      const qnaArray = [];
      const qnaPairs = finaldata.split(/\n{2,}|\\n{2,}/);

      qnaPairs.forEach((pair) => {
        const [question, answer] = pair.split(/\nA|\\nA/);
        if (question && answer) {
          qnaArray.push({
            question: question
              .trim()
              .replace('Q', '')
              .replace(/^\d+\.\s*/, '')
              .trim(),
            answer: answer
              .trim()
              .replace('A', '')
              .replace(/^\d+\.\s*/, '')
              .trim(),
          });
        }
      });

      if (qnaArray.length > 0) {
        setQaArray(qnaArray);
      }
      setQaLoading(false);
      setAskListState([false, false, false, false]);
    } catch (error) {
      console.error('Error fetching modified script:', error);
      setQaLoading(false);
    }
  };

  // 저장
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

  // 저장한 내 발표문 제목
  const userModifyTitle = (event) => {
    const MAX_LENGTH = 30;
    let title = event.target.value;

    if (title.length > MAX_LENGTH) {
      title = event.target.value.slice(0, MAX_LENGTH);
    }
    setModifyTitle(title);
    setModifyTitleCharCount(title.length);
  };

  const sliceTitleOverThirty = (text) => {
    return text.length > 30 ? text.slice(0, 30) + '...' : text;
  };

  // 저장한 내 발표문 data 가져오기
  const router = useRouter();
  const [scriptId, setScriptId] = useState('');
  const { id } = router.query;

  useEffect(() => {
    if (router.isReady && id) {
      if (router.pathname.startsWith('/mypage/announce/')) {
        setScriptId(id);
      }
    }
  }, [router.isReady, id, router.pathname]);

  const {
    data: myScriptDetail,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['myScriptDetail'],
    queryFn: () => getDetailScript(userAccessToken, scriptId),
    enabled: !!scriptId, // scriptId가 있을 때만 쿼리 실행
  });

  useEffect(() => {
    if (myScriptDetail) {
      const detailTopic = myScriptDetail.data.data.topic;
      const detailScript = myScriptDetail.data.data.content;
      const detailQA = myScriptDetail.data.data.qnaList;

      setModifyTitle(detailTopic);
      setSaveAnnounce(detailScript);
      setSaveAnnounceCharCount(detailScript.length);
      setSaveQaArray(detailQA);
    }
  }, [myScriptDetail]);

  // 예상질문 교정페이지 / 마이페이지 구분
  const qaItems = scriptId && scriptId ? saveQaArray : qaArray;

  // 저장한 발표문 유저 수정
  const userModifySavedScript = async () => {
    try {
      const data = {
        content: saveAnnounce,
        topic: modifyTitle,
      };
      await fetchModifyScript(data, userAccessToken, scriptId);
    } catch (error) {
      console.error('Error fetching modified script:', error);
    }
  };

  // 조건별 css
  const containerClass = cls('main_container', announcePage ? '' : 'myAnnounce_detail_container');
  const announceFormClass = cls(announcePage ? 'pt-[3.36vmin]' : 'pt-0');
  const myAnnounceClass = cls('scriptSave_btn', modifySaveAnnounce ? 'active_color' : 'gray_colorTxt area_border', announcePage ? 'mt-[3.04vmin]' : 'mt-[2.28vmin]');

  // 마이페이지 발표문 수정 여부 버튼 텍스트 변경
  const changeAnnounceBtnTxt = modifySaveAnnounce ? MYPAGE_TXT.detailMyScript.saveBtn : MYPAGE_TXT.detailMyScript.modifyBtn;

  return (
    <section className={containerClass}>
      {announcePage && <div className="progress_bar"></div>}
      <section className="saveQa_area">
        <form className={announceFormClass}>
          <div className="userModify_box">
            {announcePage && (
              <GuideMent
                firstMent={ANNOUNCE_TXT.GuideTxt.twoStep.left.firstMent}
                secondMent={ANNOUNCE_TXT.GuideTxt.twoStep.left.secondMent}
              />
            )}
            {/* 마이페이지 상세 발표문 제목 변경 */}
            {!announcePage && (
              <div className="scriptTitle_area">
                <p>({modifyTitleCharCount}/30)</p>
                <input
                  maxLength="30"
                  value={sliceTitleOverThirty(modifyTitle)}
                  onChange={userModifyTitle}
                  disabled={modifySaveAnnounce ? false : true}
                />
              </div>
            )}
            {/* 최종 발표문 */}
            <div className={cls('scriptFinal_area', announcePage ? 'h-[51.59vmin]' : 'h-[55.55vmin]')}>
              <p className="title">{ANNOUNCE_TXT.scriptFinal.title}</p>
              <FinalAnnounce
                announcePage={announcePage}
                saveAnnounce={saveAnnounce}
                userModifyScript={userModifyScript}
                modifySaveAnnounce={modifySaveAnnounce}
                charCountFinal={charCountFinal}
                saveAnnounceCharCount={saveAnnounceCharCount}
              />
            </div>
            {/* 마이페이지 상세 발표문 사용자 수정 및 저장 */}
            {!announcePage && (
              <button
                type="button"
                className={myAnnounceClass}
                onClick={() => {
                  if (!modifySaveAnnounce) {
                    setModifySaveAnnounce(!modifySaveAnnounce);
                  } else {
                    userModifySavedScript();
                    setModifySaveAnnounce(false);
                    router.push('/mypage');
                  }
                }}
              >
                {changeAnnounceBtnTxt}
              </button>
            )}
          </div>
          {/* 예상 질문 답변 영역 */}
          <QnABox
            userEmail={userEmail}
            userAccessToken={userAccessToken}
            announcePage={announcePage}
            qaItems={qaItems}
            getQAList={getQAList}
          />
        </form>
      </section>
    </section>
  );
}
