import { HEADER_TXT } from '@/utils/constants';
import Image from 'next/image';
import * as LocalImages from '@/utils/imageImports';
import Link from 'next/link';

export default function HeaderMobile() {
  return (
    <header className="h_mobile">
      <h1>
        <Link
          href={HEADER_TXT.mainHome.link}
          className="logo_area"
        >
          <Image
            src={LocalImages.ImageTtorangWhiteLogo}
            alt="ImageTtorangWhiteLogo"
            width={98}
            height={33}
          />
        </Link>
      </h1>
    </header>
  );
}
