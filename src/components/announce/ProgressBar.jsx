import { useCurrentSlideMobileStore, useCurrentSlideStore, useIsMobileStore } from '@/store/store';
import { cls } from '@/utils/config';
import { ANNOUNCE_TXT } from '@/utils/constants';

const PROGRESS_BAR_WIDTH = {
  default: 'w-1/2',
  active: 'w-[79%]',
};

const PROGRESS_BAR_WIDTH_MOBILE = {
  stepOne: 'w-[21%]',
  stepTwo: 'w-[51%]',
  stepThree: 'w-[71%]',
  stepFour: 'w-[100%]',
};

const STEP_INFO = [
  { id: 0, title: ANNOUNCE_TXT.progressBar.first },
  { id: 1, title: ANNOUNCE_TXT.progressBar.second },
];

const STEP_INFO_MOBILE = [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }];

export default function ProgressBar() {
  const { isMobileDevice } = useIsMobileStore();
  const { currentMobileSlide, setCurrentMobileSlide } = useCurrentSlideMobileStore();
  const { currentSlide } = useCurrentSlideStore();

  //pc
  const progressBarClass = currentSlide === 1 ? PROGRESS_BAR_WIDTH.active : PROGRESS_BAR_WIDTH.default;
  //mobile
  let mobileProgressBarClass;
  if (currentMobileSlide === 0) {
    mobileProgressBarClass = PROGRESS_BAR_WIDTH_MOBILE.stepOne;
  } else if (currentMobileSlide === 1) {
    mobileProgressBarClass = PROGRESS_BAR_WIDTH_MOBILE.stepTwo;
  } else if (currentMobileSlide === 2) {
    mobileProgressBarClass = PROGRESS_BAR_WIDTH_MOBILE.stepThree;
  } else if (currentMobileSlide === 3) {
    mobileProgressBarClass = PROGRESS_BAR_WIDTH_MOBILE.stepFour;
  }
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
