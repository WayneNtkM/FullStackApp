import jwt, { Secret } from "jsonwebtoken";

export const verifyToken = (req: { headers: { [x: string]: any; }; email: string; }, res: { sendStatus: (arg0: number) => void; }, next: () => void) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if(token == null) return res.sendStatus(401);
  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as Secret, (err: any | null, decoded: any) => {
      if(err) return res.sendStatus(403);
      req.email = decoded.email;
      return next();
  }) as void;
};
