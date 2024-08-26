import { ANNOUNCE_TXT } from '@/utils/constants';
import GuideMent from './GuideMent';
import AnnouncContent from './Draft/AnnouncContent';
import ScriptFunc from './Draft/ScriptFunc';
import ScriptInfo from './Draft/ScriptInfo';
import { useEffect, useRef, useState } from 'react';
import { useCharCountOriginStore, useCompareScriptStore, useEstimatedPresentTimeStore, useFinalScriptStore, useInitialSettingStore, useScriptLoadingStore, useSettingStore } from '@/store/store';

export default function MobileWrite({ userEmail }) {
  const scriptWriteBoxRef = useRef(null);
  const { setFinalScript } = useFinalScriptStore();
  const { setScriptLoading } = useScriptLoadingStore();

  const { clearSettings, originScript, setOriginScript, newScript, setNewScript, subject, setSubject, presentPurpose, setPresentPurpose, endingTxt, setEndingTxt, repeat, setRepeat } =
    useSettingStore();
  const { initialSubject, setInitialSubject, initialPresentPurpose, setInitialPresentPurpose, initialEndingTxt, setInitialEndingTxt, initialrepeat, setInitialRepeat } = useInitialSettingStore();
  const { compareScriptToggle, setcompareScriptToggle } = useCompareScriptStore();
  const { charCountOrigin, setCharCountOrigin } = useCharCountOriginStore();
  const [charCountNew, setCharCountNew] = useState(0);
  const [highlightedText, setHighlightedText] = useState([]);
  //교정문
  const [initialNewScript, setInitialNewScript] = useState('');
  // 개선내용
  const [improvementMent, setImprovementMent] = useState('없음');
  // 예상 발표 시간
  const { estimatedPresentTime, setEstimatedPresentTime } = useEstimatedPresentTimeStore();

  // 선 작성 후 로그인 시 작성문 유지
  useEffect(() => {
    const savedSettings = localStorage.getItem('settings');
    if (userEmail && savedSettings) {
      // 로컬 스토리지에서 설정을 불러오기
      const { originScript = '', subject = '', newScript = '', presentPurpose = '회사 컨퍼런스', endingTxt = '합니다체', repeat = false } = JSON.parse(savedSettings);

      setOriginScript(originScript);
      setSubject(subject);
      setNewScript(newScript);
      setPresentPurpose(presentPurpose);
      setEndingTxt(endingTxt);
      setRepeat(repeat);

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
    setOriginScript(draft);
    setCharCountOrigin(draft.length);
  };

  // 예상 발표 시간
  useEffect(() => {
    const estimatedTime = compareScriptToggle ? Math.ceil(charCountNew / 5) : Math.ceil(charCountOrigin / 5); // 초 단위
    const minutes = Math.floor(estimatedTime / 60);
    const seconds = estimatedTime % 60;
    setEstimatedPresentTime(`${minutes < 10 ? '0' + minutes : minutes}분 ${seconds < 10 ? '0' + seconds : seconds}초`);
  }, [charCountOrigin, charCountNew, originScript, compareScriptToggle]);

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
        topic: subject,
        purpose: presentPurpose,
        content: originScript,
        word: endingTxt,
        duplicate: repeat === true ? 'Y' : 'N',
      };

      // 비교값 저장
      setInitialSubject(subject);
      setInitialPresentPurpose(presentPurpose);
      setInitialEndingTxt(endingTxt);
      setInitialRepeat(repeat);
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
      if (newScript.length > 0 && modifyBtn && compareScriptToggle) {
        const oldScript = newScript.slice(0, 3000);
        const updatedScript = extractedScriptText;

        // 2회차 새로운 교정본을 newScript로 설정 1회차는 구
        setOriginScript(oldScript);
        setInitialNewScript(updatedScript);
        setNewScript(updatedScript);
        setFinalScript(updatedScript);
        highlightDiffs(oldScript, updatedScript);
      } else {
        // 첫 번째 교정
        highlightDiffs(originScript, extractedScriptText);
        setInitialNewScript(extractedScriptText);
        setNewScript(extractedScriptText);
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

  return (
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
          <p className="estimatedPresentTime">
            {estimatedPresentTime} ({ANNOUNCE_TXT.scriptWrite.estimatedPresentTime})
          </p>
          <ScriptFunc />
        </div>
      </div>
    </div>
  );
}
