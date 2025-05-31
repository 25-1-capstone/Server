export interface UserModel {
  id: bigint;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date | null;
  status: number;
}
