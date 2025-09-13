import mongoose from 'mongoose';

const sceneSchema = new mongoose.Schema(
  {
    movieId: { type: String, required: true, index: true },
    sceneNumber: { type: Number, required: true },
    description: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    startFrameUrl: { type: String, required: true },
    endFrameUrl: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

// Ensure a movie can't have duplicate scene numbers
sceneSchema.index({ movieId: 1, sceneNumber: 1 }, { unique: true });

export default mongoose.model('Scene', sceneSchema);