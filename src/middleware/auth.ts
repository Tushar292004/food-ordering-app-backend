import {Request, Response,  NextFunction } from "express";
import { auth } from "express-oauth2-jwt-bearer"
import jwt from "jsonwebtoken";
import User from "../models/user";

//declaring types of custom properties
declare global {
  namespace Express {
    interface Request {
      userId: string;
      auth0Id: string;  
    }
  }
}

//check the authorization header's bearer token
export const jwtCheck = auth({
    audience: process.env.AUTH0_AUDIENCE,
    issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
    tokenSigningAlg: 'RS256'
  });

//extrating user from mongodb by use auth0 id
export const jwtParse = async (
  req: Request, 
  res: Response, 
  next: NextFunction) => {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith("Bearer ")) {
      return res.sendStatus(401);
    }

    // this will seperate the Bearer from access token by spliting it in 2 parts
    const token = authorization.split(" ")[1];
    //decoding the token 
    try {
      const decoded = jwt.decode(token) as jwt.JwtPayload;
      const auth0Id  = decoded.sub;
      //searching for the user with auth0 id
      const user = await User.findOne({auth0Id});
      if (!user){
        return res.sendStatus(401);
      }
      // appendgin infomation about user making to req to actual req object
      req.auth0Id = auth0Id as string;
      req.userId = user._id.toString();
      next();

    } catch (error) {
      return  res.sendStatus(401);
    }
  }