import mongoose, { Schema, Document, Types } from "mongoose";

export interface IBook extends Document {
  title: string;
  caption: string;
  image: string;
  rating: number;
  user: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const bookSchema = new Schema<IBook>(
  {
    title: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Book = mongoose.model<IBook>("Book", bookSchema);

export default Book;
