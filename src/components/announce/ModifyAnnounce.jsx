import { useEffect, useState, useRef } from 'react';
import GuideMent from './GuideMent';
import { cls } from '@/utils/config';
import { fetchAnnounceData } from '@/api/fetchData';
import { diffChars } from 'diff';
import * as stores from '@/store/store';
import AnnouncContent from './Draft/AnnouncContent';
import ScriptInfo from './Draft/ScriptInfo';
import ScriptFunc from './Draft/ScriptFunc';
import DetailSetting from './Draft/DetailSetting';
import { ANNOUNCE_TXT } from '@/utils/constants';

export default function ModifyAnnounce({ userEmail }) {
  const { setNextMoveBtn } = stores.useNextMoveBtnStore();
  const { setFinalScript } = stores.useFinalScriptStore();
  const { setScriptLoading } = stores.useScriptLoadingStore();
  const settings = stores.useSettingStore();
  const initialSettings = stores.useInitialSettingStore();
  const { charCountOrigin, setCharCountOrigin } = stores.useCharCountOriginStore();
  const [modifyBtn, setModifyBtn] = useState(false);
  const { setSubjectCharCount } = stores.useSubjectCharCountStore();
  // 개선내용
  const [improvementMent, setImprovementMent] = useState('없음');
  //교정문
  const [initialNewScript, setInitialNewScript] = useState('');
  const [charCountNew, setCharCountNew] = useState(0);
  const { compareScriptToggle, setcompareScriptToggle } = stores.useCompareScriptStore();
  const [highlightedText, setHighlightedText] = useState([]);
  const scriptWriteBoxRef = useRef(null);
  // 예상 발표 시간
  const { estimatedPresentTime, setEstimatedPresentTime } = stores.useEstimatedPresentTimeStore();

  // 선 작성 후 로그인 시 작성문 유지
  useEffect(() => {
    const savedSettings = localStorage.getItem('settings');
    if (userEmail && savedSettings) {
      // 로컬 스토리지에서 설정을 불러오기
      const { originScript = '', subject = '', newScript = '', presentPurpose = '회사 컨퍼런스', endingTxt = '합니다체', repeat = false } = JSON.parse(savedSettings);

      settings.setOriginScript(originScript);
      settings.setSubject(subject);
      settings.setNewScript(newScript);
      settings.setPresentPurpose(presentPurpose);
      settings.setEndingTxt(endingTxt);
      settings.setRepeat(repeat);

      if (newScript) {
        setNextMoveBtn(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userEmail]);

  // 초안 작성
  const writeOriginScript = (event) => {
    const MAX_LENGTH = 3000;
    let draft = event.target.value;

    if (draft.length > MAX_LENGTH) {
      draft = event.target.value.slice(0, MAX_LENGTH);
    }
    settings.setOriginScript(draft);
    setCharCountOrigin(draft.length);
  };

  // 예상 발표 시간
  useEffect(() => {
    const estimatedTime = compareScriptToggle ? Math.ceil(charCountNew / 5) : Math.ceil(charCountOrigin / 5); // 초 단위
    const minutes = Math.floor(estimatedTime / 60);
    const seconds = estimatedTime % 60;
    setEstimatedPresentTime(`${minutes < 10 ? '0' + minutes : minutes}분 ${seconds < 10 ? '0' + seconds : seconds}초`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [charCountOrigin, charCountNew, settings.originScript, compareScriptToggle]);

  // script 초기화 버튼
  const deleteAllScript = () => {
    settings.clearSettings();
    setCharCountOrigin(0);
    setSubjectCharCount(0);
    setEstimatedPresentTime('0분 0초');
    setcompareScriptToggle(false);
  };

  // 교정하기 버튼 활성화
  useEffect(() => {
    if (compareScriptToggle) {
      // 초안, 교정문 변경,세팅값 변경 있을경우 true
      setModifyBtn(
        (settings.originScript && settings.newScript && initialSettings.initialNewScript !== settings.newScript) ||
          initialSettings.initialSubject !== settings.subject ||
          initialSettings.initialPresentPurpose !== settings.presentPurpose ||
          initialSettings.initialEndingTxt !== settings.endingTxt ||
          initialSettings.initialrepeat !== settings.repeat,
      );
    } else {
      // 초안, 주제 있을경우 true
      setModifyBtn(settings.originScript && settings.subject);
    }
  }, [
    settings.originScript,
    settings.subject,
    settings.newScript,
    settings.presentPurpose,
    settings.endingTxt,
    settings.repeat,
    compareScriptToggle,
    initialSettings.initialNewScript,
    initialSettings.initialSubject,
    initialSettings.initialPresentPurpose,
    initialSettings.initialEndingTxt,
    initialSettings.initialrepeat,
  ]);

  const highlightDiffs = (oldStr, newStr) => {
    const diff = diffChars(oldStr, newStr);
    const highlights = [];

    diff
      .map((part) => {
        if (part.added) {
          highlights.push(part.value.trim());
        }
        if (!part.removed) {
          return part.value;
        }
      })
      .join('');

    setHighlightedText(highlights);
  };

  //  교정하기 버튼
  const modifyScript = async () => {
    setScriptLoading(true);
    try {
      const data = {
        topic: settings.subject,
        purpose: settings.presentPurpose,
        content: settings.originScript,
        word: settings.endingTxt,
        duplicate: settings.repeat === true ? 'Y' : 'N',
      };

      // 비교값 저장
      initialSettings.setInitialSubject(settings.subject);
      initialSettings.setInitialPresentPurpose(settings.presentPurpose);
      initialSettings.setInitialEndingTxt(settings.endingTxt);
      initialSettings.setInitialRepeat(settings.repeat);
      //data
      const response = await fetchAnnounceData(data);
      const redData = response.data.replace(/data:/g, '');
      const events = redData.split('\n\n'); // 이벤트 분리
      const newContentQueue = [];
      events.forEach((event) => {
        if (event.trim()) {
          try {
            const jsonData = JSON.parse(event);
            const content = jsonData.message?.content || '';

            if (content) {
              // 상태를 업데이트하여 새 content 값을 배열에 추가
              newContentQueue.push(content);
            }
          } catch (error) {
            console.error('Failed to parse JSON:', error);
          }
        }
      });

      const finaldata = newContentQueue.join('');
      const improveIndex = finaldata.indexOf('개선 내용');

      // === 교정문 === //
      let extractedScriptText;
      if (improveIndex !== -1) {
        // '개선 내용'이 있을 때
        extractedScriptText = finaldata.substring(0, improveIndex).replace('발표 대본', '').trim().replace(/[-:*]/g, '').trim();
      } else {
        // '개선 내용'이 없을 때
        extractedScriptText = finaldata.replace('발표 대본', '').trim().replace(/[-:*]/g, '').trim();
      }

      // === 개선내용 === //
      let extractedImproveEText = '';
      if (improveIndex !== -1) {
        extractedImproveEText = finaldata.substring(improveIndex).replace('개선 내용', '').trim();
        // 각 줄에서 '-'와 공백을 제거한 후 배열화
        const improvementPairs = extractedImproveEText
          .split('\n') // 각 줄로 분리
          .map((item) => item.replace(/[-:*]/g, '').trim()); // 각 줄에서 불필요한 문자 제거

        const firstImprovement = improvementPairs.filter((text) => text.length !== 0);
        setImprovementMent(firstImprovement[0]);
      } else {
        setImprovementMent('발표 흐름 매끄럽게 이어지도록 구성 변경'); // 개선 내용이 없는 경우에는 빈 문자열로 설정
      }

      // 재교정 시 (2회차 이상)
      if (settings.newScript.length > 0 && modifyBtn && compareScriptToggle) {
        const oldScript = newScript.slice(0, 3000);
        const updatedScript = extractedScriptText;

        // 2회차 새로운 교정본을 newScript로 설정 1회차는 구
        settings.setOriginScript(oldScript);
        setInitialNewScript(updatedScript);
        settings.setNewScript(updatedScript);
        setFinalScript(updatedScript);
        highlightDiffs(oldScript, updatedScript);
      } else {
        // 첫 번째 교정
        highlightDiffs(settings.originScript, extractedScriptText);
        setInitialNewScript(extractedScriptText);
        settings.setNewScript(extractedScriptText);
        setFinalScript(extractedScriptText);
      }

      setCharCountNew(extractedScriptText.length);
      setcompareScriptToggle(true);
      setScriptLoading(false);
      setNextMoveBtn(true);
    } catch (error) {
      console.error('Error fetching modified script:', error);
      setScriptLoading(false);
    }
  };

  // 버튼활성화 조건
  const getButtonClass = (condition) => cls(condition ? 'active_color cursor-pointer' : 'cursor-default');

  return (
    <section className="main_container">
      <div className="progress_bar"></div>
      <section className="correction_area">
        <form>
          <div className="scriptWrite_box">
            <GuideMent
              firstMent={ANNOUNCE_TXT.GuideTxt.oneStep.left.firstMent}
              secondMent={ANNOUNCE_TXT.GuideTxt.oneStep.left.secondMent}
            />
            <div>
              <div className="scriptMain_area">
                <AnnouncContent
                  scriptWriteBoxRef={scriptWriteBoxRef}
                  writeOriginScript={writeOriginScript}
                  charCountOrigin={charCountOrigin}
                  highlightedText={highlightedText}
                  charCountNew={charCountNew}
                  setCharCountNew={setCharCountNew}
                />
              </div>
              <div className="contentInfo_area">
                <ScriptFunc />
                <ScriptInfo
                  improvementMent={improvementMent}
                  estimatedPresentTime={estimatedPresentTime}
                />
              </div>
            </div>
          </div>
          <div className="scriptSetting_box">
            <GuideMent
              firstMent={ANNOUNCE_TXT.GuideTxt.oneStep.right.firstMent}
              secondMent={ANNOUNCE_TXT.GuideTxt.oneStep.right.secondMent}
            />
            <div>
              <DetailSetting />
              <div className="modifyBtn_box">
                <button
                  type="button"
                  onClick={() => {
                    if (settings.originScript.length > 0 || settings.subject.length > 0) {
                      deleteAllScript();
                    }
                  }}
                  className={getButtonClass(settings.originScript.length > 0 || settings.subject.length > 0)}
                >
                  {ANNOUNCE_TXT.modifyBtn.reset}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (modifyBtn) {
                      modifyScript();
                    }
                  }}
                  className={getButtonClass(modifyBtn)}
                >
                  {ANNOUNCE_TXT.modifyBtn.modify}
                </button>
              </div>
            </div>
          </div>
        </form>
      </section>
    </section>
  );
}
