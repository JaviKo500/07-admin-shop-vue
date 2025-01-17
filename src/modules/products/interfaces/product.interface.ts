import type { User } from '@/modules/auth/interfaces/user.interface';

export interface Product {
  id:          string;
  title:       string;
  price:       number;
  description: string;
  slug:        string;
  stock:       number;
  sizes:       Size[];
  gender:      string;
  tags:        string[];
  images:      string[];
  user:        User;
}

export enum Size {
  XS = 'XS',
  S  = 'S',
  M  = 'M',
  L  = 'L',
  XL = 'XL',
  XXL= 'XXL',
}


