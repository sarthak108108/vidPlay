import mongoose, {Schema, mongo} from "mongoose";

const subcriptionSchema = new Schema({
    subscriber: {  //one who is subscribing
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    channel: {  // to whom one is subscribing
        type: Schema.Types.ObjectId,
        ref: "User"
    }
    

},{timestamps: true})

export const subcription = mongoose.model("Subscription", subcriptionSchema)