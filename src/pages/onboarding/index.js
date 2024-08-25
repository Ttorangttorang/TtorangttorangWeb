import Link from 'next/link';
import * as LocalImages from '@/utils/imageImports';
import Image from 'next/image';
import Slider from 'react-slick';
import { cls } from '@/utils/config';

const onboardingContent = [
  {
    title: 'AI를 통한 맞춤형 발표 교정',
    img: LocalImages.ImageGateway_setting,
    width: 258,
    height: 282,
    imgClass: 'setting_img',
    mentOne: '발표 주제, 목적, 종결 어미를 입력해',
    mentTwo: '맞춤형 발표문을 교정해요',
  },
  {
    title: '발표 대본 피드백 및 수정',
    img: LocalImages.ImageGateway_modify,
    width: 311,
    height: 185,
    imgClass: 'modify_img',
    mentOne: '작성한 발표문을 분석하여',
    mentTwo: '명확성, 표현성, 논리성을 기준으로 평가하고 교정해요',
  },
  {
    title: '예상 질문 및 답변 제공',
    img: LocalImages.ImageGateway_qna_q,
    width: 317,
    height: 152,
    imgClass: 'qna_q_img',
    imgTwo: LocalImages.ImageGateway_qna_a,
    mentOne: '발표문을 기반으로 예상되는 질문을 분석하고',
    mentTwo: '모범 답변을 제안하여 발표에 대한 자신감을 높이도록 도와줘요',
  },
];

export default function Onboarding() {
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    appendDots: (dots) => (
      <div>
        <ul> {dots} </ul>
      </div>
    ),
    dotsClass: 'dots_custom',
  };

  return (
    <section className="onboarding_container">
      <Slider {...settings}>
        {onboardingContent.map((item, index) => (
          <div
            key={index}
            className="board_area"
          >
            <span>{item.title}</span>
            <div className={cls('img_area', item.imgClass)}>
              <Image
                src={item.img}
                alt={'ImageGateway'}
                width={item.width}
                height={item.height}
                quality={100}
              />
            </div>
            <p className="ment">
              {item.mentOne}
              <br />
              {item.mentTwo}
            </p>
          </div>
        ))}
      </Slider>
      <Link
        href={'/announce'}
        className="gotoAnnounce"
      >
        완벽한 발표 준비 시작하기
      </Link>
    </section>
  );
}
