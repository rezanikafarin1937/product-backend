import express from "express";
import UsersController from "../../controller/UsersController.js";

const router = express.Router();
// const UsersController = require("../../controller/UsersController");

router.post("/", UsersController.Register);
router.post("/login", UsersController.Login);

export default router;
