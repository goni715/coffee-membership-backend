/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { ZodError, ZodType } from "zod";

const validationMiddleware = (schema: ZodType<any, any, any>) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<any> => {
    try {
      const parsedData = await schema.parseAsync({
        body: req.body,
        params: req.params,
        query: req.query,
        cookies: req.cookies,
      });

      //assign parsed data
      if (parsedData.body) req.body = parsedData.body;
      if (parsedData.params) req.params = parsedData.params;
      if (parsedData.query) req.query = parsedData.query;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors: Record<string, string> = {};
        error.issues.forEach((e) => {
          if (e.path.length > 0) {
            formattedErrors[e.path.join(".")] = e.message;
          }
        });

        //first error message
        const firstErrorMessage = error.issues[0]?.message || "Invalid input";

        return res.status(400).json({
          success: false,
          message: firstErrorMessage,
          error: formattedErrors,
        });
      }

      next(error);
    }
  };
};

export default validationMiddleware;
