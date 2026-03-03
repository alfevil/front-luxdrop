import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { favoritesAPI } from '../services/api';
import toast from 'react-hot-toast';

const formatPrice = (price) => {
  return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(price);
};

const getDiscount = (price, original) => {
  if (!original || original <= price) return null;
  return Math.round((1 - price / original) * 100);
};

export default function ProductCard({ product, index = 0 }) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [imgIndex, setImgIndex] = useState(0);
  const [favorited, setFavorited] = useState(false);
  const [adding, setAdding] = useState(false);

  const discount = getDiscount(product.price, product.original_price);
  const image = product.images?.[imgIndex] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600';

  const handleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { toast.error('Войдите, чтобы добавить в избранное'); return; }
    
    try {
      if (favorited) {
        await favoritesAPI.remove(product.id);
        setFavorited(false);
        toast.success('Удалено из избранного');
      } else {
        await favoritesAPI.add(product.id);
        setFavorited(true);
        toast.success('Добавлено в избранное');
      }
    } catch (err) {
      toast.error('Ошибка');
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { toast.error('Войдите, чтобы добавить в корзину'); return; }
    
    setAdding(true);
    try {
      await addToCart(product.id, product.sizes?.[0], product.colors?.[0]);
      toast.success('Добавлено в корзину');
    } catch (err) {
      toast.error('Нет в наличии');
    } finally {
      setAdding(false);
    }
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className="group block"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="card overflow-hidden hover:border-gold/30 transition-all duration-300">
        {/* Image area */}
        <div
          className="relative aspect-square overflow-hidden bg-dark-muted"
          onMouseEnter={() => product.images?.length > 1 && setImgIndex(1)}
          onMouseLeave={() => setImgIndex(0)}
        >
          <img
            src={image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {discount && (
              <span className="bg-gold text-dark-DEFAULT text-[10px] font-mono font-bold px-2 py-1 tracking-wider">
                -{discount}%
              </span>
            )}
            {product.is_new && (
              <span className="bg-white text-dark-DEFAULT text-[10px] font-mono font-bold px-2 py-1 tracking-wider">
                NEW
              </span>
            )}
          </div>

          {/* Image dots */}
          {product.images?.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
              {product.images.slice(0, 4).map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.preventDefault(); setImgIndex(i); }}
                  className={`w-1 h-1 rounded-full transition-all ${i === imgIndex ? 'bg-gold w-3' : 'bg-white/40'}`}
                />
              ))}
            </div>
          )}

          {/* Hover actions */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
            <button
              onClick={handleFavorite}
              className={`w-8 h-8 flex items-center justify-center backdrop-blur-sm transition-colors ${
                favorited ? 'bg-gold text-dark-DEFAULT' : 'bg-dark-DEFAULT/70 text-white hover:text-gold'
              }`}
            >
              <Heart size={14} fill={favorited ? 'currentColor' : 'none'} />
            </button>
            <button
              onClick={handleAddToCart}
              disabled={adding || product.stock === 0}
              className="w-8 h-8 flex items-center justify-center bg-gold text-dark-DEFAULT hover:bg-gold-light transition-colors disabled:opacity-50"
            >
              <ShoppingBag size={14} />
            </button>
          </div>

          {/* Out of stock overlay */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-dark-DEFAULT/70 flex items-center justify-center">
              <span className="font-mono text-xs tracking-widest text-zinc-400 uppercase">Нет в наличии</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div>
              <p className="gold-label text-[10px] mb-0.5">{product.brand}</p>
              <h3 className="font-body text-sm text-white leading-snug group-hover:text-gold transition-colors duration-200 line-clamp-2">
                {product.name}
              </h3>
            </div>
          </div>

          {/* Rating */}
          {product.rating > 0 && (
            <div className="flex items-center gap-1 mt-1.5 mb-2">
              <Star size={10} className="text-gold fill-gold" />
              <span className="font-mono text-[10px] text-zinc-400">{product.rating} ({product.reviews_count})</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-end gap-2 mt-auto">
            <span className="font-display text-lg font-medium text-gold">{formatPrice(product.price)}</span>
            {product.original_price && product.original_price > product.price && (
              <span className="font-body text-xs text-zinc-600 line-through">{formatPrice(product.original_price)}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
