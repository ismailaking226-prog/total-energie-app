'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { defaultState, type AppState } from '@/lib/site-data';

export default function ProfilePage() {
  const [state, setState] = useState<AppState>(defaultState);

  useEffect(() => {
    const raw = window.localStorage.getItem('total-energie-state');
    if (raw) {
      try {
        setState(JSON.parse(raw) as AppState);
      } catch {
        setState(defaultState);
      }
    }
  }, []);

  const currentUser = state.users[0];

  const totalPortfolio = currentUser.investments.reduce((sum, item) => sum + item.amount, 0);
  const totalEarnings = currentUser.investments.reduce((sum, item) => sum + item.dailyGain, 0);

  return (
    <main className="min-h-screen bg-[#f3f6f4] px-4 py-8 text-slate-800 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-[#4f7c65]">Compte</p>
            <h1 className="mt-2 text-3xl font-black text-slate-900">Page Moi</h1>
          </div>
          <div className="flex items-center gap-3">
            <a href={state.settings.telegramLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#1d4ed8] px-4 py-2 text-sm font-bold text-white">
              ✈ Telegram
            </a>
            <Link href="/" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">Accueil</Link>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="rounded-[30px] bg-[#113b2d] p-6 text-white shadow-soft">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-2xl font-black">{currentUser.name.slice(0, 1)}</div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[#d7f5e1]">Profil</p>
                <h2 className="mt-1 text-2xl font-black">{currentUser.name}</h2>
              </div>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <InfoPill label="Solde" value={`${currentUser.balance.toLocaleString('fr-FR')} FCFA`} />
              <InfoPill label="Téléphone" value={currentUser.phone} />
              <InfoPill label="Pays" value={currentUser.country} />
              <InfoPill label="Parrainage" value={`${currentUser.referralCount ?? 0} amis`} />
            </div>
          </section>

          <section className="grid gap-4 sm:grid-cols-2">
            <StatMini title="Portefeuille" value={`${totalPortfolio.toLocaleString('fr-FR')} FCFA`} />
            <StatMini title="Gains" value={`${totalEarnings.toLocaleString('fr-FR')} FCFA`} />
            <StatMini title="Dépôt" value="En attente" />
            <StatMini title="Retrait" value="24h/7" />
          </section>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-soft">
            <h2 className="text-2xl font-black text-slate-900">Mes investissements</h2>
            <div className="mt-5 space-y-3">
              {currentUser.investments.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500 text-center">
                  Aucun investissement pour le moment.
                </div>
              ) : (
                currentUser.investments.map((item) => (
                  <div key={item.id} className="rounded-[20px] bg-[#f8faf9] p-4">
                    <div className="flex justify-between gap-3">
                      <div>
                        <p className="text-lg font-black text-slate-900">{item.productName}</p>
                        <p className="text-xs text-slate-500">Début : {new Date(item.startedAt).toLocaleDateString('fr-FR')}</p>
                      </div>
                      <span className="rounded-full bg-[#edf9f1] px-3 py-1 text-xs font-bold text-[#0f8f4a]">{item.amount.toLocaleString('fr-FR')} FCFA</span>
                    </div>
                    <div className="mt-3 text-sm text-slate-600">Gain quotidien : {item.dailyGain.toLocaleString('fr-FR')} FCFA</div>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-soft">
            <h2 className="text-2xl font-black text-slate-900">Notifications</h2>
            <div className="mt-5 space-y-3">
              <div className="rounded-[20px] bg-[#edf9f1] p-4 text-sm text-[#0f8f4a]">Votre solde a été mis à jour avec succès.</div>
              <div className="rounded-[20px] bg-[#eff6ff] p-4 text-sm text-[#1d4ed8]">Votre demande de dépôt est en attente de validation admin.</div>
              <div className="rounded-[20px] bg-[#fff7ed] p-4 text-sm text-[#b86b00]">Rendement calculé automatiquement chaque 24h.</div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function InfoPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
      <p className="text-[10px] uppercase tracking-[0.2em] text-[#d7f5e1]">{label}</p>
      <p className="mt-2 text-sm font-bold text-white">{value}</p>
    </div>
  );
}

function StatMini({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-soft">
      <p className="text-xs uppercase tracking-[0.2em] text-[#4f7c65]">{title}</p>
      <p className="mt-3 text-2xl font-black text-slate-900">{value}</p>
    </div>
  );
}
