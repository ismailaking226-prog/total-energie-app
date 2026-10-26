'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { defaultState, products, type AppState, type Product, type RequestItem } from '@/lib/site-data';

export default function AdminPage() {
  const [state, setState] = useState<AppState>(defaultState);
  const [tab, setTab] = useState<'deposit' | 'withdrawal'>('deposit');
  const [selectedCountry, setSelectedCountry] = useState('Tous');
  const [adminUser, setAdminUser] = useState(defaultState.users[0]?.id || '');
  const [paymentLink, setPaymentLink] = useState(defaultState.settings.paymentLink);
  const [telegramLink, setTelegramLink] = useState(defaultState.settings.telegramLink);
  const [referral, setReferral] = useState(defaultState.settings.referral);
  const [proposedProduct, setProposedProduct] = useState<Product>(products[0]);
  const [balanceModifier, setBalanceModifier] = useState('0');
  const [newProduct, setNewProduct] = useState({ title: 'Nouvelle offre', dailyReturn: 300, totalReturn: 54000, minInvestment: 2000, image: '/images/plan-2000.svg' });

  useEffect(() => {
    const raw = window.localStorage.getItem('total-energie-state');
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as AppState;
        setState(parsed);
        setPaymentLink(parsed.settings.paymentLink);
        setTelegramLink(parsed.settings.telegramLink);
        setReferral(parsed.settings.referral);
        setAdminUser(parsed.users[0]?.id || '');
      } catch {
        setState(defaultState);
      }
    }
  }, []);

  const saveState = (next: AppState) => {
    setState(next);
    window.localStorage.setItem('total-energie-state', JSON.stringify(next));
  };

  const filteredUsers = useMemo(() => {
    if (selectedCountry === 'Tous') return state.users;
    return state.users.filter((user) => user.country === selectedCountry);
  }, [state.users, selectedCountry]);

  const pendingDeposits = state.requests.filter((request) => request.type === 'deposit' && request.status === 'pending');
  const pendingWithdrawals = state.requests.filter((request) => request.type === 'withdrawal' && request.status === 'pending');
  const approvedDeposits = state.requests.filter((request) => request.type === 'deposit' && request.status === 'approved');
  const approvedWithdrawals = state.requests.filter((request) => request.type === 'withdrawal' && request.status === 'approved');

  const approveRequest = (request: RequestItem) => {
    const nextRequests = state.requests.map((item) => (item.id === request.id ? { ...item, status: 'approved' } : item));
    const nextState: AppState = { ...state, requests: nextRequests };

    if (request.type === 'deposit') {
      const idx = nextState.users.findIndex((user) => user.id === request.userId);
      if (idx >= 0) nextState.users[idx].balance += request.amount;
    } else {
      const idx = nextState.users.findIndex((user) => user.id === request.userId);
      if (idx >= 0) nextState.users[idx].balance -= request.amount + request.amount * 0.15;
    }

    saveState(nextState);
  };

  const rejectRequest = (request: RequestItem) => {
    const nextRequests = state.requests.map((item) => (item.id === request.id ? { ...item, status: 'rejected' } : item));
    saveState({ ...state, requests: nextRequests });
  };

  const updateSettings = () => {
    saveState({
      ...state,
      settings: {
        ...state.settings,
        paymentLink,
        telegramLink,
        referral,
      }
    });
  };

  const applyBalanceChange = () => {
    const value = Number(balanceModifier || 0);
    if (!adminUser || Number.isNaN(value)) return;

    const nextUsers = state.users.map((user) =>
      user.id === adminUser ? { ...user, balance: user.balance + value } : user
    );

    saveState({ ...state, users: nextUsers });
    setBalanceModifier('0');
  };

  const addProduct = () => {
    const productToAdd = {
      id: `prod-${Date.now()}`,
      ...newProduct,
      title: newProduct.title,
      dailyReturn: Number(newProduct.dailyReturn),
      totalReturn: Number(newProduct.totalReturn),
      minInvestment: Number(newProduct.minInvestment)
    };

    const nextProducts = [...products, productToAdd];
    const nextState = {
      ...state,
      catalog: nextProducts
    } as AppState & { catalog?: typeof products };

    saveState(nextState);
    setNewProduct({ title: 'Nouvelle offre', dailyReturn: 300, totalReturn: 54000, minInvestment: 2000, image: '/images/plan-2000.svg' });
  };

  const runDailyGains = () => {
    const updatedUsers = state.users.map((user) => {
      const nextInvestments = user.investments.map((item) => {
        const last = new Date(item.lastCreditAt).getTime();
        const now = Date.now();
        const diffHours = (now - last) / (1000 * 60 * 60);

        if (diffHours >= 24) {
          const monthlyGain = item.dailyGain;
          return {
            ...item,
            lastCreditAt: new Date(now).toISOString(),
            amount: item.amount + monthlyGain
          };
        }

        return item;
      });

      return { ...user, investments: nextInvestments, balance: user.balance + nextInvestments.reduce((sum, item) => sum + item.dailyGain, 0) };
    });

    saveState({ ...state, users: updatedUsers });
  };

  const currentItems = tab === 'deposit' ? pendingDeposits : pendingWithdrawals;

  return (
    <main className="min-h-screen bg-[#f5f7f5] px-4 py-8 text-slate-800 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-[#4f7c65]">Backoffice</p>
            <h1 className="mt-2 text-3xl font-black text-slate-900">Tableau de bord admin</h1>
          </div>
          <Link href="/" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">Accueil</Link>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <StatCard title="Utilisateurs" value={String(state.users.length)} accent="bg-[#0f8f4a]" />
          <StatCard title="Dépôts en attente" value={String(pendingDeposits.length)} accent="bg-[#3b82f6]" />
          <StatCard title="Retraits en attente" value={String(pendingWithdrawals.length)} accent="bg-[#f59e0b]" />
          <StatCard title="Total validé" value={String(approvedDeposits.length + approvedWithdrawals.length)} accent="bg-[#111827]" />
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-soft">
            <div className="mb-4 flex items-center gap-3">
              <button onClick={() => setTab('deposit')} className={`rounded-full px-4 py-2 text-sm font-bold ${tab === 'deposit' ? 'bg-[#0f8f4a] text-white' : 'bg-[#edf9f1] text-[#0f8f4a]'}`}>
                Dépôts
              </button>
              <button onClick={() => setTab('withdrawal')} className={`rounded-full px-4 py-2 text-sm font-bold ${tab === 'withdrawal' ? 'bg-[#f59e0b] text-white' : 'bg-[#fff4d8] text-[#b86b00]'}`}>
                Retraits
              </button>
            </div>

            <div className="mb-4">
              <select value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3">
                <option value="Tous">Tous les pays</option>
                {state.settings.countries.map((country) => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>

            {currentItems.filter((request) => selectedCountry === 'Tous' || request.country === selectedCountry).length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
                Aucune demande pour ce pays.
              </div>
            ) : (
              <div className="space-y-4">
                {currentItems.filter((request) => selectedCountry === 'Tous' || request.country === selectedCountry).map((request) => (
                  <div key={request.id} className="rounded-[24px] border border-slate-200 bg-[#fbfdfb] p-4">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-lg font-black text-slate-900">{request.userName}</p>
                        <p className="text-sm text-slate-600">{request.amount.toLocaleString('fr-FR')} FCFA • {request.network ?? 'Mobile Money'} • {request.phone}</p>
                        <p className="mt-1 text-xs text-slate-500">{request.country} • {new Date(request.date).toLocaleString('fr-FR')}</p>
                      </div>

                      <div className="flex gap-2">
                        <button onClick={() => approveRequest(request)} className="rounded-full bg-[#0f8f4a] px-4 py-2 text-sm font-bold text-white">
                          Approuver
                        </button>
                        <button onClick={() => rejectRequest(request)} className="rounded-full bg-[#ef4444] px-4 py-2 text-sm font-bold text-white">
                          Rejeter
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <aside className="space-y-6">
            <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-soft">
              <h2 className="text-xl font-black text-slate-900">Gestion paiement</h2>
              <label className="mt-4 block text-sm font-semibold text-slate-700">Lien de paiement</label>
              <input value={paymentLink} onChange={(e) => setPaymentLink(e.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" />

              <label className="mt-4 block text-sm font-semibold text-slate-700">Lien Telegram</label>
              <input value={telegramLink} onChange={(e) => setTelegramLink(e.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" />

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <input type="number" value={referral.level1} onChange={(e) => setReferral({ ...referral, level1: Number(e.target.value) })} className="rounded-2xl border border-slate-200 px-3 py-2" />
                <input type="number" value={referral.level2} onChange={(e) => setReferral({ ...referral, level2: Number(e.target.value) })} className="rounded-2xl border border-slate-200 px-3 py-2" />
                <input type="number" value={referral.level3} onChange={(e) => setReferral({ ...referral, level3: Number(e.target.value) })} className="rounded-2xl border border-slate-200 px-3 py-2" />
              </div>

              <button onClick={updateSettings} className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-[#0f8f4a] px-5 py-3 text-sm font-bold text-white">
                Enregistrer les paramètres
              </button>
            </section>

            <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-soft">
              <h2 className="text-xl font-black text-slate-900">Ajouter / retirer le solde</h2>
              <select value={adminUser} onChange={(e) => setAdminUser(e.target.value)} className="mt-4 w-full rounded-2xl border border-slate-200 px-4 py-3">
                {state.users.map((user) => (
                  <option key={user.id} value={user.id}>{user.name}</option>
                ))}
              </select>
              <input value={balanceModifier} onChange={(e) => setBalanceModifier(e.target.value)} type="number" className="mt-4 w-full rounded-2xl border border-slate-200 px-4 py-3" placeholder="Montant à ajouter/soustraire" />
              <button onClick={applyBalanceChange} className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-[#111827] px-5 py-3 text-sm font-bold text-white">
                Appliquer
              </button>
            </section>
          </aside>
        </div>

        <section className="mt-8 rounded-[28px] border border-slate-200 bg-white p-5 shadow-soft">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-2xl font-black text-slate-900">Produits d’investissement</h2>
            <button onClick={runDailyGains} className="rounded-full bg-[#0f8f4a] px-4 py-2 text-sm font-bold text-white">Lancer les gains quotidiens</button>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {products.map((product) => (
              <div key={product.id} className="rounded-[22px] border border-slate-200 bg-[#f9faf9] p-4">
                <div className="flex items-center justify-between">
                  <p className="text-lg font-black text-slate-900">{product.title}</p>
                  <span className="rounded-full bg-[#edf9f1] px-2 py-1 text-xs font-bold text-[#0f8f4a]">{product.dailyReturn} / j</span>
                </div>
                <p className="mt-2 text-sm text-slate-600">Retour total : {product.totalReturn.toLocaleString('fr-FR')} FCFA</p>
                <p className="mt-1 text-sm text-slate-600">Minimum : {product.minInvestment.toLocaleString('fr-FR')} FCFA</p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-5">
            <h3 className="text-lg font-black text-slate-900">Créer / modifier un produit</h3>
            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
              <input value={newProduct.title} onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })} className="rounded-2xl border border-slate-200 px-3 py-2" placeholder="Nom du produit" />
              <input type="number" value={newProduct.dailyReturn} onChange={(e) => setNewProduct({ ...newProduct, dailyReturn: Number(e.target.value) })} className="rounded-2xl border border-slate-200 px-3 py-2" placeholder="Gain/jour" />
              <input type="number" value={newProduct.totalReturn} onChange={(e) => setNewProduct({ ...newProduct, totalReturn: Number(e.target.value) })} className="rounded-2xl border border-slate-200 px-3 py-2" placeholder="Total" />
              <input type="number" value={newProduct.minInvestment} onChange={(e) => setNewProduct({ ...newProduct, minInvestment: Number(e.target.value) })} className="rounded-2xl border border-slate-200 px-3 py-2" placeholder="Min" />
              <button onClick={addProduct} className="rounded-2xl bg-[#0f8f4a] px-4 py-2 font-bold text-white">Ajouter</button>
            </div>
          </div>
        </section>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-soft">
            <h2 className="text-2xl font-black text-slate-900">Utilisateurs</h2>
            <div className="mt-4 space-y-3">
              {filteredUsers.map((user) => (
                <div key={user.id} className="rounded-[20px] bg-[#f8faf9] p-4">
                  <div className="flex justify-between gap-3">
                    <div>
                      <p className="text-lg font-black text-slate-900">{user.name}</p>
                      <p className="text-sm text-slate-600">{user.phone} • {user.country}</p>
                    </div>
                    <span className="rounded-full bg-[#edf9f1] px-3 py-1 text-xs font-bold text-[#0f8f4a]">{user.balance.toLocaleString('fr-FR')} FCFA</span>
                  </div>
                  <div className="mt-3 grid gap-2 text-xs text-slate-600 sm:grid-cols-2">
                    <span>Investissements : {user.investments.length}</span>
                    <span>Parrainage : {user.referralCount ?? 0}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-soft">
            <h2 className="text-2xl font-black text-slate-900">Historique des investissements</h2>
            <div className="mt-5 overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="py-3 pr-4 font-semibold">Nom</th>
                    <th className="py-3 pr-4 font-semibold">Téléphone</th>
                    <th className="py-3 pr-4 font-semibold">Date</th>
                    <th className="py-3 pr-4 font-semibold">Montant</th>
                  </tr>
                </thead>
                <tbody>
                  {state.requests.filter((r) => r.type === 'deposit' && r.status === 'approved').map((request) => (
                    <tr key={request.id} className="border-b border-slate-100">
                      <td className="py-3 pr-4">{request.userName}</td>
                      <td className="py-3 pr-4">{request.phone}</td>
                      <td className="py-3 pr-4">{new Date(request.date).toLocaleString('fr-FR')}</td>
                      <td className="py-3 pr-4 font-bold text-[#0f8f4a]">{request.amount.toLocaleString('fr-FR')} FCFA</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function StatCard({ title, value, accent }: { title: string; value: string; accent: string }) {
  return (
    <div className={`rounded-[24px] p-5 text-white shadow-soft ${accent}`}>
      <p className="text-xs uppercase tracking-[0.24em] text-white/80">{title}</p>
      <p className="mt-3 text-3xl font-black">{value}</p>
    </div>
  );
}
