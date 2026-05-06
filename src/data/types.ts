export type LOB = 'banking' | 'card' | 'auto' | 'sb';

export const LOB_LABEL: Record<LOB, string> = {
  banking: 'Banking',
  card: 'Credit Card',
  auto: 'Auto Loan',
  sb: 'Small Business',
};

export type AccountStatus = 'open' | 'restricted' | 'delinquent' | 'closed';

export type Account = {
  id: string;
  customerId: string;
  lob: LOB;
  nickname: string;
  productName: string;
  mask: string;
  status: AccountStatus;
  balance: number;
  available?: number;
  apr?: number;
  rewardsBalance?: number;
  paymentDue?: { amount: number; date: string };
  openedAt: string;
};

export type Transaction = {
  id: string;
  accountId: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  status: 'posted' | 'pending';
};

export type Address = {
  street: string;
  city: string;
  state: string;
  zip: string;
};

export type Customer = {
  id: string;
  type: 'consumer' | 'business';
  name: string;
  legalName?: string;
  dob?: string;
  einLast4?: string;
  email: string;
  phone: string;
  address: Address;
  flags: string[];
  joinedAt: string;
  lastContact?: string;
  segment?: string;
};

export type Case = {
  id: string;
  customerId: string;
  accountId?: string;
  title: string;
  status: 'open' | 'pending' | 'resolved' | 'escalated';
  priority: 'low' | 'medium' | 'high';
  openedAt: string;
  updatedAt: string;
  owner?: string;
  category: string;
};

export type ActivityEvent = {
  id: string;
  customerId: string;
  accountId?: string;
  timestamp: string;
  channel: 'web' | 'mobile' | 'ivr' | 'agent' | 'system';
  actor: string;
  description: string;
  device?: string;
};
