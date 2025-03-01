import mongoose, { type Document, Schema } from "mongoose"

export interface IUser extends Document {
  username: string
  score: {
    correct: number
    incorrect: number
  }
  createdAt: Date
}

const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 20,
  },
  score: {
    correct: { type: Number, default: 0 },
    incorrect: { type: Number, default: 0 },
  },
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.model<IUser>("User", userSchema)

