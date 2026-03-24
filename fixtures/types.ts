export type UserData = {
  description: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  postcode: string;
  country: string;
  zone: string;
  expectedErrors: Partial<Record<string, string>> | null;
};