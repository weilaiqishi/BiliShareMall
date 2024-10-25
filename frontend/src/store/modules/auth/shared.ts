import { localStg } from '@/utils/storage';

/** Get token */
export function getToken() {
  return localStg.get('cookies') || '';
}

/** Clear auth storage */
export function clearAuthStorage() {
  localStg.remove('cookies');
  localStg.remove('refreshToken');
}
