import { useState } from 'react';
import DetailSetting from './Draft/DetailSetting';
import GuideMent from './GuideMent';
import { ANNOUNCE_TXT } from '@/utils/constants';
import { cls } from '@/utils/config';
import { useCurrentSlideMobileStore, useSettingStore } from '@/store/store';

export default function MobileSetting({ sliderMobileRef }) {
  const { setCurrentMobileSlide } = useCurrentSlideMobileStore();
  const { subject } = useSettingStore();

  return (
    <>
      <div className="setting_area">
        <GuideMent
          firstMent={ANNOUNCE_TXT.GuideTxt.oneStep.right.firstMent}
          secondMent={ANNOUNCE_TXT.GuideTxt.oneStep.right.secondMent}
        />
        <DetailSetting />
      </div>
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
    </>
  );
}
