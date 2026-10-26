'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { defaultState, products, type AppState } from '@/lib/site-data';

export default function HomePage() {
  const [state, setState] = useState<AppState>(defaultState);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem('total-energie-state');
    if (saved) {
      try {
        setState(JSON.parse(saved) as AppState);
      } catch {
        setState(defaultState);
      }
    }

    const popupSeen = window.localStorage.getItem('total-energie-popup-seen');
    setShowPopup(!popupSeen);
  }, []);

  const totalInvested = state.users.reduce(
    (sum, user) => sum + user.investments.reduce((acc, item) => acc + item.amount, 0),
    0
  );

  const totalBalance = state.users.reduce((sum, user) => sum + user.balance, 0);

  return (
    <main className="min-h-screen bg-[#f4f6f3] text-slate-900">
      <header className="sticky top-0 z-30 border-b border-[#dbe8e2] bg-[#f4f6f3]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-[#cfe7d7] bg-gradient-to-br from-[#0f8f4a] via-[#1ca85b] to-[#f6c453] p-1 shadow-soft">
              <Image src="/images/logo-total-energie.svg" alt="Total Énergie" width={48} height={48} />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.4em] text-[#4f7c65]">Station</p>
              <h1 className="text-lg font-black text-[#173a31]">Total Énergie</h1>
            </div>
          </div>

          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-700 md:flex">
            <Link href="/">Accueil</Link>
            <Link href="/produits">Produits</Link>
            <Link href="/depot">Dépôt</Link>
            <Link href="/profil">Moi</Link>
            <Link href="/admin">Admin</Link>
          </nav>

          <div className="flex items-center gap-3">
            <a href={state.settings.telegramLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#1d4ed8] px-3 py-2 text-xs font-semibold text-white shadow-lg shadow-blue-200">
              ✈ Telegram
            </a>
            <a href="tel:+22900000000" className="rounded-full border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700">
              Service client
            </a>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden bg-gradient-to-br from-[#0f8f4a] via-[#0f5b35] to-[#0a2f23] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(246,196,83,0.28),transparent_28%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8 lg:py-24">
          <div>
            <p className="mb-4 inline-flex rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#d7f5e1]">
              Investissement fiable
            </p>
            <h2 className="max-w-xl text-4xl font-black leading-tight sm:text-5xl">
              Développez votre capital avec la Station Total Énergie
            </h2>
            <p className="mt-5 max-w-xl text-base text-emerald-50/90">
              Gagnez dès le lendemain avec des plans de 180 jours, en FCFA, avec validation manuelle sécurisée et rendement quotidien autocalculé.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/depot" className="rounded-full bg-[#f6c453] px-6 py-3 text-sm font-bold text-[#0b1d17] shadow-xl shadow-amber-700/20 transition hover:scale-[1.01]">
                Déposer maintenant
              </Link>
              <Link href="/produits" className="rounded-full border border-white/30 bg-white/5 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10">
                Voir les plans
              </Link>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <MiniStat label="Pays" value="5" />
              <MiniStat label="Jours" value="180" />
              <MiniStat label="FCFA" value="100%" />
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="relative w-full max-w-lg rounded-[30px] border border-white/10 bg-white/10 p-4 shadow-2xl shadow-emerald-900/25 backdrop-blur-xl">
              <Image src="/images/brand-hero.svg" alt="Station Total Énergie" width={740} height={720} className="w-full rounded-[24px]" />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#4f7c65]">Produits</p>
            <h3 className="mt-2 text-3xl font-black text-slate-900">Plans d’investissement 180 jours</h3>
          </div>
          <Link href="/produits" className="hidden rounded-full border border-[#b9d4c8] bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 md:inline-flex">
            Tous les plans
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {products.slice(0, 4).map((product) => (
            <div key={product.id} className="group overflow-hidden rounded-[26px] border border-slate-200 bg-white p-4 shadow-soft transition hover:-translate-y-1 hover:shadow-xl">
              <div className="overflow-hidden rounded-[18px] border border-slate-200">
                <Image src={product.image} alt={product.title} width={420} height={280} className="h-44 w-full object-cover transition group-hover:scale-105" />
              </div>
              <div className="mt-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#5d9a7f]">Investissement</p>
                  <h4 className="mt-2 text-xl font-black text-slate-900">{product.title}</h4>
                </div>
                <span className="rounded-full bg-[#edf9f1] px-2.5 py-1 text-xs font-bold text-[#0f8f4a]">{product.dailyReturn} / jour</span>
              </div>
              <div className="mt-5 rounded-2xl bg-[#f3faf5] p-3">
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span>Rendement total</span>
                  <span className="font-extrabold text-[#0f8f4a]">{product.totalReturn.toLocaleString('fr-FR')} FCFA</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm text-slate-600">
                  <span>Montant min.</span>
                  <span className="font-semibold">{product.minInvestment.toLocaleString('fr-FR')} FCFA</span>
                </div>
              </div>
              <Link href="/depot" className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-[#0f8f4a] px-4 py-3 text-sm font-bold text-white">
                Investir
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#173a31] py-14 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#d7f5e1]">Parrainage</p>
              <h3 className="mt-3 text-3xl font-black">Invitez et gagnez</h3>
              <ul className="mt-6 space-y-3 text-sm text-emerald-50/90">
                <li>• Niveau 1 : 25% sur les investissements du filleul</li>
                <li>• Niveau 2 : 3% sur la génération suivante</li>
                <li>• Niveau 3 : 2% sur le troisième niveau</li>
              </ul>
            </div>

            <div className="rounded-[28px] border border-[#d7f5e1]/10 bg-[#0f4d39] p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#d7f5e1]">Canal</p>
                  <h3 className="mt-3 text-3xl font-black">Rejoignez notre Canal Telegram</h3>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1d4ed8] text-2xl shadow-lg shadow-blue-500/25">
                  ✈
                </div>
              </div>
              <p className="mt-5 max-w-xl text-emerald-50/90">
                Recevez les annonces, les bons plans et les mises à jour en temps réel. Un accès rapide à l’équipe de support pour vos demandes et paiements.
              </p>
              <a href={state.settings.telegramLink} target="_blank" rel="noreferrer" className="mt-6 inline-flex rounded-full bg-[#1d4ed8] px-5 py-3 text-sm font-bold text-white">
                Rejoindre le canal
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-7 md:grid-cols-3">
          <div className="rounded-[28px] border border-slate-200 bg-white p-7 shadow-soft">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#4f7c65]">Statut</p>
            <h3 className="mt-3 text-2xl font-black text-slate-900">Capital total</h3>
            <p className="mt-4 text-4xl font-black text-[#0f8f4a]">{totalBalance.toLocaleString('fr-FR')} FCFA</p>
          </div>
          <div className="rounded-[28px] border border-slate-200 bg-white p-7 shadow-soft">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#4f7c65]">Rendements</p>
            <h3 className="mt-3 text-2xl font-black text-slate-900">Investissements</h3>
            <p className="mt-4 text-4xl font-black text-[#0f8f4a]">{totalInvested.toLocaleString('fr-FR')} FCFA</p>
          </div>
          <div className="rounded-[28px] border border-slate-200 bg-white p-7 shadow-soft">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#4f7c65]">Pays</p>
            <h3 className="mt-3 text-2xl font-black text-slate-900">Autorisation</h3>
            <p className="mt-4 text-4xl font-black text-[#0f8f4a]">5 pays</p>
          </div>
        </div>
      </section>

      {showPopup && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-[30px] border border-emerald-200 bg-white p-6 shadow-2xl shadow-emerald-900/20">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-[#4f7c65]">Information</p>
                <h3 className="mt-2 text-3xl font-black text-slate-900">INFORMATION</h3>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e7f9ec] text-xl text-[#0f8f4a]">i</div>
            </div>

            <ul className="space-y-3 text-sm text-slate-700">
              <li>1. Inscrivez-vous maintenant et recevez 500 FCFA gratuitement.</li>
              <li>2. Invitez vos amis à investir et gagnez 25% / 3% / 2% sur 3 niveaux.</li>
              <li>3. Les rendements sont versés automatiquement chaque jour pendant 180 jours.</li>
              <li>4. Investissez dès 2 000 FCFA et commencez à gagner dès le lendemain.</li>
            </ul>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => {
                  setShowPopup(false);
                  window.localStorage.setItem('total-energie-popup-seen', 'true');
                }}
                className="flex-1 rounded-full bg-[#0f8f4a] px-5 py-3 text-sm font-bold text-white"
              >
                D&apos;accord
              </button>
              <a href={state.settings.telegramLink} target="_blank" rel="noreferrer" className="flex-1 rounded-full bg-[#1d4ed8] px-5 py-3 text-center text-sm font-bold text-white">
                Telegram
              </a>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
      <p className="text-[10px] uppercase tracking-[0.24em] text-[#d7f5e1]">{label}</p>
      <p className="mt-3 text-3xl font-black text-white">{value}</p>
    </div>
  );
}
