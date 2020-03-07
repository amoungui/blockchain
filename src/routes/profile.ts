import { Router } from "express";
import ProfileController from "../controllers/ProfileController";
var multer = require('multer');
var upload = multer({ dest: 'uploads/' });
import { checkJwt } from "../middlewares/checkJwt";
import { checkRole } from "../middlewares/checkRole";

  const router = Router();

  //Get all users  // [checkJwt, checkRole(["ADMIN"])],
  router.get("/",  ProfileController.listAll);

  // Get one user  // [checkJwt, checkRole(["ADMIN"])],
  router.get("/:id([0-9]+)",  ProfileController.getOneById);

  //Edit one user  // [checkJwt, checkRole(["ADMIN"])],
  router.patch("/:id([0-9]+)", upload.single('profile'), ProfileController.UploadProfile);

  export default router;