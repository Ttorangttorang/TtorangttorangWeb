import Image from 'next/image';
import * as LocalImages from '@/utils/imageImports';
import Slider from 'react-slick';
import ModifyAnnounce from '@/components/announce/ModifyAnnounce';
import SaveAnnounce from '@/components/announce/SaveAnnounce';
import ProgressBar from '@/components/announce/ProgressBar';
import * as stores from '@/store/store';
import Modal from '@/components/layout/Modal';
import { cls } from '@/utils/config';
import { useEffect, useRef } from 'react';
import MobileSetting from '@/components/announce/MobileSetting';
import MobileWrite from '@/components/announce/MobileWrite';

export default function Announce() {
  const { isMobileDevice } = stores.useIsMobileStore();
  const { userEmail, userAccessToken } = stores.useUserStore();
  const { nextMoveBtn } = stores.useNextMoveBtnStore();
  const { qaLoading } = stores.useQaLoadingStore();
  const { scriptLoading } = stores.useScriptLoadingStore();
  const { setCurrentSlide } = stores.useCurrentSlideStore();
  const { setCurrentMobileSlide } = stores.useCurrentSlideMobileStore();
  const { subject } = stores.useSettingStore();

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

  // 진입시 첫번째 슬라이드 시작
  useEffect(() => {
    setCurrentMobileSlide(0);
  }, []);

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
                <MobileSetting />
                <div
                  onClick={() => {
                    if (subject.length > 0) {
                      setCurrentMobileSlide(1);
                      sliderMobileRef.current.slickGoTo(1);
                    }
                  }}
                  className={cls('next_step', subject.length > 0 ? 'active_color' : 'disabled_color')}
                >
                  발표문 초안 작성하기
                </div>
              </div>
              <div className="step_area">
                <MobileWrite sliderMobileRef={sliderMobileRef} />
              </div>
              <div className="step_area">
                <div className="slideMove_btn_area">
                  <div
                    className="active_color small_btn"
                    onClick={() => {
                      setCurrentMobileSlide(1);
                      sliderMobileRef.current.slickGoTo(1);
                    }}
                  >
                    이전
                  </div>
                  <div
                    onClick={() => {
                      if (subject.length > 0) {
                        setCurrentMobileSlide(3);
                        sliderMobileRef.current.slickGoTo(3);
                      }
                    }}
                    className={cls('next_step', subject.length > 0 ? 'active_color' : 'disabled_color')}
                  >
                    예상 질문 받기
                  </div>
                </div>
              </div>
              <div className="step_area">
                <div className="slideMove_btn_area">
                  <div
                    className="active_color small_btn"
                    onClick={() => {
                      setCurrentMobileSlide(2);
                      sliderMobileRef.current.slickGoTo(2);
                    }}
                  >
                    이전
                  </div>
                  <div className={cls('next_step', subject.length > 0 ? 'active_color' : 'disabled_color')}>저장하기</div>
                </div>
              </div>
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
