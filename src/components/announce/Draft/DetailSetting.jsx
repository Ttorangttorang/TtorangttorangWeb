import Image from 'next/image';
import * as LocalImages from '@/utils/imageImports';
import { useSettingStore, useSubjectCharCountStore } from '@/store/store';
import { cls } from '@/utils/config';
import { ANNOUNCE_TXT, GLOBAL_TXT } from '@/utils/constants';

export default function DetailSetting() {
  const { subjectCharCount, setSubjectCharCount } = useSubjectCharCountStore();
  const MAX_SUBJECT_LENGTH = 100;
  const { subject, setSubject, presentPurpose, setPresentPurpose, endingTxt, setEndingTxt, repeat, setRepeat } = useSettingStore();

  // 주제 작성
  const writeSubject = (event) => {
    const MAX_LENGTH = 100;
    let draft = event.target.value;

    if (draft.length > MAX_LENGTH) {
      draft = event.target.value.slice(0, MAX_LENGTH);
    }

    setSubject(draft);
    setSubjectCharCount(draft.length);
  };

  // 발표 목적
  const selectPurpose = (purpose) => {
    setPresentPurpose(purpose);
  };

  // 종결 어미
  const selectEndingTxt = (txt) => {
    setEndingTxt(txt);
  };

  const detailSettingTxt = ANNOUNCE_TXT.detailSetting;

  return (
    <div className="detailSetting">
      <div>
        <p className="title">
          {detailSettingTxt.subject.id}
          <span className="required">{GLOBAL_TXT.required}</span>
          {detailSettingTxt.subject.title}
        </p>
        <div className="subject_box">
          <textarea
            placeholder={detailSettingTxt.inputDescription}
            maxLength={MAX_SUBJECT_LENGTH}
            value={subject}
            onChange={writeSubject}
          />
          <span className="subject_charCount">
            {subjectCharCount} / {MAX_SUBJECT_LENGTH}
          </span>
        </div>
      </div>
      <div>
        <p className="title">
          {detailSettingTxt.purpose.id} <span className="required">{GLOBAL_TXT.required}</span> {detailSettingTxt.purpose.title}
        </p>
        <div className="purposeCheck">
          {detailSettingTxt.purpose.list.map((item, index) => (
            <p
              key={index}
              onClick={() => selectPurpose(item)}
              className={cls(presentPurpose === item ? 'active_color' : 'disabled_color')}
            >
              {item}
            </p>
          ))}
        </div>
      </div>
      <div>
        <p className="title">
          {detailSettingTxt.endingTxt.id} <span className="required">{GLOBAL_TXT.required}</span>
          {detailSettingTxt.endingTxt.title}
        </p>
        <div className="endingTxtCheck">
          {detailSettingTxt.endingTxt.list.map((item, index) => (
            <p
              key={index}
              onClick={() => selectEndingTxt(item)}
              className={cls(endingTxt === item ? 'active_color' : 'disabled_color')}
            >
              - {item}
            </p>
          ))}
        </div>
      </div>
      <div className="repeat_box">
        <div onClick={() => setRepeat(!repeat)}>
          <div className={cls('checkbox', repeat ? 'active_color' : 'disabled_color')}>
            {repeat && (
              <Image
                src={LocalImages.ImageIconCheckboxArrow}
                alt="ImageIconCheckboxArrow"
                width={11}
                height={10}
              />
            )}
          </div>
          <p>{detailSettingTxt.repeat.title}</p>
        </div>
      </div>
    </div>
  );
}
