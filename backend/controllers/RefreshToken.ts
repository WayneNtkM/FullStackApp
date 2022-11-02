import Users from "../models/UserModel";
import jwt, { Secret } from 'jsonwebtoken';

export const refreshToken = async(req: { cookies: { refreshToken: any; }; }, res: { sendStatus: (arg0: number) => void; json: (arg0: { accessToken: string; }) => void; }) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(401);
    const [user]: any = await Users.findAll({
      where: {
        refresh_token: refreshToken,
      },
    });
    if (!user) return res.sendStatus(403);
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as Secret, (err: any) => {
      if(err) return res.sendStatus(403);
        const userId = user.id;
        const name = user.name;
        const email = user.email;
        const accessToken = jwt.sign({userId, name, email}, process.env.ACCESS_TOKEN_SECRET as Secret,{
          expiresIn: '15s'
      });
      res.json({ accessToken });
    });
  } catch (error) {
    console.log(error);
  }
}
