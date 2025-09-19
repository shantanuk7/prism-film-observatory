import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['observer', 'contributor'], required: true },

    avatarUrl: {
      type: String,
      default: function() {
        // Generates a default avatar from ui-avatars.com with the user's initials
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