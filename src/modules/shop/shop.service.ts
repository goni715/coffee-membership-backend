import { IShop } from "./shop.interface"


const createShop = async (payload: IShop) => {
    return payload;
}

const ShopService = {
    createShop
}

export default ShopService