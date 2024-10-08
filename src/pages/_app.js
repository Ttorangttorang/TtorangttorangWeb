import '@/styles/globals.css';
import '@/styles/main.css';
import '@/styles/gateway.css';
import '@/styles/saveqa.css';
import '@/styles/mypage.css';
import '@/styles/fonts/notoSansKR.css';
import '@/styles/fonts/tmoneyRoundWind.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Seo from '@/components/layout/Seo';
import Layout from '@/components/layout/Layout';

const queryClient = new QueryClient();

export default function App({ Component, pageProps }) {
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
