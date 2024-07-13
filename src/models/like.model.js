import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const likeSchema = new Schema({
    video: {
        type: Schema.Types.ObjectId,
        ref:"Video"
    },
    likedBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }

},
    { timestamps: true })

    likeSchema.plugin(mongooseAggregatePaginate)


export const Like = mongoose.model("Like", likeSchema )

