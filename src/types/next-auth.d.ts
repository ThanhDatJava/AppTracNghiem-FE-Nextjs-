import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

// Define IUser structure
interface IUser {
  _id: string;
  name: string;
  email: string;
  access_token: string;
}

// Extend JWT interface with additional properties
declare module "next-auth/jwt" {
  interface JWT {
    access_token: string;
    refresh_token: string;
    user: IUser;
    access_expire: number;
    error: string;
  }
}

// Extend Session interface with additional properties
declare module "next-auth" {
  interface Session {
    user: IUser;
    access_token: string;
    refresh_token: string;
    access_expire: number;
    error: string;
  }
}
