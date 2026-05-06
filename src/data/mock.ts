import type { Customer, Account, Transaction, Case, ActivityEvent } from './types';

const daysAgo = (n: number) => new Date(Date.now() - n * 86400000).toISOString();

export const customers: Customer[] = [
  {
    id: 'cust_001',
    type: 'consumer',
    name: 'Jane Sutter',
    dob: '1986-04-12',
    email: 'jane.sutter@example.com',
    phone: '+1 (415) 555-0142',
    address: { street: '218 Pine St', city: 'San Francisco', state: 'CA', zip: '94104' },
    flags: ['high-value'],
    joinedAt: '2014-09-22',
    lastContact: daysAgo(3),
    segment: 'Preferred',
  },
  {
    id: 'cust_002',
    type: 'consumer',
    name: 'Marcus Chen',
    dob: '1992-11-30',
    email: 'mchen92@example.com',
    phone: '+1 (206) 555-0188',
    address: { street: '4112 Greenwood Ave', city: 'Seattle', state: 'WA', zip: '98103' },
    flags: ['fraud-watch'],
    joinedAt: '2019-03-04',
    lastContact: daysAgo(0),
    segment: 'Standard',
  },
  {
    id: 'cust_003',
    type: 'consumer',
    name: 'Diane Okafor',
    dob: '1971-06-08',
    email: 'd.okafor@example.com',
    phone: '+1 (312) 555-0173',
    address: { street: '78 W Lake St', city: 'Chicago', state: 'IL', zip: '60601' },
    flags: [],
    joinedAt: '2002-11-15',
    lastContact: daysAgo(28),
    segment: 'Private Client',
  },
  {
    id: 'cust_004',
    type: 'consumer',
    name: 'Tomás Rivera',
    dob: '1998-02-19',
    email: 't.rivera@example.com',
    phone: '+1 (512) 555-0196',
    address: { street: '906 E 6th St', city: 'Austin', state: 'TX', zip: '78702' },
    flags: ['delinquent-30'],
    joinedAt: '2022-07-11',
    lastContact: daysAgo(1),
    segment: 'Standard',
  },
  {
    id: 'cust_005',
    type: 'consumer',
    name: 'Priya Patel',
    dob: '1989-09-04',
    email: 'priya.p@example.com',
    phone: '+1 (646) 555-0124',
    address: { street: '2201 Adam Clayton Powell Jr Blvd', city: 'New York', state: 'NY', zip: '10027' },
    flags: [],
    joinedAt: '2017-05-30',
    lastContact: daysAgo(7),
    segment: 'Preferred',
  },
  {
    id: 'cust_006',
    type: 'consumer',
    name: 'Henry Walsh',
    dob: '1955-12-21',
    email: 'hwalsh55@example.com',
    phone: '+1 (617) 555-0119',
    address: { street: '14 Beacon St', city: 'Boston', state: 'MA', zip: '02108' },
    flags: ['accessibility-large-text'],
    joinedAt: '1998-01-09',
    lastContact: daysAgo(14),
    segment: 'Private Client',
  },
  {
    id: 'cust_007',
    type: 'business',
    name: 'Esposito Hardware LLC',
    legalName: 'Esposito Hardware LLC',
    einLast4: '4421',
    email: 'ap@espositohardware.com',
    phone: '+1 (215) 555-0167',
    address: { street: '1820 S Broad St', city: 'Philadelphia', state: 'PA', zip: '19145' },
    flags: [],
    joinedAt: '2010-04-18',
    lastContact: daysAgo(2),
    segment: 'Business · Mid-Market',
  },
  {
    id: 'cust_008',
    type: 'business',
    name: 'Bluefin Studio',
    legalName: 'Bluefin Studio Inc',
    einLast4: '8812',
    email: 'finance@bluefin.studio',
    phone: '+1 (503) 555-0133',
    address: { street: '900 SE Division St', city: 'Portland', state: 'OR', zip: '97202' },
    flags: ['new-account'],
    joinedAt: '2024-08-02',
    lastContact: daysAgo(5),
    segment: 'Business · Small',
  },
  {
    id: 'cust_009',
    type: 'consumer',
    name: 'Amelia Brooks',
    dob: '1983-07-27',
    email: 'a.brooks@example.com',
    phone: '+1 (305) 555-0150',
    address: { street: '601 Brickell Key Dr', city: 'Miami', state: 'FL', zip: '33131' },
    flags: ['joint-account'],
    joinedAt: '2008-10-12',
    lastContact: daysAgo(11),
    segment: 'Preferred',
  },
  {
    id: 'cust_010',
    type: 'consumer',
    name: 'Devon Mills',
    dob: '1995-03-15',
    email: 'devon.m@example.com',
    phone: '+1 (720) 555-0181',
    address: { street: '1330 Champa St', city: 'Denver', state: 'CO', zip: '80204' },
    flags: ['hardship-program'],
    joinedAt: '2020-12-01',
    lastContact: daysAgo(0),
    segment: 'Standard',
  },
];

