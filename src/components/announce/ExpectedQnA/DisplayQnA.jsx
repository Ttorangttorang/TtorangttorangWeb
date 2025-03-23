import Image from 'next/image';
import * as LocalImages from '@/utils/imageImports';
import { ANNOUNCE_TXT } from '@/utils/constants';
import { cls } from '@/utils/config';
import { useIsMobileStore } from '@/store/store';

const ARROW_SIZE = 24;

function ArrowIcon() {
  return (
    <Image
      src={LocalImages.ImageIconArrow}
      alt="ImageIconArrow"
      width={ARROW_SIZE}
      height={ARROW_SIZE}
    />
  );
}

function QuestionArea({ announcePage, question, isActive }) {
  const { isMobileDevice } = useIsMobileStore();
  // 조건별 css
  const questionPcClass = cls('question_area', announcePage ? 'min-h-[12.8vmin]' : 'min-h-[13.7vmin]');
  const questionMobileClass = cls('question_area');
  const fontClass = cls('question', isActive ? 'font-bold' : 'font-medium');
  const arrowClass = cls('list_arrow', isActive ? 'scale-y-[-1]' : 'scale-y-[1]');

  return (
    <div className={isMobileDevice ? questionMobileClass : questionPcClass}>
      <p>{ANNOUNCE_TXT.scriptFinal.question}</p>
      <p className={fontClass}>{question}</p>
      <div className={arrowClass}>
        <ArrowIcon />
      </div>
    </div>
  );
}

function AnswerArea({ answer, isActive }) {
  const answerAreaClass = cls('answer_area', isActive ? 'on' : '');

  return (
    <div className={answerAreaClass}>
      <p>{ANNOUNCE_TXT.scriptFinal.answer}</p>
      <p className="answer">{answer}</p>
      <div className="list_arrow">
        <ArrowIcon />
      </div>
    </div>
  );
}

export default function DisplayQnA(props) {
  const { announcePage, item, index, askListState } = props;
  const isActive = askListState[index];

  return (
    <>
      <QuestionArea
        announcePage={announcePage}
        question={item.question}
        isActive={isActive}
      />
      <AnswerArea
        answer={item.answer}
        isActive={isActive}
      />
    </>
  );
}
