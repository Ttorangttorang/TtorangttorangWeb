import { cls } from '@/utils/config';
import { ANNOUNCE_TXT } from '@/utils/constants';

const PROGRESS_BAR_WIDTH = {
  default: 'w-1/2',
  active: 'w-[80%]',
};

const STEP_INFO = [
  { id: 0, title: ANNOUNCE_TXT.progressBar.first },
  { id: 1, title: ANNOUNCE_TXT.progressBar.second },
];

export default function ProgressBar({ currentSlide }) {
  const progressBarClass = currentSlide === 1 ? PROGRESS_BAR_WIDTH.active : PROGRESS_BAR_WIDTH.default;

  return (
    <div className="progress_container">
      <div className="progress_barLine"></div>
      <div className={cls('progress_barLine_active', progressBarClass)}></div>
      <div className="page_infoList">
        {STEP_INFO.map((step) => (
          <div
            key={step.id}
            className={cls(currentSlide === step.id ? 'on' : '')}
          >
            <p className={cls(currentSlide === step.id + 1 ? '!main_colorBg' : '')}>
              <span>{step.id + 1}</span>
            </p>
            <p>{step.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
