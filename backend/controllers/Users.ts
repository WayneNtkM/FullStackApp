import Users from "../models/UserModel";
import bcrypt from 'bcrypt';
import jwt, { Secret } from 'jsonwebtoken';
import { Request, Response } from 'express';
import { User } from '../types/sequelizeTypes';

export const getUsers = async (_req: Request, res: Response) => {
  try {
    const [users] = await Users.findAll({
      attributes: ['id', 'name', 'email'],
    });
    res.json(users);
  } catch (error) {
    console.log(error);
  }
};

export const Register = async (req: Request, res: Response) => {
  const { name, email, password, confPassword } = req.body;

  if (password !== confPassword) return res.status(400)
    .json({ msg: 'Password and Confirm Password do not match.' });
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);
  try {
    await Users.create({
      name: name,
      email: email,
      password: hashPassword,
    });
    res.json({ msg: 'Registration Successful' });
  } catch (error) {
    console.log(error);
  }
};

export const Login = async(req: Request, res: Response) => {
  try {
    const [user] = await Users.findAll({
      where: {
        email: req.body.email,
      },
    }) as User[];
    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) return res.status(400).json({ msg: 'Wrong Password.' });
    const userId = user.id;
    const name = user.name;
    const email = user.email;
    const accessToken = jwt.sign({ userId, name, email }, process.env.ACCESS_TOKEN_SECRET as Secret, {
      expiresIn: '15s',
    });
    const refreshToken = jwt.sign({ userId, name, email }, process.env.REFRESH_TOKEN_SECRET as Secret, {
      expiresIn: '1d',
    });
    await Users.update({ refresh_token: refreshToken }, {
      where: {
         id: userId,
      }
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    return res.json({ accessToken });
  } catch (error) {
    return res.status(404).json({ msg: 'e-mail not found.' });
  }
};

export const Logout = async(req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);
  const [user] = await Users.findAll({
    where: {
      refresh_token: refreshToken,
    },
  }) as User[];
  if (!user) return res.sendStatus(204);
  const userId = user.id;
  await Users.update({ refresh_token: null }, {
    where: {
      id: userId,
    },
  });
  res.clearCookie('refreshToken');
  return res.sendStatus(200);
};

// Domain-Driven Design livro
// Rodrigo Manguinho
