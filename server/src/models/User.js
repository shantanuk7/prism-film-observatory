import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['observer', 'admin'], required: true },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    avatarUrl: {
      type: String,
      default: function() {
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(this.username)}&background=random&color=fff`;
      }
    },
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Observation' }],
    analysisBookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Analysis' }],
    viewHistory: [
      {
        movieId: { type: String, required: true },
        viewedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
)

export default mongoose.model('User', userSchema)