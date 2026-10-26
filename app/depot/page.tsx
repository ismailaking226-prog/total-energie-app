'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { defaultState, type AppState } from '@/lib/site-data';

export default function DepotPage() {
  const [state, setState] = useState<AppState>(defaultState);
  const [amount, setAmount] = useState('2000');
  const [phone, setPhone] = useState('');
  const [network, setNetwork] = useState('Orange Money');
  const [showConfirm, setShowConfirm] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    const raw = window.localStorage.getItem('total-energie-state');
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as AppState;
        setState(parsed);
      } catch {
        setState(defaultState);
      }
    }
  }, []);

  const networks = ['Orange Money', 'Moov Money', 'MTN Money', 'Wave'];

  const handlePay = () => {
    window.open(state.settings.paymentLink, '_blank', 'noopener,noreferrer');
  };

  const handleSubmit = () => {
    const numericAmount = Number(amount || 0);
    if (!numericAmount || numericAmount < 2000) {
      setToast('Le montant minimum est de 2000 FCFA');
      return;
    }

    if (!phone.trim()) {
      setToast('Veuillez renseigner le numéro utilisé');
      return;
    }

    const next: AppState = {
      ...state,
      requests: [
        {
          id: `req-${Date.now()}`,
          type: 'deposit',
          userId: state.users[0]?.id || 'user-001',
          userName: state.users[0]?.name || 'Utilisateur Total Énergie',
          amount: numericAmount,
          network,
          phone,
          country: state.users[0]?.country || 'Côte d’Ivoire',
          status: 'pending',
          date: new Date().toISOString(),
          proof: 'Paiement mobile money'
        },
        ...state.requests
      ]
    };

    setState(next);
    window.localStorage.setItem('total-energie-state', JSON.stringify(next));
    setShowConfirm(false);
    setToast('Demande de dépôt envoyée. En attente de validation Admin');
    setAmount('2000');
    setPhone('');
  };

  return (
    <main className="min-h-screen bg-[#f4f6f3] px-4 py-10 text-slate-800 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[#0f8f4a]">
          ← Retour à l&apos;accueil
        </Link>

        <div className="rounded-[32px] border border-[#dfe8e2] bg-white p-5 shadow-soft sm:p-8">
          <div className="mb-6 flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-[#4f7c65]">Recharge</p>
              <h1 className="mt-2 text-3xl font-black text-slate-900">Dépôt / Recharger</h1>
            </div>
            <div className="rounded-full bg-[#edf9f1] px-3 py-2 text-sm font-bold text-[#0f8f4a]">FCFA</div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-[28px] border border-slate-200 bg-[#f8faf9] p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#4f7c65]">Méthode de paiement</p>
              <div className="mt-5 rounded-2xl bg-[#113b2d] p-4 text-white">
                <p className="text-lg font-bold">- Mobile Money</p>
                <p className="mt-2 text-sm text-emerald-50/80">Réseau utilisé : Orange Money, Moov Money, MTN Money, Wave</p>
              </div>

              <div className="mt-5 space-y-4">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">Montant</span>
                  <input type="number" min={2000} value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-lg outline-none transition focus:border-[#0f8f4a]" placeholder="Montant minimum 2000 FCFA" />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">Numéro</span>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-lg outline-none transition focus:border-[#0f8f4a]" placeholder="Ex : Numéro de téléphone sans indicatif" />
                  <span className="mt-2 block text-xs text-slate-500">Indiquez le numéro mobile money utilisé</span>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">Réseau</span>
                  <select value={network} onChange={(e) => setNetwork(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base outline-none transition focus:border-[#0f8f4a]">
                    {networks.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </label>
              </div>

              <button onClick={handlePay} className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[#0f8f4a] px-5 py-3 text-base font-bold text-white">
                Payer
              </button>
            </div>

            <div className="rounded-[28px] bg-[#fbfdfb] p-5 ring-1 ring-[#dfe8e2]">
              <div className="rounded-[22px] border border-dashed border-[#c7dbc8] bg-[#f2fbf5] p-5 text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#4f7c65]">Étape 2</p>
                <p className="mt-4 text-xl font-black text-slate-900">1. Effectuez le paiement</p>
                <p className="mt-2 text-base text-slate-600">2. Cliquez sur le bouton ci-dessous</p>
              </div>

              <button onClick={() => setShowConfirm(true)} className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[#f6c453] px-5 py-3 text-base font-bold text-[#123a2e]">
                Confirmation de dépôt
              </button>

              <div className="mt-8 rounded-[24px] border border-slate-200 bg-white p-4">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#4f7c65]">Sécurité</p>
                <p className="mt-2 text-sm text-slate-600">Ne crédite jamais automatiquement. La validation admin est obligatoire avant activation du solde.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-[28px] bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-2xl font-black text-slate-900">Confirmation de dépôt</h2>
              <button onClick={() => setShowConfirm(false)} className="text-2xl text-slate-500">×</button>
            </div>

            <div className="space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">Montant déposé</span>
                <input type="number" min={2000} value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3" />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">Réseau</span>
                <select value={network} onChange={(e) => setNetwork(e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3">
                  {networks.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">Numéro utilisé</span>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3" placeholder="Ex : 67000000" />
              </label>
            </div>

            <button onClick={handleSubmit} className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[#0f8f4a] px-5 py-3 text-sm font-bold text-white">
              Soumettre la demande
            </button>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-5 right-5 z-50 rounded-full bg-[#0f8f4a] px-4 py-2 text-sm font-semibold text-white shadow-lg">
          {toast}
        </div>
      )}
    </main>
  );
}
