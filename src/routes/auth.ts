import { Router } from "express";
import AuthController from "../controllers/AuthController";
import { checkJwt } from "../middlewares/checkJwt";

const router = Router();
//Login route
router.post("/login", AuthController.login);
//register route
router.post("/register", AuthController.register);
//forget password
router.post("/sendmail", AuthController.sendmail);
//Change my password
router.post("/change-password", [checkJwt], AuthController.changePassword);

export default router;