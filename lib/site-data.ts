export type Country = 'Bénin' | 'Cameroun' | 'Côte d’Ivoire' | 'Burkina Faso' | 'Niger';

export type Product = {
  id: string;
  title: string;
  dailyReturn: number;
  totalReturn: number;
  minInvestment: number;
  image: string;
};

export type InvestmentItem = {
  id: string;
  productId: string;
  productName: string;
  amount: number;
  dailyGain: number;
  startedAt: string;
  lastCreditAt: string;
};

export type RequestItem = {
  id: string;
  type: 'deposit' | 'withdrawal';
  userId: string;
  userName: string;
  amount: number;
  network?: string;
  phone: string;
  country: Country;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
  proof?: string;
};

export type UserProfile = {
  id: string;
  name: string;
  phone: string;
  country: Country;
  balance: number;
  referralCount: number;
  investments: InvestmentItem[];
};

export type AppState = {
  settings: {
    paymentLink: string;
    telegramLink: string;
    referral: { level1: number; level2: number; level3: number };
    countries: Country[];
  };
  users: UserProfile[];
  requests: RequestItem[];
};

export const products: Product[] = [
  { id: 'plan-2000', title: '2 000 FCFA', dailyReturn: 300, totalReturn: 54000, minInvestment: 2000, image: '/images/plan-2000.svg' },
  { id: 'plan-5000', title: '5 000 FCFA', dailyReturn: 800, totalReturn: 144000, minInvestment: 5000, image: '/images/plan-5000.svg' },
  { id: 'plan-15000', title: '15 000 FCFA', dailyReturn: 2400, totalReturn: 432000, minInvestment: 15000, image: '/images/plan-15000.svg' },
  { id: 'plan-35000', title: '35 000 FCFA', dailyReturn: 5600, totalReturn: 1008000, minInvestment: 35000, image: '/images/plan-35000.svg' },
  { id: 'plan-50000', title: '50 000 FCFA', dailyReturn: 8500, totalReturn: 1530000, minInvestment: 50000, image: '/images/plan-50000.svg' },
  { id: 'plan-100000', title: '100 000 FCFA', dailyReturn: 17000, totalReturn: 3060000, minInvestment: 100000, image: '/images/plan-100000.svg' },
  { id: 'plan-250000', title: '250 000 FCFA', dailyReturn: 45000, totalReturn: 8100000, minInvestment: 250000, image: '/images/plan-250000.svg' }
];

export const defaultState: AppState = {
  settings: {
    paymentLink: 'https://payliv.shop/pay/plv_rkermm7f-',
    telegramLink: 'https://t.me/+74TGsMBlIwwyYTI0',
    referral: { level1: 25, level2: 3, level3: 2 },
    countries: ['Bénin', 'Cameroun', 'Côte d’Ivoire', 'Burkina Faso', 'Niger']
  },
  users: [
    {
      id: 'user-001',
      name: 'Amina Kone',
      phone: '67000000',
      country: 'Côte d’Ivoire',
      balance: 250000,
      referralCount: 8,
      investments: [
        { id: 'inv-001', productId: 'plan-5000', productName: '5 000 FCFA', amount: 5000, dailyGain: 800, startedAt: '2025-09-15T08:00:00.000Z', lastCreditAt: new Date().toISOString() }
      ]
    },
    {
      id: 'user-002',
      name: 'Yacouba Sani',
      phone: '65512345',
      country: 'Niger',
      balance: 175000,
      referralCount: 3,
      investments: [
        { id: 'inv-002', productId: 'plan-15000', productName: '15 000 FCFA', amount: 15000, dailyGain: 2400, startedAt: '2025-09-18T08:00:00.000Z', lastCreditAt: new Date().toISOString() }
      ]
    },
    {
      id: 'user-003',
      name: 'Sérgio Bia',
      phone: '64599888',
      country: 'Burkina Faso',
      balance: 480000,
      referralCount: 5,
      investments: [
        { id: 'inv-003', productId: 'plan-35000', productName: '35 000 FCFA', amount: 35000, dailyGain: 5600, startedAt: '2025-09-10T07:00:00.000Z', lastCreditAt: new Date().toISOString() }
      ]
    }
  ],
  requests: [
    { id: 'req-001', type: 'deposit', userId: 'user-001', userName: 'Amina Kone', amount: 20000, network: 'Orange Money', phone: '67000000', country: 'Côte d’Ivoire', status: 'pending', date: '2025-10-16T09:00:00.000Z', proof: 'depot-1' },
    { id: 'req-002', type: 'withdrawal', userId: 'user-002', userName: 'Yacouba Sani', amount: 12000, network: 'Moov Money', phone: '65512345', country: 'Niger', status: 'pending', date: '2025-10-17T11:00:00.000Z' },
    { id: 'req-003', type: 'deposit', userId: 'user-003', userName: 'Sérgio Bia', amount: 50000, network: 'Wave', phone: '64599888', country: 'Burkina Faso', status: 'approved', date: '2025-10-18T14:00:00.000Z' }
  ]
};
