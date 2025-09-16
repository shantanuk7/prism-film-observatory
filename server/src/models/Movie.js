import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  tmdbId: { 
    type: String, 
    required: true, 
    unique: true, 
    index: true 
  },
  timestampSource: {
    name: { type: String },
    url: { type: String },
  },
}, { timestamps: true });

export default mongoose.model('Movie', movieSchema);