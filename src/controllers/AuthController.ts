import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { getRepository } from "typeorm";
import { validate } from "class-validator";
import  AuthManager  from "../managers/AuthManager";
import  ErrorsManager  from "../managers/ErrorsManager";
import { User } from "../entity/User";
import config from "../config/config";
import Mail from "../entity/Mail";

class AuthController {
  static login = async (req: Request, res: Response) => {
    //Check if username and password are set
    let { email, password } = req.body;
    if (!(email && password)) {
      res.status(400).send();
    }

    //Get user from database
    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail({ where: { email } });
    } catch (error) {
      res.status(401).send();
    }

    //Check if encrypted password match
    let bool:boolean = <boolean> user.checkIfUnencryptedPasswordIsValid(password);
    if (!bool) {
      res.status(401).send();
      return ; //<boolean> true
    }

    //Sing JWT, valid for 1 hour
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      config.jwtSecret,
      { expiresIn: "1h" }
    );

    //Send the jwt in the response
    res.send(token);
  };

  static register = async (req: Request, res: Response) => {
    //Get parameters from the body
    let { username, phone, email, password, confirmPassword} = req.body;
    let user = new User();
    
    if(AuthManager.match(password, confirmPassword)){ 
      user.username = username;
      user.phone = phone;
      user.email = email; 
      user.password = password;  
    }else{
      res.status(409).send("password and confirmPassword are not the same");
      return;
    }
    //Validade if the parameters are ok
    ErrorsManager.valide(user, req, res);  
    //Hash the password, to securely store on DB
    user.hashPassword();
    //Try to save. If fails, the username is already in use
    const userRepository = getRepository(User);
    try {
      await userRepository.save(user);
    } catch (e) {
      res.status(409).send("email or number already in use");
      return;
    }
    //If all ok, send 201 response
    res.status(201).send("User created");
  };
 
  static sendmail = async (req: Request, res: Response) => {
    const message = Object.assign({}, req.body);     
            
    Mail.to = message.to;
    Mail.subject = message.subject;
    Mail.message = message.message;
    let result = Mail.sendMail();

    res.status(200).json({ 'result': result })
  }   

  static changePassword = async (req: Request, res: Response) => {
    //Get ID from JWT
    const id = res.locals.jwtPayload.userId;

    //Get parameters from the body
    const { oldPassword, newPassword } = req.body;
    if (!(oldPassword && newPassword)) {
      res.status(400).send();
    }

    //Get user from the database
    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail(id);
    } catch (id) {
      res.status(401).send();
    }

    //Check if old password matchs
    if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
      res.status(401).send();
      return;
    }

    //Validate de model (password lenght)
    user.password = newPassword;
    const errors = await validate(user);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }
    //Hash the new password and save
    user.hashPassword();
    userRepository.save(user);

    res.status(204).send();
  };
}

export default AuthController;
