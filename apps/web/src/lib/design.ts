import { domainAccentVar } from '@guap/design';
import { useMemo } from 'react';

export type AccentDomain =
  | 'dashboard'
  | 'earn'
  | 'save'
  | 'invest'
  | 'spend'
  | 'donate'
  | 'automations'
  | 'learn';

export function getAccentColorVar(domain: AccentDomain) {
  return domainAccentVar(domain);
}

export function useAccentColor(domain: AccentDomain) {
  return useMemo(() => ({ color: domainAccentVar(domain) }), [domain]);
}
