import { useEffect, useState } from 'react';
import * as stores from '@/store/store';
import GuideMent from '../GuideMent';
import NoneQnA from './NoneQnA';
import DisplayQnA from './DisplayQnA';
import BtnsQnA from './BtnsQnA';
import BackSlideBtn from '@/components/layout/BackSlideBtn';
import { ANNOUNCE_TXT } from '@/utils/constants';
import { cls } from '@/utils/config';
import { fetchQnAData, fetchSaveScript } from '@/api/fetchData';

export default function QnABox(props) {
  const { userEmail, userAccessToken, announcePage, qaItems, sliderMobileRef, getQAList } = props;
  const { isMobileDevice } = stores.useIsMobileStore();
  const { finalScript, qaArray } = stores.useFinalScriptStore();
  const { subject } = stores.useSettingStore();
  const { askListState, setAskListState } = stores.useAskListStateStore();

  // 클릭 시 질문 펼침/접기 처리
  const toggleQAItem = (index) => {
    const newState = [...askListState];
    newState[index] = !newState[index];
    setAskListState(newState);
  };

  // 질문 펼침 초기화
  useEffect(() => {
    setAskListState([false, false, false, false]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  // 조건별 css
  //pc
  const qnaAreaClass = cls('qa_area', announcePage ? 'h-[52vmin]' : 'h-[55.55vmin]');

  return (
    <>
      <div className="qa_box">
        <GuideMent
          firstMent={ANNOUNCE_TXT.GuideTxt.twoStep.right.firstMent}
          secondMent={ANNOUNCE_TXT.GuideTxt.twoStep.right.secondMent}
          saveMentStyle={announcePage ? '' : 'saveMentStyle'}
        />
        <div>
          {isMobileDevice ? (
            <div className="qa_area">
              <ul>
                {qaArray?.map((item, index) => (
                  <li
                    key={index}
                    onClick={() => toggleQAItem(index)}
                  >
                    <DisplayQnA
                      // announcePage={announcePage}
                      item={item}
                      index={index}
                      askListState={askListState}
                    />
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className={qnaAreaClass}>
              {qaArray?.length === 0 && announcePage ? (
                <NoneQnA />
              ) : (
                <ul>
                  {qaItems?.map((item, index) => (
                    <li
                      key={index}
                      onClick={() => toggleQAItem(index)}
                    >
                      <DisplayQnA
                        announcePage={announcePage}
                        item={item}
                        index={index}
                        askListState={askListState}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
          {!isMobileDevice && (
            <BtnsQnA
              announcePage={announcePage}
              getQAList={getQAList}
              userEmail={userEmail}
              saveScri
              ptToAccount={saveScriptToAccount}
            />
          )}
        </div>
      </div>
      {isMobileDevice && (
        <div className="slideMove_btn_area">
          <BackSlideBtn
            backSlideNum={2}
            sliderMobileRef={sliderMobileRef}
          />
          <div className="next_step active_color">질문 다시 받기</div>
          <div className="next_step active_color">저장하기</div>
        </div>
      )}
    </>
  );
}
