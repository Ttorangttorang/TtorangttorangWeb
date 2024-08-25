import '@/styles/globals.css';
import '@/styles/main.css';
import '@/styles/gateway.css';
import '@/styles/saveqa.css';
import '@/styles/mypage.css';
import '@/styles/mobile.css';
import '@/styles/fonts/notoSansKR.css';
import '@/styles/fonts/tmoneyRoundWind.css';
import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Seo from '@/components/layout/Seo';
import Layout from '@/components/layout/Layout';

const queryClient = new QueryClient();

export default function App({ Component, pageProps }) {
  function setScreenSize() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }
  useEffect(() => {
    setScreenSize();
  });

  return (
    <>
      <Seo />
      <QueryClientProvider client={queryClient}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </QueryClientProvider>
    </>
  );
}
