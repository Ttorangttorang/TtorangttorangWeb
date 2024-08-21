import { useEffect, useState } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import GuideMent from './GuideMent';
import { useQuery } from '@tanstack/react-query';
import * as LocalImages from '@/utils/imageImports';
import { useFinalScriptStore, useSettingStore, useQaLoadingStore, useLoginModalStore } from '@/store/store';
import { askListArray, cls, formatNumber } from '@/utils/config';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Link from 'next/link';
import { fetchModifyScript, fetchQnAData, fetchSaveScript, getDetailScript } from '@/api/fetchData';
import { useRouter } from 'next/router';
import { ANNOUNCE_TXT, MYPAGE_TXT } from '@/utils/constants';

export default function SaveAnnounce({ userEmail, userAccessToken }) {
  const pathname = usePathname();
  const { subject } = useSettingStore();
  const { setLogin } = useLoginModalStore();
  const [announcePage, setAnnouncePage] = useState(true);
  const { finalScript, setFinalScript, qaArray, setQaArray } = useFinalScriptStore();
  const [charCountFinal, setCharCountFinal] = useState(0);
  const [askListState, setAskListState] = useState([false, false, false, false]);
  // 로딩
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

  // 클릭 시 질문 펼침/접기 처리
  const toggleQAItem = (index) => {
    setAskListState((prevState) => prevState.map((item, i) => (i === index ? !item : item)));
  };

  // 질문 펼침 초기화
  useEffect(() => {
    setAskListState([false, false, false, false]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  // 최초로 저장된 발표문
  useEffect(() => {
    if (!announcePage) {
      setQaArray(askListArray);
    }
  }, [announcePage, setQaArray]);

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

  return (
    <section className={cls('main_container', announcePage ? '' : 'myAnnounce_detail_container')}>
      {announcePage && <div className="progress_bar"></div>}
      <section className="saveQa_area">
        <form className={cls(announcePage ? 'pt-[3.36vmin]' : 'pt-0')}>
          <div className="userModify_box">
            {announcePage && (
              <GuideMent
                firstMent={ANNOUNCE_TXT.GuideTxt.twoStep.left.firstMent}
                secondMent={ANNOUNCE_TXT.GuideTxt.twoStep.left.secondMent}
              />
            )}
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
            <div className={cls('scriptFinal_area', announcePage ? 'h-[51.59vmin]' : 'h-[55.55vmin]')}>
              <p className="title">{ANNOUNCE_TXT.scriptFinal.title}</p>
              <div className={cls('scriptTxt', announcePage ? 'h-[calc(100%-8vmin)]' : 'h-[44vmin]')}>
                <textarea
                  placeholder={ANNOUNCE_TXT.scriptWrite.inputDescription}
                  maxLength="3000"
                  value={announcePage ? finalScript : saveAnnounce}
                  onChange={userModifyScript}
                  disabled={modifySaveAnnounce || announcePage ? false : true}
                  className={cls(announcePage ? 'h-[36vmin]' : '!h-[39vmin]')}
                />
                <p>{announcePage ? formatNumber(charCountFinal) : formatNumber(saveAnnounceCharCount)}/ 3000</p>
              </div>
              <div className="copy_box">
                <CopyToClipboard
                  className="copyClipboard"
                  text={announcePage ? finalScript : saveAnnounce}
                  onCopy={() => alert('완성된 발표문을 복사했어요')}
                >
                  <div>
                    <div className="icon">
                      <Image
                        src={LocalImages.ImageIconCopy}
                        alt="ImageIconCopy"
                        width={24}
                        height={24}
                      />
                    </div>
                    <p>복사하기</p>
                  </div>
                </CopyToClipboard>
              </div>
            </div>
            {!announcePage && (
              <button
                type="button"
                className={cls('scriptSave_btn', modifySaveAnnounce ? 'active_color' : 'gray_colorTxt area_border', announcePage ? 'mt-[3.04vmin]' : 'mt-[2.28vmin]')}
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
                {modifySaveAnnounce ? MYPAGE_TXT.detailMyScript.saveBtn : MYPAGE_TXT.detailMyScript.modifyBtn}
              </button>
            )}
          </div>
          <div className="qa_box">
            <GuideMent
              firstMent={ANNOUNCE_TXT.GuideTxt.twoStep.right.firstMent}
              secondMent={ANNOUNCE_TXT.GuideTxt.twoStep.right.secondMent}
              saveMentStyle={announcePage ? '' : 'saveMentStyle'}
            />
            <div>
              <div className={cls('qa_area', announcePage ? 'h-[52vmin]' : 'h-[55.55vmin]')}>
                {qaArray?.length === 0 && announcePage ? (
                  <div className="none_qa">
                    <div>
                      <Image
                        src={LocalImages.ImageTtorangNote}
                        alt="ImageTtorangNote"
                        width={254}
                        height={254}
                      />
                    </div>
                    <p>
                      {ANNOUNCE_TXT.scriptFinal.noneQna.first}
                      <br />
                      {ANNOUNCE_TXT.scriptFinal.noneQna.second}
                    </p>
                  </div>
                ) : (
                  <ul>
                    {qaItems?.map((item, index) => (
                      <li
                        key={index}
                        onClick={() => toggleQAItem(index)}
                      >
                        <div className={cls('question_area', announcePage ? 'min-h-[12.8vmin]' : 'min-h-[13.7vmin]')}>
                          <p>{ANNOUNCE_TXT.scriptFinal.question}</p>
                          <p className={cls('question', askListState[index] ? 'font-bold' : 'font-medium')}>{item.question}</p>
                          <div className={cls('list_arrow', askListState[index] ? 'scale-y-[-1]' : 'scale-y-[1]')}>
                            <Image
                              src={LocalImages.ImageIconArrow}
                              alt="ImageIconArrow"
                              width={24}
                              height={24}
                            />
                          </div>
                        </div>
                        <div className={cls('answer_area', askListState[index] ? 'on' : '')}>
                        <p>{ANNOUNCE_TXT.scriptFinal.answer}</p>
                          <p className="answer">{item.answer}</p>
                          <div className="list_arrow">
                            <Image
                              src={LocalImages.ImageIconArrow}
                              alt="ImageIconArrow"
                              width={24}
                              height={24}
                            />
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {announcePage && (
                <div className="finalBtn_box">
                  <button
                    type="button"
                    onClick={getQAList}
                    className={cls(finalScript.length > 0 ? 'active_color cursor-pointer' : 'cursor-default')}
                  >
                    {qaArray?.length > 0 ? ANNOUNCE_TXT.scriptFinal.AgainGetQna : ANNOUNCE_TXT.scriptFinal.initialGetQna}
                  </button>
                  <button
                    type="button"
                    onClick={() => (userEmail && qaArray?.length > 0 ? (saveScriptToAccount(), router.push('/mypage')) : qaArray.length > 0 ? setLogin(true) : '')}
                    className={cls(qaArray?.length > 0 ? 'active_color cursor-pointer' : 'cursor-default bg-[#fff]')}
                  >
                    {ANNOUNCE_TXT.scriptFinal.saveBtn}
                  </button>
                </div>
              )}
              {!announcePage && (
                <Link
                  href={'/mypage'}
                  type="button"
                  className="back_btn"
                >
                  {MYPAGE_TXT.detailMyScript.backBtn}
                </Link>
              )}
            </div>
          </div>
        </form>
      </section>
    </section>
  );
}
