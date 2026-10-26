import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Total Énergie',
  description: 'Plateforme d’investissement Total Énergie en FCFA'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
