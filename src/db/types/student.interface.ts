export default interface IStudent {
  id: number;
  first_name: string;
  last_name: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  account_type: string;
  push: boolean;
  email_notification: boolean;
  sms: boolean;
  created_at: Date;
  updated_at: Date;
}
