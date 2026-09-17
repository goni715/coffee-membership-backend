import NotFoundError from "@/errors/NotFoundError";
import ShopModel from "../shop/shop.model";
import { IMembership } from "./membership.interface"
import MembershipModel from "./membership.model";
import ConflictError from "@/errors/ConflictError";


/*=============== join shop ===============*/
const joinShop = async (customerId: string, payload: IMembership) => {
    //check shop
    const shop = await ShopModel.findById(payload.shopId);
    if (!shop) {
        throw new NotFoundError("Shop not found with the provided ID.");
    }

    //check already join
    const alreadyJoin = await MembershipModel.findOne({
        customerId,
        shopId: payload.shopId
    });
    if (alreadyJoin) {
        throw new ConflictError("You have already joined this shop.");
    }


    //create membership
    const result = await MembershipModel.create({
        customerId,
        ownerId: shop.ownerId,
        shopId: payload.shopId
    });

    return result;
}



const MembershipService = {
    joinShop,
}

export default MembershipService