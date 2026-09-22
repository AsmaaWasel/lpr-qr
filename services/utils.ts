import { jwtDecode } from "jwt-decode";

export interface JwtPayload {
  sub: string;
  type: string; // أو role لو الباك غير الاسم
  exp: number;
}

export const getUserFromToken = (token: string): JwtPayload => {
  return jwtDecode<JwtPayload>(token);
};
