import mongoose, { type Document, Schema } from "mongoose"

export interface IDestination extends Document {
  city: string
  country: string
  clues: string[]
  fun_fact: string[]
  trivia: string[]
}

const destinationSchema = new Schema<IDestination>({
  city: { type: String, required: true },
  country: { type: String, required: true },
  clues: { type: [String], required: true },
  fun_fact: { type: [String], required: true },
  trivia: { type: [String], required: true },
})

// Create a compound index for city and country to ensure uniqueness
destinationSchema.index({ city: 1, country: 1 }, { unique: true })

export default mongoose.model<IDestination>("Destination", destinationSchema)

