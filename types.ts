export enum UserRole {
  CLIENT = 'CLIENT',
  ADMIN = 'ADMIN'
}

export enum SubscriptionTier {
  FREE = 'FREE',
  BRONZE = 'BRONZE',
  SILVER = 'SILVER',
  GOLD = 'GOLD'
}

export interface Transaction {
  id: string;
  date: string;
  points: number;
  type: 'PURCHASE' | 'REDEEM' | 'BONUS' | 'REFERRAL';
  description: string;
}

export interface PendingReferral {
  id: string;
  name: string;
  phone: string;
  date: string;
}

export interface User {
  id: string;
  username: string;
  password?: string;
  role: UserRole;
  points: number;
  tier: SubscriptionTier;
  pendingTier?: SubscriptionTier; // New field for pending approvals
  pendingPurchase?: boolean; // New field for pending purchase confirmation
  pendingReferrals?: PendingReferral[]; // New field for pending referrals
  
  // Registration Details
  cpf: string;
  fullName: string;
  email: string;
  phone: string;
  address: {
    street: string;
    number: string;
    complement?: string;
    district: string;
    city: string;
    uf: string;
    cep: string;
  };
  
  history: Transaction[];
  joinDate: string;
}

export interface Reward {
  pointsRequired: number;
  title: string;
  description: string;
  icon: string;
}

export const REWARDS: Reward[] = [
  { pointsRequired: 100, title: 'Película de Brinde', description: 'Proteja seu celular', icon: 'smartphone' },
  { pointsRequired: 200, title: 'Cabo Celular', description: 'Carregamento rápido', icon: 'cable' },
  { pointsRequired: 300, title: 'Carregador', description: 'Fonte de energia', icon: 'zap' },
  { pointsRequired: 400, title: 'Fone Bluetooth', description: 'Música sem fios', icon: 'headphones' },
  { pointsRequired: 500, title: 'R$50 de Desconto', description: 'Na sua compra atual ou próxima', icon: 'percent' },
];

export const TIERS = {
  [SubscriptionTier.FREE]: { price: 0, discount: 0, bonusPoints: 0, name: 'Gratuito', color: 'bg-gray-100' },
  [SubscriptionTier.BRONZE]: { price: 9.99, discount: 2, bonusPoints: 10, name: 'Cliente Bronze', color: 'bg-amber-700 text-white' },
  [SubscriptionTier.SILVER]: { price: 19.99, discount: 4, bonusPoints: 20, name: 'Cliente Prata', color: 'bg-slate-400 text-white' },
  [SubscriptionTier.GOLD]: { price: 39.99, discount: 7, bonusPoints: 30, name: 'Cliente Ouro', color: 'bg-yellow-500 text-white' },
};