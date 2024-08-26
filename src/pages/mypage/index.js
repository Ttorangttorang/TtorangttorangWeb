import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import * as LocalImages from '@/utils/imageImports';
import { useQuery } from '@tanstack/react-query';
import Slider from 'react-slick';
import * as stores from '@/store/store';
import * as configs from '@/utils/config';
import * as apis from '@/api/fetchData';
import { MYPAGE_TXT } from '@/utils/constants';
import Modal from '@/components/layout/Modal';

export default function Mypage() {
  const router = useRouter();
  const [deleteAnnounce, setDeleteAnnounce] = useState({ show: false, id: '' });
  const [withdrawal, setWithdrawal] = useState(false);
  const [addListLength, setAddListLength] = useState(0);
  const { userEmail, accessToken, userAccessToken, clearUser } = stores.useUserStore();
  const { setNextMoveBtn } = stores.useNextMoveBtnStore();
  const { clearSettings } = stores.useSettingStore();
  const { clearFinal } = stores.useFinalScriptStore();

  // 초기화
  useEffect(() => {
    clearSettings();
    clearFinal();
    setNextMoveBtn(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 내 발표문 data 가져오기
  const {
    data: myScripts,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['myScriptsData'],
    queryFn: () => apis.getUserScript(userAccessToken),
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (myScripts) {
      const myScriptDataLength = myScripts?.data.data.length;
      const remainder = myScriptDataLength % 5;
      const itemsNeeded = remainder === 0 ? 0 : 5 - remainder;

      setAddListLength(itemsNeeded);
    }
  }, [myScripts]);

  // 내 발표문 삭제
  const deleteMyScript = async (id) => {
    try {
      await apis.deleteUserScript(userAccessToken, id);
      refetch();
    } catch (error) {
      console.error('Failed:', error);
    }
  };

  // 슬라이드
  const Arrow = ({ className, style, onClick, direction }) => {
    const arrowStyle = {
      ...style,
      display: 'block',
      cursor: 'pointer',
      zIndex: 50,
    };

    return (
      <div
        className={className}
        style={arrowStyle}
        onClick={onClick}
      >
        <Image
          src={LocalImages.ImageMainStepArrowActive}
          alt="Arrow"
          width={80}
          height={80}
          className={direction === 'prev' ? '-scale-x-100' : ''}
        />
      </div>
    );
  };

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 5,
    nextArrow: <Arrow direction="next" />,
    prevArrow: <Arrow direction="prev" />,
    draggable: false,
    swipe: false,
    appendDots: (dots) => (
      <div>
        <ul> {dots} </ul>
      </div>
    ),
    dotsClass: 'dots_custom',
  };

  // 빈 발표문
  const emptyAnnounce = () => (
    <>
      <div className="announce_title">
        <p>{MYPAGE_TXT.myAnnounce.emptyTitle}</p>
      </div>
      <Link
        href={`/announce`}
        className="announce_content flex_center"
      >
        <div className="plusBtn_area">
          <div className="plusBtn">
            <Image
              src={LocalImages.ImageAddPlus}
              alt="ImageAddPlus"
              width={64}
              height={64}
            />
          </div>
        </div>
      </Link>
    </>
  );

  // 카카오 로그아웃
  const kakaoLogOut = async () => {
    try {
      const res = await apis.fetchKakaoLogOut(accessToken);
      if (res) {
        router.push('/');
        clearUser();
      }
    } catch (e) {
      // 이미 만료된 토큰일 경우
      if (e.response && e.response.status === 401) {
        clearUser();
        router.push('/');
      } else {
        console.error('Error LogOut:', e);
      }
    }
  };

  // 또랑또랑 서비스 탈퇴
  const ttorangWithdrawal = async () => {
    try {
      const res = await apis.fetchTtorangWithdrawal(userAccessToken);
      if (res) {
        // 탈퇴가 성공한 경우 로그아웃 시도
        try {
          await apis.fetchKakaoLogOut(accessToken);
        } catch (logOutError) {
          console.error('Error LogOut:', logOutError);
        }

        // 로그아웃 성공 여부와 상관없이 사용자 데이터 초기화 및 리디렉션
        clearUser();
        router.push('/');
      }
    } catch (e) {
      // 이미 만료된 토큰일 경우
      if (e.response && e.response.status === 401) {
        clearUser();
        router.push('/');
      } else {
        console.error('Error Withdrawal:', e);
      }
    }
  };

  // 기타
  const linkKeys = ['notice', 'privacyPolicy', 'termsOfUse'];

  return (
    <>
      <section className="mypage_container">
        <div className="content_area">
          <div className="userInfo_area">
            <p className="mypage_title">{MYPAGE_TXT.title.myInfo}</p>
            <div>
              <div className="user">
                <div className="userIcon">
                  <Image
                    src={LocalImages.ImageMypageUserIcon}
                    alt="ImageMypageUserIcon"
                    width={72}
                    height={72}
                  />
                </div>
                <p>{userEmail}</p>
              </div>
              <button
                type="button"
                onClick={kakaoLogOut}
              >
                {MYPAGE_TXT.myInfo.logout}
              </button>
            </div>
          </div>
          <div className="myAnnounce_area">
            <p className="mypage_title">{MYPAGE_TXT.title.myAnnounce}</p>
            <div className="myAnnounce_slide">
              <Slider {...settings}>
                {configs.reverseData(
                  myScripts?.data.data.map((item, index) => (
                    <div
                      className="myAnnounce"
                      key={item.id}
                    >
                      <div className="announce_title">
                        <p>{configs.sliceMyScriptTitle(item.topic)}</p>
                        <div
                          onClick={() => setDeleteAnnounce({ show: true, id: item.id })}
                          className="delteBtn"
                        >
                          <Image
                            src={LocalImages.ImageDeleteX}
                            alt="ImageDeleteX"
                            width={14}
                            height={14}
                          />
                        </div>
                      </div>
                      <Link
                        href={`/mypage/announce/${item.id}`}
                        className="announce_content flex_xBetween"
                      >
                        <p>{sliceMyScript(item.content)}</p>
                        <p className="date">{configs.sliceMyScriptDateOnly(item.regTime)}</p>
                      </Link>
                    </div>
                  )),
                )}
                {Array.from({ length: addListLength }, (_, index) => (
                  <div
                    className="myAnnounce"
                    key={index}
                  >
                    {emptyAnnounce()}
                  </div>
                ))}
                {myScripts?.data.data.length === 0 &&
                  new Array(5).fill(null).map((_, index) => (
                    <div
                      className="myAnnounce"
                      key={index}
                    >
                      {emptyAnnounce()}
                    </div>
                  ))}
              </Slider>
            </div>
          </div>
          <div className="other_area">
            <p className="mypage_title">{MYPAGE_TXT.title.other}</p>
            <ul>
              {linkKeys.map((key) => {
                const item = MYPAGE_TXT.other[key];
                return (
                  <li key={key}>
                    <Link
                      target="_blank"
                      href={item.link}
                    >
                      {item.title}
                    </Link>
                  </li>
                );
              })}
              <li>
                <button
                  type="button"
                  onClick={() => setWithdrawal(true)}
                >
                  {MYPAGE_TXT.other.withdrawal.title}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </section>
      {/* 삭제 모달 */}
      {deleteAnnounce.show && (
        <Modal
          type="delete"
          onClose={() => setDeleteAnnounce({ show: false, id: '' })}
          onConfirm={() => {
            deleteMyScript(deleteAnnounce.id);
            setDeleteAnnounce({ show: false, id: '' });
          }}
        />
      )}
      {/* 탈퇴 모달 */}
      {withdrawal && (
        <Modal
          type="withdrawal"
          onClose={() => setWithdrawal(false)}
          onConfirm={ttorangWithdrawal}
        />
      )}
    </>
  );
}
