export default interface IAdmin {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  permissions: string;
  account_type: string;
  created_at: Date;
  updated_at: Date;
}