export const accounts: Account[] = [
  // cust_001 — Jane: banking + card
  { id: 'acc_001', customerId: 'cust_001', lob: 'banking', nickname: 'Everyday Checking', productName: '360 Checking', mask: '4218', status: 'open', balance: 12480.55, available: 12480.55, openedAt: '2014-09-22' },
  { id: 'acc_002', customerId: 'cust_001', lob: 'banking', nickname: 'High-yield Savings', productName: '360 Performance Savings', mask: '7791', status: 'open', balance: 48210.10, available: 48210.10, openedAt: '2018-02-14' },
  { id: 'acc_003', customerId: 'cust_001', lob: 'card', nickname: 'Venture X', productName: 'Venture X Rewards', mask: '0091', status: 'open', balance: 1240.18, available: 18759.82, apr: 22.99, rewardsBalance: 84210, paymentDue: { amount: 250, date: daysAgo(-12) }, openedAt: '2020-06-08' },
  // cust_002 — Marcus: card only
  { id: 'acc_004', customerId: 'cust_002', lob: 'card', nickname: 'Quicksilver', productName: 'Quicksilver Cash Rewards', mask: '5512', status: 'restricted', balance: 980.40, available: 4019.60, apr: 26.49, rewardsBalance: 12450, paymentDue: { amount: 120, date: daysAgo(-3) }, openedAt: '2019-03-10' },
  // cust_003 — Diane: banking + auto + card
  { id: 'acc_005', customerId: 'cust_003', lob: 'banking', nickname: 'Joint Checking', productName: '360 Checking', mask: '3022', status: 'open', balance: 8420.00, available: 8420.00, openedAt: '2002-11-15' },
  { id: 'acc_006', customerId: 'cust_003', lob: 'auto', nickname: '2023 Subaru Outback', productName: 'Auto Loan', mask: '6611', status: 'open', balance: 18420.00, apr: 5.49, paymentDue: { amount: 412.55, date: daysAgo(-8) }, openedAt: '2023-04-02' },
  { id: 'acc_007', customerId: 'cust_003', lob: 'card', nickname: 'Savor', productName: 'Savor Rewards', mask: '8843', status: 'open', balance: 312.21, available: 9687.79, apr: 19.99, rewardsBalance: 6210, paymentDue: { amount: 75, date: daysAgo(-20) }, openedAt: '2015-09-22' },
  // cust_004 — Tomás: card delinquent
  { id: 'acc_008', customerId: 'cust_004', lob: 'card', nickname: 'Platinum', productName: 'Platinum Mastercard', mask: '9911', status: 'delinquent', balance: 2840.13, available: 159.87, apr: 28.99, paymentDue: { amount: 145, date: daysAgo(34) }, openedAt: '2022-07-11' },
  // cust_005 — Priya: banking + card
  { id: 'acc_009', customerId: 'cust_005', lob: 'banking', nickname: 'Checking', productName: '360 Checking', mask: '1184', status: 'open', balance: 4290.55, available: 4290.55, openedAt: '2017-05-30' },
  { id: 'acc_010', customerId: 'cust_005', lob: 'card', nickname: 'Venture', productName: 'Venture Rewards', mask: '7720', status: 'open', balance: 612.40, available: 8387.60, apr: 24.49, rewardsBalance: 32100, paymentDue: { amount: 95, date: daysAgo(-5) }, openedAt: '2018-08-19' },
  // cust_006 — Henry: banking + auto
  { id: 'acc_011', customerId: 'cust_006', lob: 'banking', nickname: 'Retirement Savings', productName: '360 Performance Savings', mask: '0028', status: 'open', balance: 285410.00, available: 285410.00, openedAt: '1998-01-09' },
  { id: 'acc_012', customerId: 'cust_006', lob: 'auto', nickname: '2022 Lexus RX', productName: 'Auto Loan', mask: '4467', status: 'open', balance: 9240.00, apr: 4.25, paymentDue: { amount: 528.10, date: daysAgo(-15) }, openedAt: '2022-02-14' },
  // cust_007 — Esposito Hardware: SB + card
  { id: 'acc_013', customerId: 'cust_007', lob: 'sb', nickname: 'Operating Account', productName: 'Spark Business Checking', mask: '2210', status: 'open', balance: 84210.00, available: 84210.00, openedAt: '2010-04-18' },
  { id: 'acc_014', customerId: 'cust_007', lob: 'card', nickname: 'Spark Cash Plus', productName: 'Spark Cash Plus', mask: '6644', status: 'open', balance: 12480.50, available: 37519.50, apr: 21.99, rewardsBalance: 158400, paymentDue: { amount: 1240, date: daysAgo(-9) }, openedAt: '2014-06-12' },
  // cust_008 — Bluefin Studio: SB
  { id: 'acc_015', customerId: 'cust_008', lob: 'sb', nickname: 'Operating', productName: 'Spark Business Checking', mask: '5510', status: 'open', balance: 14280.00, available: 14280.00, openedAt: '2024-08-02' },
  // cust_009 — Amelia: banking + card + auto
  { id: 'acc_016', customerId: 'cust_009', lob: 'banking', nickname: 'Joint Checking', productName: '360 Checking', mask: '8893', status: 'open', balance: 21420.00, available: 21420.00, openedAt: '2008-10-12' },
  { id: 'acc_017', customerId: 'cust_009', lob: 'card', nickname: 'Venture X', productName: 'Venture X Rewards', mask: '4421', status: 'open', balance: 4218.50, available: 25781.50, apr: 22.99, rewardsBalance: 124500, paymentDue: { amount: 420, date: daysAgo(-11) }, openedAt: '2012-04-01' },
  { id: 'acc_018', customerId: 'cust_009', lob: 'auto', nickname: '2024 Tesla Model Y', productName: 'Auto Loan', mask: '0092', status: 'open', balance: 41240.00, apr: 6.49, paymentDue: { amount: 712.40, date: daysAgo(-6) }, openedAt: '2024-02-01' },
  // cust_010 — Devon: card hardship
  { id: 'acc_019', customerId: 'cust_010', lob: 'card', nickname: 'Quicksilver', productName: 'Quicksilver Cash Rewards', mask: '3340', status: 'open', balance: 1840.20, available: 1159.80, apr: 26.49, paymentDue: { amount: 50, date: daysAgo(-2) }, openedAt: '2020-12-01' },
];

