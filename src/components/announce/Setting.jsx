import { useEffect, useState } from 'react';
import DetailSetting from './Draft/DetailSetting';
import GuideMent from './GuideMent';
import { ANNOUNCE_TXT } from '@/utils/constants';

export default function Setting() {
  // 주제
  const [subjectCharCount, setSubjectCharCount] = useState(0);

  return (
    <div>
      <GuideMent
        firstMent={ANNOUNCE_TXT.GuideTxt.oneStep.right.firstMent}
        secondMent={ANNOUNCE_TXT.GuideTxt.oneStep.right.secondMent}
      />
      <DetailSetting
        subjectCharCount={subjectCharCount}
        setSubjectCharCount={setSubjectCharCount}
      />
    </div>
  );
}
