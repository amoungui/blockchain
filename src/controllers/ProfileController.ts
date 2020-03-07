import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { validate } from "class-validator";
import * as multer from 'multer'
import * as fs from 'fs'
import * as path from 'path'
import { Profile } from "../entity/Profile";
import { User } from "../entity/User";

class ProfileController{
  static listAll = async (req: Request, res: Response) => {
      //Get photos from database
      const profileRepository = getRepository(Profile);
      const photos = await profileRepository.find({
          select: ["id", "photo"] // 
      });
      
      //Send the photos object
      res.send(photos);
  };
    
  static getOneById = async (req: Request, res: Response) => {
      //Get the ID from the url
      const id: string = req.params.id;
      
      //Get the user from database
      const profileRepository = getRepository(Profile);
      try {
          const profile = await profileRepository.findOneOrFail(id, {
              select: ["id", "photo"] //We dont want to send the password on response
          });
          res.send(profile);
      } catch (error) {
          res.status(404).send("Profile not found");
      }
  };
        
  //save photo profile to database
  static UploadProfile = async (req: Request, res: Response) => {
      //Get the ID from the url
      const id = req.params.id;      
      //Get values from the body
      const  photo: string  = req.file.filename;
    
      const profile = new Profile();
      profile.photo = photo;
      
      const profileRepository = getRepository(Profile);
      try {
          await profileRepository.save(profile);
      } catch (error) {
          //If not found, send a 404 response
          res.status(404).send("image not found");
          return;
      }
      //Try to find user on database
      const userRepository = getRepository(User);
      let user;
      try {
        user = await userRepository.findOneOrFail(id);
      } catch (error) {
        //If not found, send a 404 response
        res.status(404).send("User not found");
        return;
      }
    
      //Validate the new values on model
      user.profile = profile;
      const errors = await validate(user);
      if (errors.length > 0) {
        res.status(400).send(errors);
        return;
      }
    
      //Try to safe, if fails, that means username already in use
      try {
        await userRepository.save(user);
      } catch (e) {
        res.status(409).send("username already in use");
        return;
      }
      //After all send a 204 (no content, but accepted) response
      res.status(204).send();
    };//end of uploadProfile
     
/*  static UploadProfile = async (req: Request, res: Response) => {
    try {
      res.send(req.file);
    } catch (err) {
      res.send(400);
    }    
  }*/

};

export default ProfileController;
