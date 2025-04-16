export interface User {
  id: number;
  username: string;
  email: string;
  nombre: string;
  apellidos: string;
  rol: string;
  created_at?: string;
  last_login?: string;
}
