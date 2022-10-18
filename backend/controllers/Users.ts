import Users from "../models/UserModel";
import bcrypt from 'bcrypt';
import jwt, { Secret } from 'jsonwebtoken';

interface test extends Array<any> {
    id: number,
    email: string,
    password: string,
    name: string,
};

export const getUsers = async(req: Request, res: { json: (arg0: any) => void; }) => {
  try {
    const [users] = await Users.findAll({
      attributes: ['id', 'name', 'email'],
    });
    res.json(users);
  } catch (error) {
    console.log(error);
  }
};

export const Register = async (req: { body: { name: any; email: any; password: any; confPassword: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { msg: string; }): any; new(): any; }; }; json: (arg0: { msg: string; }) => void; }) => {
  const { name, email, password, confPassword } = req.body;

  if (password !== confPassword) return res.status(400)
    .json({ msg: 'Passwordand Confirm Password do not match.' });
  const salt: any = await bcrypt.genSalt();
  const hashPassword: any = await bcrypt.hash(password, salt);
  console.log('Senha hash', await hashPassword);
  try {
    await Users.create({
      name: name,
      email: email,
      password: await hashPassword,
    });
    res.json({ msg: 'Registration Successful' });
  } catch (error) {
    // console.log(error);
  }
};

export const Login = async(req: { body: { email: any; password: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { msg: string; }): void; new(): any; }; }; cookie: (arg0: string, arg1: any, arg2: { httpOnly: boolean; maxAge: number; }) => void; json: (arg0: { accessToken: any; }) => void; }) => {
  try {
    const [user]: any = await Users.findAll({
      where: {
        email: req.body.email,
      },
    });
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
    res.json({ accessToken });
  } catch (error) {
    res.status(404).json({ msg: 'e-mail not found.' });
  }
};

export const Logout = async(req: { cookies: { refreshToken: any; }; }, res: { sendStatus: (arg0: number) => any; clearCookie: (arg0: string) => void; }) => {
  const refreshToken: any = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);
  const [user]: any = await Users.findAll({
    where: {
      refresh_token: refreshToken,
    },
  });
  if (!user[0]) return res.sendStatus(204);
  const userId: any = user.id;
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