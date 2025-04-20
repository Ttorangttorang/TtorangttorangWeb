import { useCallback } from 'react';
import { diffChars } from 'diff';
import * as stores from '@/store/store';
import { fetchAnnounceData } from '@/api/fetchData';

export function useScriptCorrection(setHighlightedText, setImproveData) {
  const settings = stores.useSettingStore();
  const { finalScript, setFinalScript } = stores.useFinalScriptStore();
  const { setScriptLoading } = stores.useScriptLoadingStore();
  const { setNextMoveBtn } = stores.useNextMoveBtnStore();
  const { setcompareScriptToggle } = stores.useCompareScriptStore();
  const { setCharCountOrigin } = stores.useScriptInfoStore();

  // 변경된 부분 강조
  const highlightDiffs = useCallback(
    (oldStr, newStr) => {
      const diff = diffChars(oldStr, newStr);
      const highlights = [];

      diff.forEach((part) => {
        if (part.added) {
          highlights.push(part.value.trim());
        }
      });

      setHighlightedText(highlights);
    },
    [setHighlightedText],
  );

  // 교정하기 버튼 클릭시
  const modifyScript = useCallback(
    async ({ compareScriptToggle, modifyBtn }) => {
      setScriptLoading(true);
      try {
        const data = {
          topic: settings.subject,
          purpose: settings.presentPurpose,
          content: finalScript.length > 0 ? finalScript : settings.originScript,
          word: settings.endingTxt,
          duplicate: settings.repeat === true ? 'Y' : 'N',
        };

        // AI 교정 API 호출 (stream 형태 응답 처리)
        const response = await fetchAnnounceData(data);
        const raw = response.data.replace(/data:/g, '');
        const events = raw.split('\n\n');
        const contents = [];

        events.forEach((event) => {
          if (event.trim()) {
            try {
              const jsonData = JSON.parse(event);
              const content = jsonData.message?.content || '';
              if (content) {
                contents.push(content);
              }
            } catch (e) {
              console.warn('JSON parse 실패', e);
            }
          }
        });

        // 전체 응답 텍스트 합치기
        const fullText = contents.join('');
        const improveIndex = fullText.indexOf('개선 내용');

        const extractedScript = fullText
          .substring(0, improveIndex !== -1 ? improveIndex : undefined)
          .replace('발표 대본', '')
          .replace(/[-:*]/g, '')
          .trim();

        // "개선 내용" 부분 추출
        const improvementText =
          improveIndex !== -1
            ? fullText
                .substring(improveIndex)
                .replace('개선 내용', '')
                .split('\n') // 각 줄로 분리
                .map((line) => line.replace(/[-:*]/g, '').trim()) // 각 줄에서 불필요한 문자 제거
                .filter(Boolean)
            : ['발표 흐름 매끄럽게 이어지도록 구성 변경']; // 개선 내용이 없는 경우에는 빈 문자열로 설정

        setImproveData(improvementText);

        // 교정 이력이 존재할 경우
        if (finalScript.length > 0 && modifyBtn && compareScriptToggle) {
          const oldScript = finalScript.slice(0, 3000);
          settings.setOriginScript(oldScript); // 원본 상태에 기존 교정문 저장
          setCharCountOrigin(oldScript.length);
          setFinalScript(extractedScript); // 새로운 교정문 저장
          highlightDiffs(oldScript, extractedScript);
        } else {
          // 최초 교정
          highlightDiffs(settings.originScript, extractedScript);
          setFinalScript(extractedScript);
        }

        // setCharCountNew(extractedScript.length);
        setcompareScriptToggle(true);
        setNextMoveBtn(true); // 다음 이동 버튼 활성화
      } catch (err) {
        console.error('교정 실패:', err);
      } finally {
        setScriptLoading(false);
      }
    },
    [setScriptLoading, settings, finalScript, setImproveData, setcompareScriptToggle, setNextMoveBtn, setCharCountOrigin, setFinalScript, highlightDiffs],
  );

  return { modifyScript, highlightDiffs };
}
