import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const subscriptionSchema = new Schema({
    subscriber: {  //one who is subscribing
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    channel: {  // to whom one is subscribing
        type: Schema.Types.ObjectId,
        ref: "User"
    }
    

},{timestamps: true})

subscriptionSchema.plugin(mongooseAggregatePaginate)

export const Subscription = mongoose.model("Subscription", subscriptionSchema)