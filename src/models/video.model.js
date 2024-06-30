import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema({
    videoFile: {
        type: String,  //cloudinary url
        required: true
    },
    thumbNail: {
        type: String,  //cloudinary url
        required: [true, "Cant fetch Thumbnail"]
    },
    title:{
        type: String,
        required: [true, "cant fetch title"]
    },
    description: {
        type: String,
        required: [true, "Cant fetch Thumbnail"]
    },
    duration: {
        type: Number,
        required: true,
        default: 0
    },
    views:{
        type: Number,
        default: 0
    },
    isPublished:{
        type: Boolean,
        default: true
    },
    videoPublisher:{
        type: Schema.Types.ObjectId,
        ref:"User"
    }

}, { timestamps: true })

videoSchema.plugin(mongooseAggregatePaginate)

export const Videos = mongoose.model("Video", videoSchema)