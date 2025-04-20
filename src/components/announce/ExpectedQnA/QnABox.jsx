import { useEffect } from 'react';
import * as stores from '@/store/store';
import GuideMent from '../Shared/GuideMent';
import NoneQnA from './NoneQnA';
import DisplayQnA from './DisplayQnA';
import BtnsQnA from './BtnsQnA';
import BackSlideBtn from '@/components/layout/BackSlideBtn';
import { ANNOUNCE_TXT } from '@/utils/constants';
import { cls } from '@/utils/config';
import { useRouter } from 'next/router';
import { deleteAllScript } from '@/store/store';

export default function QnABox(props) {
  const { userEmail, userAccessToken, announcePage, qaItems, sliderMobileRef } = props;
  const { isMobileDevice } = stores.useIsMobileStore();
  const { qaArray } = stores.useFinalScriptStore();
  const { askListState, setAskListState } = stores.useAskListStateStore();
  const router = useRouter();

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

  // 조건별 css
  // Desktop 예상 질문과 답변 교정페이지 / 마이페이지
  const qnaAreaClass = cls('qa_area', announcePage ? 'h-[52vmin]' : 'h-[55.55vmin]');

  // 초기화
  const handleGoBack = () => {
    deleteAllScript();
    router.push('/onboarding');
  };

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
                      announcePage={announcePage}
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
          {/* Desktop 예상질문 & 저장 버튼 */}
          {!isMobileDevice && (
            <BtnsQnA
              announcePage={announcePage}
              userEmail={userEmail}
              userAccessToken={userAccessToken}
            />
          )}
        </div>
      </div>
      {/* Mobile 예상질문페이지영역 돌아가기 버튼 */}
      {isMobileDevice && (
        <div className="slideMove_btn_area">
          <BackSlideBtn
            backSlideNum={2}
            sliderMobileRef={sliderMobileRef}
          />
          <button
            onClick={handleGoBack}
            className="next_step active_color"
          >
            처음으로 돌아가기기
          </button>
        </div>
      )}
    </>
  );
}
