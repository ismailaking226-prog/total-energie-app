import Link from 'next/link';
import { defaultState, type AppState } from '@/lib/site-data';

export default function HistoryDepositsPage() {
  const state = defaultState as AppState;
  const approvedDeposits = state.requests.filter((request) => request.type === 'deposit' && request.status === 'approved');

  return (
    <main className="min-h-screen bg-[#f5f7f5] px-4 py-8 text-slate-800 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-[#4f7c65]">Historique</p>
            <h1 className="mt-2 text-3xl font-black text-slate-900">Dépôts</h1>
          </div>
          <Link href="/depot" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">Retour dépôt</Link>
        </div>

        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-soft">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[#f8faf9] text-slate-600">
              <tr>
                <th className="px-4 py-4 font-semibold">Nom</th>
                <th className="px-4 py-4 font-semibold">Montant</th>
                <th className="px-4 py-4 font-semibold">Réseau</th>
                <th className="px-4 py-4 font-semibold">Pays</th>
                <th className="px-4 py-4 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody>
              {approvedDeposits.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-500">Aucun dépôt validé.</td></tr>
              ) : (
                approvedDeposits.map((item) => (
                  <tr key={item.id} className="border-t border-slate-100">
                    <td className="px-4 py-4 font-semibold">{item.userName}</td>
                    <td className="px-4 py-4 text-[#0f8f4a] font-bold">{item.amount.toLocaleString('fr-FR')} FCFA</td>
                    <td className="px-4 py-4">{item.network}</td>
                    <td className="px-4 py-4">{item.country}</td>
                    <td className="px-4 py-4">{new Date(item.date).toLocaleString('fr-FR')}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
