import { Request, Response } from "express";

const notFound = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
    error: {
        path: req.originalUrl,
        method:req.method
    }
  });
};

export default notFound;
