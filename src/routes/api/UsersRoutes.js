import express from "express";
import { Register, Login } from "../../controller/UsersController.js";

const router = express.Router();
// const UsersController = require("../../controller/UsersController");

router.post("/", Register);
router.post("/login", Login);

export default router;
