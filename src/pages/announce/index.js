import Image from 'next/image';
import * as LocalImages from '@/utils/imageImports';
import Slider from 'react-slick';
import ModifyAnnounce from '@/components/announce/ModifyAnnounce';
import SaveAnnounce from '@/components/announce/SaveAnnounce';
import ProgressBar from '@/components/announce/ProgressBar';
import { useNextMoveBtnStore, useScriptLoadingStore, useQaLoadingStore, useUserStore, useCurrentSlideStore, useIsMobileStore, useSettingStore, useCurrentSlideMobileStore } from '@/store/store';
import Modal from '@/components/layout/Modal';
import Setting from '@/components/announce/Setting';
import { cls } from '@/utils/config';
import { useRef } from 'react';

export default function Announce() {
  const { isMobileDevice } = useIsMobileStore();
  const { userEmail, userAccessToken } = useUserStore();
  const { nextMoveBtn } = useNextMoveBtnStore();
  const { qaLoading } = useQaLoadingStore();
  const { scriptLoading } = useScriptLoadingStore();
  const { currentSlide, setCurrentSlide } = useCurrentSlideStore();
  const { currentMobileSlide, setCurrentMobileSlide } = useCurrentSlideMobileStore();
  const { subject } = useSettingStore();

  function NextArrow(props) {
    const { className, style, onClick } = props;

    const dynamicStyle = {
      ...style,
      display: 'block',
      cursor: nextMoveBtn ? 'pointer' : 'default',
      zIndex: 50,
      pointerEvents: nextMoveBtn ? 'auto' : 'none',
    };

    return (
      <div
        className={className}
        style={dynamicStyle}
        onClick={onClick}
      >
        {nextMoveBtn ? (
          <Image
            src={LocalImages.ImageMainStepArrowActive}
            alt="ImageMainStepArrowActive"
            width={80}
            height={80}
          />
        ) : (
          <Image
            src={LocalImages.ImageMainStepArrowRight}
            alt="ImageMainStepArrowRight"
            width={80}
            height={80}
          />
        )}
      </div>
    );
  }

  function PrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: 'block', cursor: 'pointer', zIndex: 50 }}
        onClick={onClick}
      >
        <Image
          src={LocalImages.ImageMainStepArrowActive}
          alt="ImageMainStepArrowActive"
          width={80}
          height={80}
          className="-scale-x-100"
        />
      </div>
    );
  }

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    draggable: false,
    swipe: false,
    beforeChange: (current, next) => {
      if (!nextMoveBtn) {
        return false; // nextMoveBtn이 false일 경우 슬라이드 변경을 막음
      }
      setCurrentSlide(next);
    },
  };

  const sliderMobileRef = useRef(null);
  const settingsMobile = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    draggable: false,
    swipe: false,
    beforeChange: (current, next) => {
      setCurrentMobileSlide(next);
    },
  };

  return (
    <>
      {isMobileDevice ? (
        <div className="slider-container announce_mobile">
          <ProgressBar />
          <form>
            <Slider
              ref={sliderMobileRef}
              {...settingsMobile}
            >
              <div className="step_area">
                <Setting />
                <div
                  onClick={() => {
                    setCurrentMobileSlide(1);
                    sliderMobileRef.current.slickGoTo(1);
                  }}
                  className={cls('next_step', subject.length > 0 ? 'active_color' : 'disabled_color')}
                >
                  발표문 초안 작성하기
                </div>
              </div>
              <div className="step_area"></div>
              <div className="step_area"></div>
              <div className="step_area"></div>
            </Slider>
          </form>
        </div>
      ) : (
        <>
          <div className="slider-container">
            <ProgressBar />
            <Slider {...settings}>
              <ModifyAnnounce userEmail={userEmail} />
              <SaveAnnounce
                userEmail={userEmail}
                userAccessToken={userAccessToken}
              />
            </Slider>
          </div>
          {/* loading */}
          {scriptLoading && <Modal type="announceLoading" />}
          {qaLoading && <Modal type="qaLoading" />}
        </>
      )}
    </>
  );
}
