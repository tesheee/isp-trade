import mongoose from "mongoose";

const PostsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
    images: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Posts", PostsSchema);
