import Link from "next/link";
import { api } from "@/lib/api";

export async function SidebarFirst() {
  let categories: Awaited<ReturnType<typeof api.categories>> = [];
  try {
    categories = await api.categories();
  } catch {
    categories = [];
  }

  return (
    <aside id="sidebar-first" className="column sidebar">
      <div className="section">
        <div className="region region-sidebar-first">
          <div id="block-block-11" className="block block-block clearfix">
            <h2>Контакти</h2>
            <div className="content">
              <p>
                Телефон: <strong>+38(099) 3862655</strong>
                <br />
                E-mail:
                <br />
                <a href="mailto:magakadem7@gmail.com">magakadem7@gmail.com</a>
                <br />
                <strong>
                  <Link href="/checkout">Форма замовлення</Link>
                </strong>
              </p>
            </div>
          </div>

          <div
            id="block-menu-menu-subject-menu"
            className="block block-menu clearfix"
          >
            <h2>Тематичний каталог</h2>
            <div className="content">
              <ul className="menu">
                {categories.length === 0 && (
                  <li className="ab-muted">Каталог порожній</li>
                )}
                {categories.map((c) => (
                  <li key={c.id} className="leaf">
                    <Link href={`/c/${c.slug}`} title={c.nameUa}>
                      {c.nameUa}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
