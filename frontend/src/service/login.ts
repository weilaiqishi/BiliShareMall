import type { LoginAPI } from '@types/login.ts';
import { request } from './request';

export function getLoginKeyAndUrl(data: LoginAPI.GetLoginQRCodeRequest) {
  return request.post<LoginAPI.GetLoginQRCodeResponse>('/login/qr', data);
}

export function verifyLogin(data: LoginAPI.VerifyLoginStatusRequest) {
  return request.post<LoginAPI.VerifyLoginStatusResponse>('/login/verify', data);
}