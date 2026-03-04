import { Link } from 'react-router-dom';
import { Instagram, Send } from 'lucide-react';

export default function Footer() {
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
              {[['Как заказать', '#'], ['Доставка и оплата', '#'], ['Возврат', '#'], ['FAQ', '#']].map(([label, href]) => (
                <li key={label}>
                  <Link to={href} className="font-body text-xs text-zinc-500 hover:text-gold transition-colors">{label}</Link>
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
    </footer>
  );
}
