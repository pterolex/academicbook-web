import Image from "next/image";
import Link from "next/link";
import { SearchBox } from "@/components/SearchBox";

export function Header() {
  return (
    <div id="header" className="ab-header">
      <div className="ab-section ab-header-row">
        <div id="logo">
          <Link href="/" title="Головна" rel="home">
            <Image
              src="/logo.gif"
              alt="Головна"
              width={931}
              height={193}
              priority
              unoptimized
            />
          </Link>
        </div>
        <SearchBox />
      </div>
    </div>
  );
}
