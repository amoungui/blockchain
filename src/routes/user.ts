import { Router, Request, Response } from "express";
import UserController from "../controllers/UserController";
import ProfileController from "../controllers/ProfileController";
import UserManager  from "../managers/UserManager";
import { checkJwt } from "../middlewares/checkJwt";
import { checkRole } from "../middlewares/checkRole";
var path = require('path');
var multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
});

var upload = multer({ storage: storage })
//var upload = multer({ dest: 'uploads/' });

  const router = Router();

  //Get all users  // [checkJwt, checkRole(["ADMIN"])],
  router.get("/",  UserController.listAll);

  // Get one user  // [checkJwt, checkRole(["ADMIN"])],
  router.get("/:id([0-9]+)",  UserController.getOneById);

  //Create a new user  // [checkJwt, checkRole(["ADMIN"])],
  router.post("/",  UserController.newUser);

  //Edit one user  // [checkJwt, checkRole(["ADMIN"])],
  router.patch("/:id([0-9]+)",  UserController.editUser);

  //Edit one user  // [checkJwt, checkRole(["ADMIN"])],
  router.patch("/:id([0-9]+)/avatar", upload.single("image"),ProfileController.UploadProfile);

  //Delete one user  // [checkJwt, checkRole(["ADMIN"])],
  router.delete("/:id([0-9]+)",  UserController.deleteUser);

  export default router;