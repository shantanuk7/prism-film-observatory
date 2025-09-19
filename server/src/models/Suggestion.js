import mongoose from 'mongoose';

const suggestionSchema = new mongoose.Schema({
    movieId: { type: String, required: true, index: true },
    
    // Type of suggestion being made
    suggestionType: { 
        type: String, 
        enum: ['NEW_SCENE', 'EDIT_SCENE'], 
        required: true 
    },
    
    // The user who made the suggestion
    suggestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    
    // If editing, this links to the original scene
    sceneToEdit: { type: mongoose.Schema.Types.ObjectId, ref: 'Scene' },

    // The actual data being suggested
    payload: {
        sceneNumber: { type: Number },
        description: { type: String },
        startTime: { type: String },
        endTime: { type: String },
        // We will store temp URLs until approved
        startFrameUrl: { type: String }, 
        endFrameUrl: { type: String }
    },
    
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
        index: true
    },
    
    // Optional notes from the user
    notes: { type: String } 

}, { timestamps: true });

export default mongoose.model('Suggestion', suggestionSchema);