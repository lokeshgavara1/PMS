export interface IAuthProvider {
  authenticate(email: string, password: string): Promise<{ id: number; email: string; name: string; system_role: string }>;
  validateToken(token: string): Promise<boolean>;
}
