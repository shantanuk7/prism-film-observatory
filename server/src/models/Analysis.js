import mongoose from 'mongoose';

const analysisSchema = new mongoose.Schema(
  {
    movieId: { type: String, required: true, index: true },
    title: { type: String, required: true, maxlength: 150 },
    description: { type: String, required: true },
    filePublicId: { type: String, required: true },
    fileSize: { type: Number },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    downloads: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('Analysis', analysisSchema);