const txnDescriptions = [
  'STARBUCKS #4112',
  'WHOLE FOODS MKT',
  'AMAZON.COM',
  'SHELL OIL',
  'NETFLIX.COM',
  'UNITED AIRLINES',
  'TRADER JOE\'S',
  'APPLE.COM/BILL',
  'BLUEROCK SUBSCRIPTIONS',
  'TARGET T-2204',
  'DELTA AIR LINES',
  'UBER TRIP',
  'CVS/PHARMACY',
  'HOME DEPOT',
  'PAYROLL DEPOSIT',
];

export const transactions: Transaction[] = accounts.flatMap((acc) => {
  if (acc.lob === 'auto') return [];
  return Array.from({ length: 14 }, (_, i) => {
    const desc = txnDescriptions[(i + acc.id.charCodeAt(4)) % txnDescriptions.length];
    const isDeposit = desc === 'PAYROLL DEPOSIT';
    const amt = isDeposit ? 2400 + (i * 12) : -(8 + (i * 7) + (acc.id.charCodeAt(5) % 50));
    return {
      id: `txn_${acc.id}_${i}`,
      accountId: acc.id,
      date: daysAgo(i),
      description: desc,
      amount: Math.round(amt * 100) / 100,
      category: isDeposit ? 'Income' : 'Discretionary',
      status: i === 0 ? 'pending' : 'posted',
    } satisfies Transaction;
  });
});

