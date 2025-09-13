import mongoose from 'mongoose';

const observationSchema = new mongoose.Schema(
  {
    movieId: { type: String, required: true },
    sceneId: { type: Number, required: true },
    content: { type: String, required: true },
    timestamp: { type: String },
    categories: [{ type: String }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

export default mongoose.model('Observation', observationSchema);
