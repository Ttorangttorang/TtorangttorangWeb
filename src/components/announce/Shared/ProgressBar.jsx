import { useCurrentSlideMobileStore, useCurrentSlideStore, useIsMobileStore } from '@/store/store';
import { cls } from '@/utils/config';
import { ANNOUNCE_TXT } from '@/utils/constants';

const PROGRESS_BAR_WIDTH = {
  default: 'w-1/2',
  active: 'w-[79%]',
};

const PROGRESS_BAR_WIDTH_MOBILE = {
  stepOne: 'w-[24%]',
  stepTwo: 'w-[48%]',
  stepThree: 'w-[73%]',
  stepFour: 'w-[100%]',
};

const STEP_INFO = [
  { id: 0, title: ANNOUNCE_TXT.progressBar.first },
  { id: 1, title: ANNOUNCE_TXT.progressBar.second },
];

const STEP_INFO_MOBILE = [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }];

const stepMobileMap = {
  0: PROGRESS_BAR_WIDTH_MOBILE.stepOne,
  1: PROGRESS_BAR_WIDTH_MOBILE.stepTwo,
  2: PROGRESS_BAR_WIDTH_MOBILE.stepThree,
  3: PROGRESS_BAR_WIDTH_MOBILE.stepFour,
};

export default function ProgressBar() {
  const { isMobileDevice } = useIsMobileStore();
  const { currentMobileSlide } = useCurrentSlideMobileStore();
  const { currentSlide } = useCurrentSlideStore();

  //pc
  const progressBarClass = currentSlide === 1 ? PROGRESS_BAR_WIDTH.active : PROGRESS_BAR_WIDTH.default;
  //mobile
  const mobileProgressBarClass = stepMobileMap[currentMobileSlide] || '';
  const activeBar = isMobileDevice ? mobileProgressBarClass : progressBarClass;

  return (
    <div className="progress_container">
      <div className="progress_barLine"></div>
      <div className={cls('progress_barLine_active', activeBar)} />
      <div className="page_infoList">
        {isMobileDevice
          ? STEP_INFO_MOBILE.map((step, index) => (
              <div
                key={step.id}
                className={cls('step' + step.id, currentMobileSlide === step.id ? 'on' : '')}
              >
                <p className={cls('step_dot', currentMobileSlide === step.id + 1 || index < currentMobileSlide ? '!main_colorBg' : 'bg-[#EDEDED]')}></p>
              </div>
            ))
          : STEP_INFO.map((step) => (
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
