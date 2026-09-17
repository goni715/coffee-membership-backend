
import z from "zod";
import { shopIdZodSchema } from "../shop/shop.validation";


export const joinShopValidationSchema = z.object({
    body: z.object({
        shopId: shopIdZodSchema
    }),
});