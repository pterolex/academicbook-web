export const metadata = {
  title: 'Контакти',
};

const MAP_SRC =
  'https://maps.google.com.ua/maps?hl=ru&ie=UTF8&q=%D0%B0%D0%BA%D0%B0%D0%B4%D0%B5%D0%BC%D0%BA%D0%BD%D0%B8%D0%B3%D0%B0&fb=1&gl=ua&hq=%D0%B0%D0%BA%D0%B0%D0%B4%D0%B5%D0%BC%D0%BA%D0%BD%D0%B8%D0%B3%D0%B0&hnear=0x40d4cf4ee15a4505:0x764931d2170146fe,%D0%9A%D0%B8%D0%B5%D0%B2,+%D0%B3%D0%BE%D1%80%D0%BE%D0%B4+%D0%9A%D0%B8%D0%B5%D0%B2&cid=0,0,15112303229787819682&ll=50.454784,30.508179&spn=0.006295,0.006295&t=h&iwloc=A&output=embed';

const MAP_LINK =
  'https://maps.google.com.ua/maps?hl=ru&ie=UTF8&q=%D0%B0%D0%BA%D0%B0%D0%B4%D0%B5%D0%BC%D0%BA%D0%BD%D0%B8%D0%B3%D0%B0&fb=1&gl=ua&hq=%D0%B0%D0%BA%D0%B0%D0%B4%D0%B5%D0%BC%D0%BA%D0%BD%D0%B8%D0%B3%D0%B0&hnear=0x40d4cf4ee15a4505:0x764931d2170146fe,%D0%9A%D0%B8%D0%B5%D0%B2,+%D0%B3%D0%BE%D1%80%D0%BE%D0%B4+%D0%9A%D0%B8%D0%B5%D0%B2&cid=0,0,15112303229787819682&ll=50.454784,30.508179&spn=0.006295,0.006295&t=h&iwloc=A&source=embed';

export default function ContactsPage() {
  return (
    <article className="space-y-3">
      <h1 className="text-xl">Контакти</h1>

      <p><strong>Наша Адреса:</strong></p>
      <p>
        Вул. Стрітенська 17, г. Київ (Львівська площа)
        <br />
        Вхід з боку вул. Велика Житомирська
      </p>

      <p>
        Телефон:{' '}
        <strong>
          <a href="tel:+380993862655">+38 (099) 386-26-55</a>
        </strong>
      </p>
      <p>
        E-mail:{' '}
        <strong>
          <a href="mailto:akadem7@iptelecom.net.ua">akadem7@iptelecom.net.ua</a>
        </strong>
      </p>

      <p>
        <iframe
          src={MAP_SRC}
          width="425"
          height="350"
          frameBorder="0"
          marginHeight={0}
          marginWidth={0}
          scrolling="no"
          title="Академкнига на мапі"
        />
      </p>
      <p>
        <small>
          <a href={MAP_LINK} style={{ color: '#0000FF' }}>
            Просмотреть увеличенную карту
          </a>
        </small>
      </p>

      <p><strong>Години роботи:</strong></p>
      <p>
        <strong>Пн-Пт:</strong> 10-19
        <br />
        <strong>Субота:</strong> 10-16
        <br />
        <strong>Неділя:</strong> вихідний
      </p>
    </article>
  );
}
