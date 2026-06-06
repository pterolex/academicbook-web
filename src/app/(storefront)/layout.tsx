import { Header } from "@/components/Header";
import { TopNav } from "@/components/TopNav";
import { SidebarFirst } from "@/components/SidebarFirst";
import { SidebarSecond } from "@/components/SidebarSecond";
import { Footer } from "@/components/Footer";

export const dynamic = "force-dynamic";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="two-sidebars ab-root">
      <div id="page-wrapper">
        <div id="page">
          <Header />
          <TopNav />
          <div className="ab-spacer" />
          <div id="main-wrapper">
            <div id="main" className="ab-main">
              <SidebarFirst />
              <section id="content" className="column">
                <div className="section">{children}</div>
              </section>
              <SidebarSecond />
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
}
