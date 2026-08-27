import Joi from "joi";
import crypto from "crypto";
import Table from "../models/Table.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

class UsersController{
  static Register = async (req, res, next) => {
  const schema = {
    name: Joi.string().min(3).max(50).required().messages({
      "string.min": "تعداد کارکتر برای فیلد نام کم است",
    }),
    mobile: Joi.string()
      .pattern(/^09\d{9}$/)
      .required()
      .messages({
        "string.empty": "شماره موبایل الزامی است",
        "string.pattern.base": "شماره موبایل باید به شکل 09xxxxxxxxx باشد",
        "any.required": "شماره موبایل الزامی است",
      }),
    password: Joi.string().min(5).max(100).required(),
    // email : Joi.string().email().required()
  };
  const validateResult = Joi.object(schema).validate(req.body);

  if (validateResult.error) {
    return res.status(400).send(validateResult.error.details[0].message);
  }

  const table = new Table("users");
  const users = await table.getByField("mobile", req.body.mobile);

  if (users.length > 0) {
    console.log("users = ", users);
    return res.status(400).send("کاربر با این مبایل وجود دارد");
  }

  //create hash password
  const hashedPassword = await bcrypt.hash(req.body.password, 12);

  // create token
  // const token = crypto.randomBytes(32).toString("hex");

  // create hash token
  // const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  // create expires at
  // const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const userData = {
    ...req.body,
    password: hashedPassword,
    // api_token: hashedToken,
    // token_expires_at: expiresAt,
  };

  const result = await table.insertRecord(userData);

  const token = jwt.sign(
    { id: result.insertId, name: req.body.name },
    process.env.SECRET_KEY,
  );

  res.status(201).json({
    message: "Registered successfully",
    token,
    user: {
      id: result.insertId,
      name: req.body.name,
      mobile: req.body.mobile,
    },
  });
};

  static Login = async (req, res, next) => {
  const schema = {
    mobile: Joi.string()
      .pattern(/^09\d{9}$/)
      .required()
      .messages({
        "string.empty": "شماره موبایل الزامی است",
        "string.pattern.base": "شماره موبایل باید به شکل 09xxxxxxxxx باشد",
        "any.required": "شماره موبایل الزامی است",
      }),
    password: Joi.string().min(5).max(100).required(),
  };

  const validateResult = Joi.object(schema).validate(req.body);

  if (validateResult.error) {
    return res.status(400).send(validateResult.error.details[0].message);
  }

  const table = new Table("users");

  const users = await table.getByField("mobile", req.body.mobile);

  // User does not exist
  if (users.length === 0) {
    return res.status(400).send("موبایل یا پسورد اشتباه است");
  }

  const user = users[0];

  if (user.expiresAt > Date.now()) {
    return res.status(200).send("کاربر هنوز معتبر است");
  }

  // Password Check
  const validPassword = await bcrypt.compare(req.body.password, user.password);

  if (!validPassword) {
    return res.status(400).send("موبایل یا پسورد اشتباه است");
  }

  // create new token
  // const token = crypto.randomBytes(32).toString("hex");
  const token = jwt.sign(
    { id: user.id, name: user.name },
    process.env.SECRET_KEY,
  );

  // create hash token
  // const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  // create new expires at
  // const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  // save hash token
  // await table.updateRecord(user.id, {
  //   api_token: hashedToken,
  //   token_expires_at: expiresAt,
  // });

  // send token to client
  return res.status(200).json({
    message: "Login successful",
    token,
    user: {
      id: user.id,
      name: user.name,
      mobile: user.mobile,
    },
  });
};
}
export default UsersController;
