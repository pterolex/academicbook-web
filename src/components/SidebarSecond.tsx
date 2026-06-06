import { SidebarCart } from "./SidebarCart";
import { SidebarAuth } from "./SidebarAuth";

export function SidebarSecond() {
  return (
    <aside id="sidebar-second" className="column sidebar">
      <div className="section">
        <div className="region region-sidebar-second">
          <SidebarCart />
          <SidebarAuth />

          <div id="block-block-13" className="block block-block clearfix">
            <div className="content">
              <p>
                <span className="promo-title">МАТЕМАТИКА</span>
              </p>
              <p className="promo-sub">
                підготовка до тестування;
                <br />
                математика для студентів всіх
                <br />
                спеціальностей, в т. ч. мехмату
              </p>
              <p style={{ fontWeight: 700 }}>
                067-1363735
                <br />
                <a href="mailto:acbookkiev@gmail.com">acbookkiev@gmail.com</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
