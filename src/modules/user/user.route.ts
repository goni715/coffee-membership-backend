import express, { Request, Response } from "express";

const router = express.Router();


router.get(
    "/get-users",
    (req:Request, res: Response)=> {
        res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            data: [
                {
                    id: 1,
                    name: 'Osman Goni',
                },
                {
                    id: 2,
                    name: 'Evan Ahmed',
                },
                {
                    id: 3,
                    name: 'Marjan Hossain',
                }
            ]
        })
    }
);



const UserRoutes = router;
export default UserRoutes;