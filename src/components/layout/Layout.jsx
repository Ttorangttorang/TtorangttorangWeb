import { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import ShapeBg from './ShapeBg';
import Header from './Header';
import Footer from './Footer';
import MoblieNoneService from './MoblieNoneService';
import { useIsMobileStore } from '@/store/store';

export default function Layout({ children }) {
  const { isMobileDevice, setIsMobileDevice } = useIsMobileStore();

  useEffect(() => {
    setIsMobileDevice(isMobile);
  }, []);

  return (
    <>
      {isMobileDevice ? (
        <>
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
