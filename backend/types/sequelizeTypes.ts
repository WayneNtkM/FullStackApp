import { VerifyOptions } from 'jsonwebtoken';
import { Model } from 'sequelize';

export interface User extends Model {
  id: number;
  name: string;
  email: string;
  password: string;
};

export interface Decoded extends VerifyOptions {
  userId: number;
  email: string;
  name: string;
};
