import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Zap, Globe, TrendingUp } from 'lucide-react';
import { productsAPI } from '../services/api';
import ProductCard from '../components/ProductCard';

const CATEGORIES = [
  { label: 'Кроссовки', slug: 'sneakers', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80&auto=format&fit=crop' },
  { label: 'Одежда',    slug: 'clothing',    img: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&q=80&auto=format&fit=crop' },
  { label: 'Аксессуары',slug: 'accessories', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80&auto=format&fit=crop' },
  { label: 'Сумки',     slug: 'bags',        img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80&auto=format&fit=crop' },
];

const BRANDS = ['Nike', 'Adidas', 'Supreme', 'Stone Island', 'New Balance', 'Fear of God', 'Carhartt', 'New Era'];

const perks = [
  { icon: Shield,     title: 'Верификация',      desc: 'Каждый товар проходит проверку подлинности через Poizon' },
  { icon: Globe,      title: 'Прямая доставка',  desc: 'Доставляем напрямую с китайского рынка и Taobao' },
  { icon: Zap,        title: 'Быстро',            desc: 'Среднее время доставки 7–14 дней до двери' },
  { icon: TrendingUp, title: 'Актуальные цены',  desc: 'Честные цены без наценок посредников' },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productsAPI.getAll({ featured: true, limit: 8 })
      .then(res => setFeatured(res.data?.products || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* HERO — чистый CSS, без зависимости от внешних фото */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-[#080808]">
        {/* Фоновые декоративные элементы */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {/* Большой золотой круг справа */}
          <div style={{
            position: 'absolute', right: '-10%', top: '50%', transform: 'translateY(-50%)',
            width: '70vw', height: '70vw', maxWidth: '900px', maxHeight: '900px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(201,168,76,0.07) 0%, rgba(201,168,76,0.03) 40%, transparent 70%)',
          }} />
          {/* Тонкие линии */}
          <div style={{
            position: 'absolute', right: '8%', top: '15%',
            width: '1px', height: '40vh',
            background: 'linear-gradient(to bottom, transparent, rgba(201,168,76,0.3), transparent)',
          }} />
          <div style={{
            position: 'absolute', right: '20%', bottom: '15%',
            width: '120px', height: '1px',
            background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.3), transparent)',
          }} />
          {/* Крупная буква-декор */}
          <div style={{
            position: 'absolute', right: '-2%', top: '50%', transform: 'translateY(-50%)',
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 'clamp(200px, 30vw, 480px)',
            fontWeight: '300',
            color: 'rgba(201,168,76,0.04)',
            lineHeight: 1,
            userSelect: 'none',
            letterSpacing: '-0.05em',
          }}>L</div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full pt-28 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Левая часть — текст */}
            <div>
              <p className="gold-label mb-5 animate-fade-up" style={{ animationDelay: '100ms' }}>
                🔥 Новые поставки каждую неделю
              </p>
              <h1
                className="font-display text-6xl sm:text-7xl xl:text-8xl font-light text-white leading-[0.9] tracking-tight animate-fade-up"
                style={{ animationDelay: '200ms' }}
              >
                Бренды<br />
                из <em className="text-gold not-italic">Китая</em><br />
                напрямую
              </h1>
              <p className="font-body text-sm text-zinc-400 mt-7 max-w-md leading-relaxed animate-fade-up" style={{ animationDelay: '350ms' }}>
                Кроссовки, одежда, аксессуары с Poizon и Taobao.
                Верификация подлинности, прямая доставка, честные цены.
              </p>
              <div className="flex flex-wrap gap-3 mt-8 animate-fade-up" style={{ animationDelay: '450ms' }}>
                <Link to="/catalog" className="btn-gold flex items-center gap-2">
                  Смотреть каталог <ArrowRight size={16} />
                </Link>
                <Link to="/catalog?featured=true" className="btn-outline">
                  Хиты сезона
                </Link>
              </div>
            </div>

            {/* Правая часть — статы в виде карточек */}
            <div className="hidden lg:grid grid-cols-2 gap-4 animate-fade-up" style={{ animationDelay: '500ms' }}>
              {[
                { num: '500+', label: 'Товаров в каталоге', sub: 'обновляется еженедельно' },
                { num: '4.8★', label: 'Средний рейтинг', sub: 'по отзывам покупателей' },
                { num: '2K+', label: 'Довольных клиентов', sub: 'с 2023 года' },
                { num: '7–14', label: 'Дней доставки', sub: 'Китай → ваша дверь' },
              ].map(({ num, label, sub }) => (
                <div key={label} style={{
                  background: 'rgba(17,17,17,0.8)',
                  border: '1px solid rgba(201,168,76,0.15)',
                  padding: '1.5rem',
                  backdropFilter: 'blur(8px)',
                }}>
                  <div className="font-display text-3xl font-light text-gold mb-1">{num}</div>
                  <div className="font-body text-sm text-white font-medium mb-0.5">{label}</div>
                  <div className="font-mono text-[10px] text-zinc-600 tracking-wide">{sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Мобильные статы */}
          <div className="grid grid-cols-3 gap-4 mt-12 lg:hidden">
            {[['500+', 'Товаров'], ['4.8★', 'Рейтинг'], ['2K+', 'Клиентов']].map(([num, label]) => (
              <div key={label} className="text-center">
                <div className="font-display text-2xl font-light text-gold">{num}</div>
                <div className="font-mono text-[10px] text-zinc-500 tracking-widest uppercase mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="border-y border-dark-border overflow-hidden py-4 bg-dark-card">
        <div className="flex gap-12 whitespace-nowrap" style={{ animation: 'marquee 20s linear infinite' }}>
          {[...BRANDS, ...BRANDS, ...BRANDS].map((brand, i) => (
            <span key={i} className="font-display text-xl font-light text-zinc-700 hover:text-gold transition-colors cursor-default">
              {brand}
            </span>
          ))}
        </div>
        <style>{`@keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-33.33%); } }`}</style>
      </div>

      {/* CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="gold-label mb-2">Разделы</p>
            <h2 className="section-title">Категории</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {CATEGORIES.map((cat) => (
            <Link key={cat.slug} to={`/catalog?category=${cat.slug}`} className="relative aspect-[3/4] overflow-hidden group">
              <img src={cat.img} alt={cat.label} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                onError={(e) => { e.target.style.display='none'; }} />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-DEFAULT via-dark-DEFAULT/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="gold-label text-[10px] mb-1">Смотреть →</p>
                <h3 className="font-display text-xl font-light text-white">{cat.label}</h3>
              </div>
              <div className="absolute inset-0 border border-transparent group-hover:border-gold/40 transition-colors duration-300" />
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="gold-label mb-2">Топ выбор</p>
            <h2 className="section-title">Хиты сезона</h2>
          </div>
          <Link to="/catalog?featured=true" className="flex items-center gap-2 text-gold hover:text-gold-light font-body text-sm transition-colors">
            Все товары <ArrowRight size={16} />
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array(8).fill(0).map((_, i) => <div key={i} className="aspect-square skeleton rounded" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {featured.map((product, i) => <ProductCard key={product.id} product={product} index={i} />)}
          </div>
        )}
      </section>

      {/* PERKS */}
      <section className="border-t border-dark-border bg-dark-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {perks.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex flex-col items-start gap-3">
                <div className="w-10 h-10 border border-gold/30 flex items-center justify-center text-gold">
                  <Icon size={18} />
                </div>
                <div>
                  <h3 className="font-body font-medium text-white text-sm mb-1">{title}</h3>
                  <p className="font-body text-xs text-zinc-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="relative overflow-hidden bg-dark-card border border-dark-border p-10 md:p-16">
          <div className="relative z-10 max-w-lg">
            <p className="gold-label mb-3">Telegram канал</p>
            <h2 className="font-display text-4xl md:text-5xl font-light text-white mb-4">
              Узнавай о<br /><em className="text-gold not-italic">новых дропах</em><br />первым
            </h2>
            <p className="font-body text-sm text-zinc-400 mb-6">
              Подпишись на Telegram — там анонсы поставок, эксклюзивные цены и розыгрыши.
            </p>
            <a href="https://t.me/owkfooslq" className="btn-gold inline-flex items-center gap-2">
              Подписаться <ArrowRight size={16} />
            </a>
          </div>
          <div className="absolute right-0 bottom-0 w-64 h-64 bg-gold/5 rounded-full -translate-x-8 translate-y-8" />
          <div className="absolute right-20 top-0 w-32 h-32 bg-gold/5 rounded-full -translate-y-8" />
        </div>
      </section>
    </div>
  );
}
