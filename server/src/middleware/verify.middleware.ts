import { Request, Response, NextFunction } from "express";
import { ZodObject } from "zod";

const verify =
  (schema: ZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
    } catch (error) {}
  };

export default verify;
