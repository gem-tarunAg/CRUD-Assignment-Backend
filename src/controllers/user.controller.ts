import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";
import bcrypt from "bcrypt";
var jwt = require("jsonwebtoken");
const sgMail = require("@sendgrid/mail");

export async function addUser(req: Request, res: Response) {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });
    user.save((err: any, data: any) => {
      if (err) {
        console.log("There is some error in database connection");
        res.status(409).send({
          message: err.message,
          data: [{ boolean: false }],
        });
      } else {
        console.log(data, "--- stored succesfully");
        const msg = {
          to: user.email, // Change to your recipient
          from: "Tarun.Agrawal@Geminisolutions.com", // Change to your verified sender
          subject: "New Account Created",
          text: "You have succesfully created your account",
        };

        sgMail.setApiKey(process.env.SENDGRID_API_KEY);

        sgMail
          .send(msg)
          .then((response: any) => {
            console.log(response[0].statusCode);
            console.log("Mail Sent Succesfully");
          })
          .catch((error: any) => {
            console.error(error);
            res.status(404).send({
              message: error.message,
              data: [{ boolean: false }],
            });
          });
      }
      res.status(200).send({
        message: "Registration success",
        data: [{ boolean: true }],
      });
    });
  } catch (error: any) {
    console.log(error);

    res.status(406).send({
      message: error.message,
      data: [{ boolean: false }],
    });
  }
}

export async function loginUser(req: Request, res: Response) {
  try {
    const userDB = await User.findOne({ username: req.body.username });
    if (userDB !== null) {
      const passwordDB = userDB.password;
      const comparePasswords = await bcrypt.compare(
        req.body.password,
        passwordDB
      );
      console.log("1--", comparePasswords);
      console.log("LOCALS--", res.locals.token);

      if (comparePasswords && res.locals.user)
        res.status(200).send({
          message: "Successfully logged in",
          data: [{ boolean: true }, userDB, res.locals.token],
        });
      else
        res.status(401).send({
          message: "User can't be authenticated",
          data: [{ boolean: false }],
        });
    } else {
      res.status(401).send({
        message: "Username not found",
        data: [{ boolean: false }],
      });
    }
  } catch (error: any) {
    res.status(406).send({
      message: error.message,
      data: [{ boolean: false }],
    });
  }
}

export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log("Authentication", req.headers);
  const accesstoken = jwt.sign(
    { user: req.body.username },
    process.env.ACCESS_TOKEN_SECRET
  );
  if (accesstoken == null) res.sendStatus(401);
  jwt.verify(
    accesstoken,
    process.env.ACCESS_TOKEN_SECRET,
    (err: any, user: any) => {
      if (err) {
        console.log("Error: ", err);
        return res.sendStatus(403);
      }
      const jwtdata = {
        body: req.body,
        user: user,
        token: accesstoken,
      };
      console.log({ res });
      res.locals = jwtdata;
      next();
    }
  );
}

export async function getProfile(req: Request, res: Response) {
  try {
    const userDB = await User.findOne({ username: req.params.username });

    if (userDB !== null) {
      res.status(200).send({
        message: "Profile Found",
        data: [{ boolean: true }, userDB],
      });
    } else {
      res.status(406).send({
        message: "Invalid username",
        data: [{ boolean: false }],
      });
    }
  } catch (error: any) {
    res.status(406).send({
      message: error.message,
      data: [{ boolean: false }],
    });
  }
}

export async function updateUser(req: Request, res: Response) {
  try {
    const id = req.params.id;
    console.log("id--", id);

    const updatedUser = req.body;
    console.log(updatedUser);

    User.findByIdAndUpdate(id, updatedUser, (err: any, user: any) => {
      if (err) {
        res.status(404).send({
          message: err.message,
          data: [{ boolean: false }],
        });
      } else {
        res.status(200).send({
          message: "Updated User successfully",
          data: [{ boolean: true }, updatedUser, user],
        });
      }
    });
  } catch (error: any) {
    res.status(406).send({
      message: error.message,
      data: [{ boolean: false }],
    });
  }
}

export async function deleteUser(req: Request, res: Response) {
  try {
    const id = req.params.id;
    console.log("id--", id);

    User.deleteOne({ _id: req.params.id }, (err: any, data: any) => {
      if (err) {
        res.status(404).send({
          message: err.message,
          data: [{ boolean: false }],
        });
      } else {
        res.status(200).send({
          message: "Succesfully deleted",
          data: [{ boolean: true }],
        });
      }
    });
  } catch (error: any) {
    res.status(406).send({
      message: error.message,
      data: [{ boolean: false }],
    });
  }
}
