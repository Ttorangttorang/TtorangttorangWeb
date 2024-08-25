import { useEffect, useRef, useState } from 'react';
import * as LocalImages from '@/utils/imageImports';
import Image from 'next/image';
import Link from 'next/link';
import { useLoginModalStore, useUserStore, useNextMoveBtnStore, useSettingStore, useFinalScriptStore, useIsMobileStore } from '@/store/store';

const guideContent = [
  {
    img: LocalImages.ImageGateway_one,
    imgAlt: 'ImageGateway_one',
    width: 1279,
    height: 625,
  },
  {
    img: LocalImages.ImageGateway_two,
    imgAlt: 'ImageGateway_two',
    width: 1323,
    height: 567,
  },
  {
    img: LocalImages.ImageGateway_three,
    imgTwo: LocalImages.ImageGateway_qna_a,
    imgAlt: 'ImageGateway_three',
    width: 1277,
    height: 362,
    widthTwo: 720,
    heightTwo: 147,
  },
];

export default function Home() {
  const { isMobileDevice } = useIsMobileStore();
  const { userEmail } = useUserStore();
  const { setLogin } = useLoginModalStore();
  const outerDivRef = useRef();
  const maxPage = 4;
  const [currentPage, setCurrentPage] = useState(1);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollTimeout, setScrollTimeout] = useState(null);
  const { setNextMoveBtn } = useNextMoveBtnStore();
  const { clearSettings } = useSettingStore();
  const { clearFinal } = useFinalScriptStore();

  // 초기화
  useEffect(() => {
    clearSettings();
    clearFinal();
    setNextMoveBtn(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // fullpage 스크롤
  useEffect(() => {
    const scrollToPage = (page) => {
      const outerDiv = outerDivRef.current;
      if (!outerDiv) return;

      const pageHeight = outerDiv.clientHeight;

      outerDiv.scrollTo({
        top: (page - 1) * pageHeight,
        left: 0,
        behavior: 'smooth',
      });
    };

    scrollToPage(currentPage);
  }, [currentPage]);

  useEffect(() => {
    const wheelHandler = (e) => {
      e.preventDefault();
      if (isScrolling) return; // 이미 스크롤 중이면 무시

      const { deltaY } = e;
      const outerDiv = outerDivRef.current;

      if (!outerDiv) return;

      const { clientHeight, scrollHeight } = outerDiv;
      const pageHeight = clientHeight;
      let nextPage = currentPage;

      if (deltaY > 0) {
        // 스크롤 내릴 때
        nextPage = currentPage + 1;
      } else {
        // 스크롤 올릴 때
        nextPage = currentPage - 1;
      }

      // 페이지 범위 내로 조정
      if (nextPage < 1) nextPage = 1;
      if (nextPage > maxPage) nextPage = maxPage;

      if (nextPage !== currentPage) {
        // 스크롤이 이미 진행 중이면 다음 스크롤을 무시
        setIsScrolling(true);

        // 이전 스크롤 타임아웃을 클리어
        if (scrollTimeout) {
          clearTimeout(scrollTimeout);
        }

        // 스크롤 애니메이션 시작
        outerDiv.scrollTo({
          top: (nextPage - 1) * pageHeight,
          left: 0,
          behavior: 'smooth',
        });

        // 스크롤이 완료될 때까지 기다린 후 상태 업데이트
        const timeout = setTimeout(() => {
          setCurrentPage(nextPage);
          setIsScrolling(false);
        }, 600); // 스크롤 속도에 따라 조정

        setScrollTimeout(timeout);
      }
    };

    const outerDivCurrent = outerDivRef.current;

    if (outerDivCurrent) {
      outerDivCurrent.addEventListener('wheel', wheelHandler);
    }

    return () => {
      if (outerDivCurrent) {
        outerDivCurrent.removeEventListener('wheel', wheelHandler);
      }
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, [currentPage, isScrolling, scrollTimeout]);

  return (
    <>
      {isMobileDevice ? (
        <section className="login_onboarding">
          <div className="total_area">
            <div className="top">
              <p>아무리 해도 익숙해지지 않는 발표!</p>
              <p>
                AI 발표 도우미 또랑또랑과 함께
                <br />
                쉽고 빠르게 발표를 준비해요
              </p>
            </div>
            <div className="center">
              <div className="logo_area">
                <Image
                  src={LocalImages.ImageMobileLogo}
                  alt="ImageMobileLogo"
                  width={196}
                  height={72}
                />
              </div>
              <div className="character_area">
                <Image
                  src={LocalImages.ImageTtorangHi}
                  alt="ImageTtorangHi"
                  width={208}
                  height={204}
                />
              </div>
            </div>
            <div className="bottom">
              <p>로그인 시 작성한 발표문을 저장할 수 있어요!</p>
              <div className="kakoLogin">
                <div className="kakoLogo">
                  <Image
                    src={LocalImages.ImageKakoLogo}
                    alt="ImageKakoLogo"
                    width={21}
                    height={21}
                  />
                </div>
                <span>카카오로 시작하기</span>
              </div>
              <Link href={'/announce'}>로그인없이 체험할게요</Link>
            </div>
          </div>
        </section>
      ) : (
        <main
          ref={outerDivRef}
          className="gateway_container outer"
        >
          <div className="inner">
            <div className="gate_main">
              <div>
                <div className="gatewayMent_area">
                  <p>아무리 해도 어려운 발표!</p>
                  <h2>
                    AI 발표 도우미
                    <br />
                    또랑또랑과 함께 준비해요
                  </h2>
                  <p>
                    단 10초, 발표에 대한 정보를 입력하면
                    <br /> 단 한 번의 클릭으로 쉽고 빠르게 준비할 수 있어요
                  </p>
                  {userEmail ? (
                    <Link
                      href={'/announce'}
                      className="start_btn"
                    >
                      시작하기
                    </Link>
                  ) : (
                    <div
                      onClick={() => setLogin(true)}
                      className="start_btn"
                    >
                      시작하기
                    </div>
                  )}
                </div>
                <div className="moveToGuide_area">
                  <div
                    onClick={() => setCurrentPage(2)}
                    className="guideArrow"
                  >
                    <div className="activeArrow_area">
                      <Image
                        src={LocalImages.ImageActiveArrow}
                        alt="ImageActiveArrow"
                        width={39}
                        height={35}
                      />
                    </div>
                  </div>
                  <p>아래에 가이드가 있어요</p>
                </div>
              </div>
              <div className="gate_mainImg">
                <Image
                  src={LocalImages.ImageGatwayMain}
                  alt="ImageGatewayRightBg"
                  width={524}
                  height={714}
                />
              </div>
            </div>
          </div>
          {guideContent.map((item, index) => (
            <div
              key={index}
              className="inner"
            >
              <div>
                <div className="relative">
                  <Image
                    src={item.img}
                    alt={item.imgAlt}
                    width={item.width}
                    height={item.height}
                  />
                  {item.img === LocalImages.ImageGateway_three && (
                    <div className="answerImg_area">
                      <Image
                        src={item.imgTwo}
                        alt={item.imgAlt}
                        width={item.widthTwo}
                        height={item.heightTwo}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div
            onClick={() => setCurrentPage(1)}
            className="moveToTop_area"
          >
            TOP
          </div>
        </main>
      )}
    </>
  );
}