export const cases: Case[] = [
  { id: 'case_001', customerId: 'cust_002', accountId: 'acc_004', title: 'Disputed charge — BLUEROCK $89.40', status: 'open', priority: 'medium', openedAt: daysAgo(0), updatedAt: daysAgo(0), owner: 'You', category: 'Dispute' },
  { id: 'case_002', customerId: 'cust_004', accountId: 'acc_008', title: 'Hardship review request', status: 'pending', priority: 'high', openedAt: daysAgo(2), updatedAt: daysAgo(1), owner: 'Diaz, M.', category: 'Servicing' },
  { id: 'case_003', customerId: 'cust_007', accountId: 'acc_013', title: 'Add user · permission escalation', status: 'open', priority: 'high', openedAt: daysAgo(0), updatedAt: daysAgo(0), owner: 'You', category: 'Access' },
  { id: 'case_004', customerId: 'cust_001', accountId: 'acc_003', title: 'Travel notice — Europe 6/12-6/24', status: 'resolved', priority: 'low', openedAt: daysAgo(7), updatedAt: daysAgo(6), owner: 'Auto-system', category: 'Travel' },
  { id: 'case_005', customerId: 'cust_009', accountId: 'acc_017', title: 'Credit line increase request', status: 'pending', priority: 'medium', openedAt: daysAgo(3), updatedAt: daysAgo(1), owner: 'Underwriting', category: 'CLI' },
  { id: 'case_006', customerId: 'cust_010', accountId: 'acc_019', title: 'Payment plan enrollment', status: 'open', priority: 'medium', openedAt: daysAgo(0), updatedAt: daysAgo(0), owner: 'You', category: 'Hardship' },
  { id: 'case_007', customerId: 'cust_003', accountId: 'acc_006', title: 'Lien release request', status: 'escalated', priority: 'low', openedAt: daysAgo(12), updatedAt: daysAgo(2), owner: 'Title team', category: 'Auto · Title' },
];

export const activity: ActivityEvent[] = [
  { id: 'ev_001', customerId: 'cust_001', accountId: 'acc_001', timestamp: daysAgo(0), channel: 'mobile', actor: 'Customer', description: 'Logged in', device: 'iPhone 15 · iOS 18.2' },
  { id: 'ev_002', customerId: 'cust_001', accountId: 'acc_001', timestamp: daysAgo(0), channel: 'mobile', actor: 'Customer', description: 'Viewed transactions' },
  { id: 'ev_003', customerId: 'cust_001', accountId: 'acc_003', timestamp: daysAgo(1), channel: 'web', actor: 'Customer', description: 'Updated payment method', device: 'Chrome · macOS' },
  { id: 'ev_004', customerId: 'cust_002', accountId: 'acc_004', timestamp: daysAgo(0), channel: 'agent', actor: 'AI Assistant', description: 'Drafted dispute response (awaiting agent review)' },
  { id: 'ev_005', customerId: 'cust_002', accountId: 'acc_004', timestamp: daysAgo(0), channel: 'ivr', actor: 'Customer', description: 'Failed PIN attempt × 2' },
  { id: 'ev_006', customerId: 'cust_004', accountId: 'acc_008', timestamp: daysAgo(34), channel: 'system', actor: 'System', description: 'Account marked delinquent (30+ days)' },
  { id: 'ev_007', customerId: 'cust_007', accountId: 'acc_013', timestamp: daysAgo(2), channel: 'web', actor: 'admin@espositohardware.com', description: 'Invited user mike@espositohardware.com' },
  { id: 'ev_008', customerId: 'cust_009', accountId: 'acc_018', timestamp: daysAgo(5), channel: 'mobile', actor: 'Customer', description: 'Set up autopay' },
];

export function getCustomer(id: string) {
  return customers.find((c) => c.id === id);
}
export function getAccount(id: string) {
  return accounts.find((a) => a.id === id);
}
export function getCustomerAccounts(customerId: string) {
  return accounts.filter((a) => a.customerId === customerId);
}
export function getAccountTransactions(accountId: string) {
  return transactions.filter((t) => t.accountId === accountId);
}
export function getCustomerCases(customerId: string) {
  return cases.filter((c) => c.customerId === customerId);
}
export function getCustomerActivity(customerId: string) {
  return activity.filter((a) => a.customerId === customerId);
}
