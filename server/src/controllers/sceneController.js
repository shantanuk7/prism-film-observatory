import Scene from '../models/Scene.js';
import Movie from '../models/Movie.js';

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