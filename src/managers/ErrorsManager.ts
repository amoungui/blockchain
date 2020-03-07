import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { validate } from "class-validator";
import { User } from "../entity/User";

class ErrorsManager{
    static valide = async (user: any, req:Request, res:Response) => {
        const errors = await validate(user);
        if (errors.length > 0) {
          res.status(400).send(errors);
          return;
        } 
    };

}

export default ErrorsManager;