import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Send, X } from 'lucide-react';

const INFO_CONTENT = {
  'Как заказать': {
    title: 'Как заказать',
    content: 'Выбираете товар в каталоге, нажимаете «Заказать» или связываетесь с нами напрямую в Telegram (@owkfooslq). Мы уточняем наличие нужного размера, рассчитываем точную стоимость с учетом доставки из Китая в рублях, после чего оформляем и выкупаем ваш заказ.'
  },
  'Доставка и оплата': {
    title: 'Доставка и оплата',
    content: 'Оплата производится переводом на карту (любой банк РФ). Выкуп в Китае происходит в день оплаты.\n\nДоставка со складов Poizon/Taobao до Москвы занимает в среднем 10-18 дней. Далее по России отправляем заказы через СДЭК или Почту России.'
  },
  'Возврат': {
    title: 'Возврат',
    content: 'Поскольку товар выкупается индивидуально под вас за рубежом, возврат поставщику невозможен. Возврат средств осуществляется только в случае явного фабричного брака.\n\nЕсли вам просто не подошел размер, мы бесплатно поможем перепродать вашу вещь через наш Telegram-канал.'
  },
  'FAQ': {
    title: 'Частые вопросы (FAQ)',
    content: '— Это оригинал?\nДа, абсолютно! Все вещи проходят строгий легит-чек на площадке Poizon. Вы получите товар с оригинальным сертификатом, в оригинальной упаковке и со всеми пломбами.\n\n— Какие гарантии?\nПосле выкупа мы предоставляем внутренний трек-номер и фотоотчет со склада. Также вы всегда можете почитать настоящие отзывы наших клиентов в основном Telegram-канале.'
  }
};

export default function Footer() {
  const [activeModal, setActiveModal] = useState(null);
  return (
    <footer className="border-t border-dark-border mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="block mb-4">
              <span className="font-display text-2xl font-light tracking-[0.15em] text-white">LUXDROP</span>
              <p className="font-mono text-[9px] tracking-[0.3em] text-gold uppercase opacity-70 mt-1">Premium Streetwear</p>
            </Link>
            <p className="font-body text-xs text-zinc-500 leading-relaxed">
              Брендовые вещи с Poizon, Taobao и китайского рынка. Верификация, доставка, гарантия качества.
            </p>
            <div className="flex gap-3 mt-5">
              <a href="#" className="w-8 h-8 border border-dark-border flex items-center justify-center text-zinc-500 hover:text-gold hover:border-gold transition-colors">
                <Instagram size={14} />
              </a>
              <a href="https://t.me/owkfooslq" target="_blank" rel="noopener noreferrer" className="w-8 h-8 border border-dark-border flex items-center justify-center text-zinc-500 hover:text-gold hover:border-gold transition-colors">
                <Send size={14} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="gold-label mb-4">Каталог</h4>
            <ul className="space-y-2.5">
              {[['Кроссовки', '/catalog?category=sneakers'], ['Одежда', '/catalog?category=clothing'], ['Аксессуары', '/catalog?category=accessories'], ['Сумки', '/catalog?category=bags'], ['Часы', '/catalog?category=watches']].map(([label, href]) => (
                <li key={href}>
                  <Link to={href} className="font-body text-xs text-zinc-500 hover:text-gold transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="gold-label mb-4">Покупателям</h4>
            <ul className="space-y-2.5">
              {Object.keys(INFO_CONTENT).map((label) => (
                <li key={label}>
                  <button
                    onClick={() => setActiveModal(label)}
                    className="font-body text-xs text-zinc-500 hover:text-gold transition-colors text-left"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="gold-label mb-4">Контакты</h4>
            <ul className="space-y-2.5 font-body text-xs text-zinc-500">
              <li>Telegram: @owkfooslq</li>
              <li>WhatsApp: +7 (903) 482-17-65</li>
              <li className="pt-2 text-zinc-700">Работаем 24/7</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-dark-border mt-12 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-mono text-[10px] text-zinc-700 tracking-wider">
            © 2026 LUXDROP. Все права защищены.
          </p>
          <p className="font-mono text-[10px] text-zinc-700 tracking-wider">
            Все товары проходят верификацию Poizon
          </p>
        </div>
      </div>

      {/* Info Modal */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div
            className="bg-dark-card border border-dark-border w-full max-w-lg p-6 relative animate-on-scroll visible"
            style={{ animation: 'fadeUp 0.3s ease-out forwards' }}
          >
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
            <h3 className="font-display text-2xl font-light text-white mb-6">
              {INFO_CONTENT[activeModal].title}
            </h3>
            <div className="space-y-4 font-body text-sm text-zinc-400 leading-relaxed">
              {INFO_CONTENT[activeModal].content.split('\n').map((paragraph, idx) => (
                paragraph ? <p key={idx}>{paragraph}</p> : <br key={idx} />
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-dark-border">
              <a
                href="https://t.me/owkfooslq"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold w-full text-center block"
              >
                Задать вопрос менеджеру
              </a>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
