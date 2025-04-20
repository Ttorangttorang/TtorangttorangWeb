import { cls } from '@/utils/config';

export default function GuideMent(props) {
  const { firstMent, secondMent, saveMentStyle } = props;
  return (
    <div className={cls('ment_box', saveMentStyle ? saveMentStyle : '')}>
      <p>{firstMent}</p>
      <p>{secondMent}</p>
    </div>
  );
}
