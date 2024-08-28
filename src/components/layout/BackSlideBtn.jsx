import { useCurrentSlideMobileStore } from '@/store/store';
import { IoIosArrowBack } from 'react-icons/io';

export default function BackSlideBtn({ backSlideNum, sliderMobileRef }) {
  const { setCurrentMobileSlide } = useCurrentSlideMobileStore();
  return (
    <div
      className="active_color small_btn back_slide"
      onClick={() => {
        setCurrentMobileSlide(backSlideNum);
        sliderMobileRef.current.slickGoTo(backSlideNum);
      }}
    >
      <IoIosArrowBack fontSize={20} />
    </div>
  );
}
