'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import type { CartItem, Order, OrderItem } from '@/types';
import Notification from '@/components/Notification';

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const { data: session } = useSession();

  useEffect(() => {
    try {
      const raw = localStorage.getItem('aq_cart');
      setItems(raw ? JSON.parse(raw) : []);
    } catch {
      setItems([]);
    }
  }, []);

  const save = (next: CartItem[]) => {
    setItems(next);
    try { localStorage.setItem('aq_cart', JSON.stringify(next)); } catch {}
  };

  const totalFcfa = useMemo(() => {
    const parsePrice = (p?: string) => Number((p || '').replace(/[^0-9]/g, '') || '0');
    return items.reduce((sum, it) => sum + parsePrice(it.price) * it.quantity, 0);
  }, [items]);

  const getCurrentUser = () => {
    if (session?.user) {
      return { id: session.user.email || 'patient-1' } as any;
    }
    return null;
  };

  const placeOrder = () => {
    if (items.length === 0) return;
    try {
      const user = getCurrentUser();
      if (!user) {
        window.location.href = '/login';
        return;
      }
      const orderItems: OrderItem[] = items.map(it => ({ productId: it.productId, name: it.name, quantity: it.quantity, price: it.price }));
      // API create
      fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: orderItems, total: totalFcfa })
      }).then(async (res) => {
        if (!res.ok) throw new Error('order failed');
        const created: Order = await res.json();
        setToastMsg(`Commande ${created.id} validée`);
        setToastVisible(true);
        setTimeout(() => { window.location.href = '/account#orders'; }, 900);
      }).catch(() => {
        setToastMsg('Erreur lors de la validation');
        setToastVisible(true);
      });
      // clear cart local
      save([]);
    } catch {}
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
      <Notification message={toastMsg} type="success" duration={1500} isVisible={toastVisible} onClose={() => setToastVisible(false)} />
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-green-800">Mon Panier</h1>
          <a href="/" className="text-gray-600 hover:text-green-600">Accueil</a>
        </div>
      </header>

      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">Votre panier est vide.</p>
              <a href="/diagnostic/final-results" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-full">Voir les recommandations</a>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((it, idx) => (
                <div key={`${it.productId}-${idx}`} className="flex items-center justify-between border border-gray-200 rounded-lg p-4">
                  <div>
                    <h4 className="font-semibold text-gray-800">{it.name}</h4>
                    <p className="text-sm text-gray-600">{it.price ? `${it.price} FCFA` : ''}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => {
                      const next = [...items];
                      next[idx].quantity = Math.max(1, next[idx].quantity - 1);
                      save(next);
                    }} className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200">-</button>
                    <span className="w-8 text-center">{it.quantity}</span>
                    <button onClick={() => {
                      const next = [...items];
                      next[idx].quantity += 1;
                      save(next);
                    }} className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200">+</button>
                    <button onClick={() => {
                      const next = items.filter((_, i) => i !== idx);
                      save(next);
                    }} className="px-3 py-1 rounded bg-red-50 text-red-700 hover:bg-red-100">Retirer</button>
                  </div>
                </div>
              ))}

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="text-lg font-semibold text-gray-800">Total</span>
                <span className="text-xl font-bold text-green-700">{new Intl.NumberFormat('fr-FR').format(totalFcfa)} FCFA</span>
              </div>

              <div className="flex items-center gap-3">
                <button onClick={() => { save([]); }} className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-800">Vider</button>
                <button onClick={placeOrder} className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white font-semibold">Valider la commande</button>
                <button onClick={() => { window.location.href = '/account#orders'; }} className="px-4 py-2 rounded bg-green-50 text-green-700 border border-green-200 hover:bg-green-100">Voir mes commandes</button>
                <button onClick={() => { const text = encodeURIComponent('Bonjour, je souhaite finaliser ma commande: ' + items.map(i => `${i.name} x${i.quantity}`).join(', ')); window.open(`https://wa.me/22890486468?text=${text}`, '_blank'); }} className="px-4 py-2 rounded bg-green-50 text-green-700 border border-green-200 hover:bg-green-100">WhatsApp</button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}


