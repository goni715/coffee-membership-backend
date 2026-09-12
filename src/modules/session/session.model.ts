import { Schema, model } from "mongoose";
import { ISession } from "./session.interface";


const sessionSchema = new Schema<ISession>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "userId is required"]
    },
    refreshTokenHash: {
        type: String,
        required: [true, "Refresh token hash is required"]
    },
    ip: {
        type: String,
        required: [true, "IP address is required"]
    },
    revoked: {
        type: Boolean,
        default: false
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expires: 0 } //(Time-To-Live)-automatic delete
    }
}, {
    timestamps: true,
    versionKey: false
})

const SessionModel = model<ISession>("Session", sessionSchema)
export default SessionModel