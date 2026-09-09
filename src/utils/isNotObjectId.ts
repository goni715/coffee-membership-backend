import { Types } from "mongoose"

const isNotObjectId = (id: string) => {
    return !(Types.ObjectId.isValid(id)) //true or false
}

export default isNotObjectId;