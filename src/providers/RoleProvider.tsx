import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type Role = 'admin' | 'manager' | 'agent' | 'specialist';

export const ROLE_LABEL: Record<Role, string> = {
  admin: 'Admin',
  manager: 'Agent Manager',
  agent: 'Agent',
  specialist: 'Specialist',
};

export const ROLE_DESCRIPTION: Record<Role, string> = {
  admin: 'Full access · system controls',
  manager: 'Team metrics · agent oversight',
  agent: 'Standard servicing actions',
  specialist: 'Specialized workflows · disputes & fraud',
};

type Permission =
  | 'closeAccount'
  | 'creditLineIncrease'
  | 'logDispute'
  | 'overrideHold'
  | 'viewTeamMetrics'
  | 'manageAgents';

const PERMISSIONS: Record<Role, Permission[]> = {
  admin: [
    'closeAccount',
    'creditLineIncrease',
    'logDispute',
    'overrideHold',
    'viewTeamMetrics',
    'manageAgents',
  ],
  manager: ['closeAccount', 'creditLineIncrease', 'logDispute', 'viewTeamMetrics', 'manageAgents'],
  agent: ['logDispute'],
  specialist: ['logDispute', 'overrideHold', 'creditLineIncrease'],
};

type RoleContextValue = {
  role: Role;
  setRole: (r: Role) => void;
  can: (p: Permission) => boolean;
};

const RoleContext = createContext<RoleContextValue | null>(null);
const STORAGE_KEY = 'ember.role.v1';

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>(() => {
    const r = localStorage.getItem(STORAGE_KEY) as Role | null;
    return r && r in PERMISSIONS ? r : 'agent';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, role);
  }, [role]);

  return (
    <RoleContext.Provider
      value={{
        role,
        setRole,
        can: (p) => PERMISSIONS[role].includes(p),
      }}
    >
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error('useRole must be used within RoleProvider');
  return ctx;
}
