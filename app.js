const express = require('express');
const app = express();
const mongoose = require('mongoose');
const mongoDbServer = 'mongodb+srv://temp:temp@fullstack-j2ckb.mongodb.net/test?retryWrites=true';

/*
 * Establishes database connection
 */

mongoose.connect(mongoDbServer, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})
    .then(() => {
        console.log("Successfully connected to MongoDB Atlas");
    })
    .catch((error) => {
        console.log('Unable to connect to MongoDB Atlas!');
        console.error(error);
    });

const Recipe = require('./models/recipe');


/*
 * Uses body-parser to extract all incoming requests
 */
const bodyParser = require('body-parser');
app.use(bodyParser.json());

/*
 * Enables CORS
 */
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
    );
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, PATCH, OPTIONS'
    );
    next();
});

/*
 * Creates a new recipe
 */
app.post('/api/recipes', (req, res, next) => {
    const recipe = new Recipe({
        title: req.body.title,
        ingredients: req.body.ingredients,
        instructions: req.body.instructions,
        time: req.body.time,
        difficulty: req.body.difficulty
    });
    recipe.save().then(
        () => {
            res.status(201).json({
                message: 'Recipe saved successfully!'
            });
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
});

/*
 * Updates recipe item
 */
app.put('/api/recipes/:id', (req, res, next) => {
    const recipe = new Recipe({
        _id: req.params.id,
        title: req.body.title,
        ingredients: req.body.ingredients,
        instructions: req.body.instructions,
        time: req.body.time,
        difficulty: req.body.difficulty
    });
    Recipe.updateOne({_id: req.params.id}, recipe).then(
        () => {
            res.status(201).json({
                message: 'Thing updated successfully!'
            });
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
});

/*
 * Deletes a recipe item
 */
app.delete('/api/recipes/:id', (req, res, next) => {
    Recipe.deleteOne({_id: req.params.id}).then(
        () => {
            res.status(200).json({
                message: 'Deleted!'
            });
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
});

/*
 * Fetches a single recipe item
 */
app.get('/api/recipes/:id', (req, res, next) => {
    Recipe.findOne({
        _id: req.params.id
    }).then(
        (recipe) => {
            res.status(200).json(recipe);
        }
    ).catch(
        (error) => {
            res.status(404).json({
                error: error
            });
        }
    );
});

/*
 * Fetches a collection of recipes
 */
app.use('/api/recipes', (req, res, next) => {
    Recipe.find().then(
        (recipes) => {
            res.status(200).json(recipes);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
});


module.exports = app;