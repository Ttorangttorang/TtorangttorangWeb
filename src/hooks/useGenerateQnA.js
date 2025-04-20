import { useFinalScriptStore, useQaLoadingStore, useAskListStateStore } from '@/store/store';
import { fetchQnAData } from '@/api/fetchData';

export const useGenerateQnA = () => {
  const { finalScript, setQaArray } = useFinalScriptStore();
  const { setQaLoading } = useQaLoadingStore();
  const { setAskListState } = useAskListStateStore();

  const getQAList = async () => {
    setQaLoading(true);
    try {
      const data = {
        content: finalScript.replace(/\n/g, ''),
      };

      const response = await fetchQnAData(data);
      const redData = response.data.replace(/data:/g, '');
      const events = redData.split('\n\n');
      const newQnaContentQueue = [];

      events.forEach((event) => {
        if (event.trim()) {
          try {
            const jsonData = JSON.parse(event);
            const content = jsonData.message?.content || '';
            if (content) newQnaContentQueue.push(content);
          } catch (error) {
            console.error('Failed to parse JSON:', error);
          }
        }
      });

      const finaldata = newQnaContentQueue.join('');
      const qnaArray = [];

      finaldata.split(/\n{2,}|\\n{2,}/).forEach((pair) => {
        const [question, answer] = pair.split(/\nA|\\nA/);
        if (question && answer) {
          qnaArray.push({
            question: question
              .replace('Q', '')
              .replace(/^\d+\.\s*/, '')
              .trim(),
            answer: answer
              .replace('A', '')
              .replace(/^\d+\.\s*/, '')
              .trim(),
          });
        }
      });

      if (qnaArray.length > 0) {
        setQaArray(qnaArray);
        setAskListState([false, false, false, false]);
      }
    } catch (error) {
      console.error('Error fetching Q&A data:', error);
    } finally {
      setQaLoading(false);
    }
  };

  return { getQAList };
};
