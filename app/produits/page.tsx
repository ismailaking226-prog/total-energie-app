import Image from 'next/image';
import Link from 'next/link';
import { products } from '@/lib/site-data';

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-[#f4f6f3] px-4 py-10 text-slate-800 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-[#4f7c65]">Investissement</p>
            <h1 className="mt-2 text-3xl font-black text-slate-900">Produits 180 jours</h1>
          </div>
          <Link href="/" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">Accueil</Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {products.map((product) => (
            <div key={product.id} className="overflow-hidden rounded-[28px] border border-slate-200 bg-white p-4 shadow-soft">
              <div className="overflow-hidden rounded-[20px] border border-slate-200">
                <Image src={product.image} alt={product.title} width={480} height={320} className="h-52 w-full object-cover" />
              </div>
              <div className="mt-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#5d9a7f]">Plan</p>
                <h2 className="mt-2 text-2xl font-black text-slate-900">{product.title}</h2>
              </div>
              <div className="mt-5 space-y-2 text-sm text-slate-600">
                <div className="flex items-center justify-between"><span>Retour quotidien</span><span className="font-bold text-[#0f8f4a]">{product.dailyReturn.toLocaleString('fr-FR')} FCFA</span></div>
                <div className="flex items-center justify-between"><span>Retour total</span><span className="font-bold">{product.totalReturn.toLocaleString('fr-FR')} FCFA</span></div>
                <div className="flex items-center justify-between"><span>Montant minimum</span><span className="font-bold">{product.minInvestment.toLocaleString('fr-FR')} FCFA</span></div>
              </div>
              <Link href="/depot" className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-[#0f8f4a] px-5 py-3 text-sm font-bold text-white">
                Investir dans ce plan
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
