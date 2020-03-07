import { Router, Request, Response } from "express";
import auth from "./auth";
import user from "./user";
import profile from "./profile";
import blockchain from "./blockchain";

const routes = Router();

routes.use("/auth", auth);
routes.use("/user", user);
routes.use("/profile", profile);
routes.use("/", blockchain);

export default routes;
