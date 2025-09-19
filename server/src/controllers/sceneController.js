import Scene from '../models/Scene.js';
import Movie from '../models/Movie.js';
import Observation from '../models/Observation.js';

export const createScene = async (req, res) => {
    const {
        movieId,
        sceneNumber,
        description,
        startTime,
        endTime,
        timestampSourceName,
        timestampSourceUrl
    } = req.body;

    try {
        if (!req.files || !req.files.startFrame || !req.files.endFrame) {
            return res.status(400).json({ message: 'Start and end frame images are required.' });
        }

        const startFrameUrl = req.files.startFrame[0].path;
        const endFrameUrl = req.files.endFrame[0].path;

        if (timestampSourceName) {
            await Movie.findOneAndUpdate(
                { tmdbId: movieId },
                {
                    $set: {
                        tmdbId: movieId,
                        timestampSource: {
                            name: timestampSourceName,
                            url: timestampSourceUrl || ''
                        }
                    }
                },
                { upsert: true, new: true }
            );
        }

        const newScene = new Scene({
            movieId,
            sceneNumber,
            description,
            startTime,
            endTime,
            startFrameUrl,
            endFrameUrl,
            user: req.user._id,
        });

        const createdScene = await newScene.save();
        res.status(201).json(createdScene);

    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: `Scene number ${sceneNumber} already exists for this movie.` });
        }
        res.status(500).json({ message: `Server Error: ${error.message}` });
    }
};

export const getScenesForMovie = async (req, res) => {
    try {
        const scenes = await Scene.find({ movieId: req.params.movieId }).sort({ sceneNumber: 1 });
        res.json(scenes);
    } catch (error) {
        res.status(500).json({ message: `Server Error: ${error.message}` });
    }
};

// @desc    Update an existing scene
// @route   PUT /api/scenes/:id
// @access  Private (Admin)
export const updateScene = async (req, res) => {
    try {
        const scene = await Scene.findById(req.params.id);

        if (!scene) {
            return res.status(404).json({ message: 'Scene not found.' });
        }

        const { description, startTime, endTime } = req.body;
        
        // Update text fields
        scene.description = description || scene.description;
        scene.startTime = startTime || scene.startTime;
        scene.endTime = endTime || scene.endTime;

        // Check for and update new frame images if they were uploaded
        if (req.files) {
            if (req.files.startFrame) {
                scene.startFrameUrl = req.files.startFrame[0].path;
            }
            if (req.files.endFrame) {
                scene.endFrameUrl = req.files.endFrame[0].path;
            }
        }

        const updatedScene = await scene.save();
        res.json(updatedScene);

    } catch (error) {
        res.status(500).json({ message: `Server Error: ${error.message}` });
    }
};

// @desc    Delete a scene
// @route   DELETE /api/scenes/:id
// @access  Private (Admin)
export const deleteScene = async (req, res) => {
    try {
        const scene = await Scene.findById(req.params.id);

        if (!scene) {
            return res.status(404).json({ message: 'Scene not found.' });
        }

        // Before deleting the scene, delete all observations associated with it
        await Observation.deleteMany({ 
            movieId: scene.movieId, 
            sceneId: scene.sceneNumber 
        });
        
        // Now, delete the scene itself
        await scene.deleteOne();

        res.json({ message: 'Scene and associated observations deleted successfully.' });

    } catch (error) {
        res.status(500).json({ message: `Server Error: ${error.message}` });
    }
};