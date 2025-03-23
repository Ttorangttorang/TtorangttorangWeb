import { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import ShapeBg from './ShapeBg';
import Header from './Header';
import Footer from './Footer';
import { usePathname } from 'next/navigation';
import { useIsMobileStore } from '@/store/store';
import HeaderMobile from './HeaderMobile';

export default function Layout({ children }) {
  const pathname = usePathname();
  const [noneHome, setNoneHome] = useState(false);
  const { isMobileDevice, setIsMobileDevice } = useIsMobileStore();

  useEffect(() => {
    if (pathname === '/') {
      setNoneHome(false);
    } else {
      setNoneHome(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const disableScroll = () => {
    document.querySelector('body').addEventListener('touchmove', removeEvent, { passive: false });
    document.querySelector('body').addEventListener('mousewheel', removeEvent, { passive: false });
  };

  const enableScroll = () => {
    document.querySelector('body').removeEventListener('touchmove', removeEvent);
    document.querySelector('body').removeEventListener('mousewheel', removeEvent);
  };

  const removeEvent = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  useEffect(() => {
    setIsMobileDevice(isMobile);

    if (isMobileDevice) {
      disableScroll();
    }

    // Cleanup to re-enable scroll on component unmount
    return () => {
      if (isMobileDevice) {
        enableScroll();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobileDevice]);

  return (
    <>
      {isMobileDevice ? (
        <>
          {noneHome && <HeaderMobile />}
          <div className="shapeBg_container">
            <ShapeBg />
          </div>
          <section className="mobile_layout">{children}</section>
        </>
      ) : (
        <>
          <Header />
          <section className="root_layout">
            <div className="shapeBg_container">
              <ShapeBg />
            </div>
            {children}
          </section>
          <Footer />
        </>
      )}
    </>
  );
}
