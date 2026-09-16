import express from "express";
import UserController from "./user.controller";

const router = express.Router();

router.get(
    "/customers",
    UserController.getCustomers
);



const UserRoutes = router;
export default UserRoutes;