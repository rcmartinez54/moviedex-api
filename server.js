require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const MOVIES = require('./movies-data-small.json')

const app = express()

const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common'
app.use(morgan(morganSetting))
app.use(cors())
app.use(helmet())


// Validates token being used by the token bearer and/or if it is not present 
app.use(function validateBearerToken(req, res, next) {

    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization')
    if (!authToken || authToken.split(' ')[1] !== apiToken) {
        return res.status(401).json({ error: 'Unauthorized request' })
    }
    next()
})

// Sets endpoints for each search parameter
app.get('/movie', function handleGetMovie(req, res) {
    let response = MOVIES;

    if (req.query.genre) {
        response = response.filter(movie => 
            movie.genre.toLowerCase().includes(req.query.genre.toLowerCase())    
        )
    }

    if (req.query.country) {
        response = response.filter(movie => 
            movie.country.toLowerCase().includes(req.query.country.toLowerCase())    
        )
    }

    if (req.query.avg_vote) {
        response = response.filter(movie => 
            movie.avg_vote.toLowerCase().includes(req.query.genre.toLowerCase())    
        )
    }

    res.json(response)
})

app.use((error, req, res, next) => {
    let response
    if (process.env.NODE_ENV === 'production') {
        response = { error: { message: 'server error' } }
    } else {
        response = { error }
    }
    res.status(500).json(response)
})

const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`)
})