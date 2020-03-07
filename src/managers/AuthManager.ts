import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { validate } from "class-validator";
import { User } from "../entity/User";
const sendmail = require('sendmail')({silent: true});

class AuthManager{
    static match = (password: any, confirmpassword: any) =>    {
        if (password === confirmpassword) {
            return <boolean> true;
        } else {
            return <boolean> false;
        }
    };

    static async validate(user: any, req:Request, res:Response){
        const errors = await validate(user);
        if (errors.length > 0) {
          res.status(400).send(errors);
          return;
        }
    };

    static async sendemail(email: string){
        sendmail({
            from: 'no-reply@yourdomain.com',
            to: email,
            subject: 'test sendmail',
            html: 'Mail of test sendmail ',
          }, function(err, reply) {
            console.log(err && err.stack);
            console.dir(reply);
        });
    }    
}

export default AuthManager;