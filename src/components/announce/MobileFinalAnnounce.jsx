import { ANNOUNCE_TXT } from '@/utils/constants';
import GuideMent from './GuideMent';
import FinalAnnounce from './ExpectedQnA/FinalAnnounce';
import { cls, formatNumber } from '@/utils/config';
import { useState } from 'react';
import CopyAnnounce from './CopyAnnounce';
import * as stores from '@/store/store';
import BackSlideBtn from '../layout/BackSlideBtn';
import { fetchQnAData } from '@/api/fetchData';

export default function MobileFinalAnnounce({ sliderMobileRef }) {
  const [saveAnnounce, setSaveAnnounce] = useState('');
  const [charCountFinal, setCharCountFinal] = useState(0);
  const [modifySaveAnnounce, setModifySaveAnnounce] = useState(false);
  const [saveAnnounceCharCount, setSaveAnnounceCharCount] = useState(0);
  const MAX_LENGTH = 3000;
  const { finalScript, setFinalScript, setQaArray, qaArray } = stores.useFinalScriptStore();
  const { setQaLoading } = stores.useQaLoadingStore();
  const { setCurrentMobileSlide } = stores.useCurrentSlideMobileStore();
  const { setAskListState } = stores.useAskListStateStore();

  // 발표문 수정
  const userModifyScript = (event) => {
    const MAX_LENGTH = 3000;
    let draft = event.target.value;

    if (draft.length > MAX_LENGTH) {
      draft = event.target.value.slice(0, MAX_LENGTH);
    }

    setFinalScript(draft);
    setCharCountFinal(draft.length);
  };

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
        setCurrentMobileSlide(3);
        sliderMobileRef.current.slickGoTo(3);
      }
      setQaLoading(false);
      setAskListState([false, false, false, false]);
    } catch (error) {
      console.error('Error fetching modified script:', error);
      setQaLoading(false);
    }
  };

  return (
    <>
      <div className="userModify_box">
        <GuideMent
          firstMent={ANNOUNCE_TXT.GuideTxt.twoStep.left.firstMent}
          secondMent={ANNOUNCE_TXT.GuideTxt.twoStep.left.secondMent}
        />
        {/* 최종 발표문 */}
        <div className={cls('scriptFinal_area')}>
          <p className="title">{ANNOUNCE_TXT.scriptFinal.title}</p>
          <div className="scriptTxt">
            <textarea
              placeholder={ANNOUNCE_TXT.scriptWrite.inputDescription}
              maxLength={MAX_LENGTH}
              value={finalScript}
              onChange={userModifyScript}
              disabled={false}
            />
            <p className="charCount">
              {formatNumber(charCountFinal)}/ {MAX_LENGTH}
            </p>
          </div>
          <div className="contentInfo_area">
            <CopyAnnounce saveAnnounce={saveAnnounce} />
          </div>
        </div>
      </div>
      <div className="slideMove_btn_area">
        <BackSlideBtn
          backSlideNum={1}
          sliderMobileRef={sliderMobileRef}
        />
        <div
          onClick={() => {
            if (qaArray.length > 0) {
              // 이미 예상 질문을 받은 경우 바로 슬라이드 이동
              setCurrentMobileSlide(3);
              sliderMobileRef.current.slickGoTo(3);
            } else {
              // 예상 질문을 받은 적이 없는 경우
              getQAList();
            }
          }}
          className={cls('next_step', finalScript.length > 0 ? 'active_color' : 'disabled_color')}
        >
          {qaArray.length > 0 ? '예상 질문 확인하기' : '예상 질문 받기'}
        </div>
      </div>
    </>
  );
}
