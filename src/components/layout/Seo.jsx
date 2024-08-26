import Head from 'next/head';

export default function Seo() {
  return (
    <Head>
      <title>또랑또랑</title>
      {/* 모바일 입력시 화면확대 방지 */}
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, maximum-scale=1.0, 
    user-scalable=0"
      />
      <meta
        name="author"
        content="발표명장"
      />
      <meta
        name="description"
        content="또랑또랑 AI 발표 도우미"
      />
      <meta
        property="og:title"
        content="또랑또랑"
      />
      <meta
        property="og:site_name"
        content="또랑또랑"
      />
      <meta
        property="og:description"
        content="AI 발표 도우미 - 단 한 번의 클릭으로 쉽고 빠르게 준비할 수 있어요"
      />
      <meta
        property="og:type"
        content="website"
      />
      <meta
        property="og:url"
        content="https://www.ttorang.site/"
      />
      <meta
        property="og:image"
        content="/images/thumbnail.png"
      />
      <link
        rel="icon"
        href="/images/favicon.ico"
      />
    </Head>
  );
}
