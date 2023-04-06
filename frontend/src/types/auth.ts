interface AuthType {
  id: number;
  uid: string;
  identifier: string;
  auth_type: string;
  username: string;
  created_at?: Date;
}

export type { AuthType };