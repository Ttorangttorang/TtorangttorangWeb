import { useEffect, useState } from 'react';
import DetailSetting from './Draft/DetailSetting';
import GuideMent from './GuideMent';
import { ANNOUNCE_TXT } from '@/utils/constants';

export default function MobileSetting() {
  return (
    <div className="setting_area">
      <GuideMent
        firstMent={ANNOUNCE_TXT.GuideTxt.oneStep.right.firstMent}
        secondMent={ANNOUNCE_TXT.GuideTxt.oneStep.right.secondMent}
      />
      <DetailSetting />
    </div>
  );
}
