const path = require('path');
const express = require('express');
const hbs = require('hbs');
const { Http2ServerRequest } = require('http2');
const geocode = require('../src/utils/geocode');
const forecast = require('../src/utils/forecast');

const app = express();

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Josh Alexakos'
    })
})

app.get('/about', (req,res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Josh Alexakos'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help is here!',
        name: 'Josh Alexakos',
    })
})

// Weather page render
app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must search for an address!'
        })
    }
    
    geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {
        if (error) {
            return res.send({
                error
            })
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({
                    error
                })
            }

            res.send({
                forecast: forecastData,
                location: location
        })
    })

    // res.send({
    //     forecast: 'Sunny',
    //     location: 'Philadelphia',
    //     address: req.query.address
    // })
})
});

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        })
    }
    
    console.log(req.query.search)
    res.send({
        products: []
    })
})

app.get('/help/*', (req,res) => {
    res.render('404', {
        title: '404: No Help Page Found',
        errorMsg: 'Help article not found. You can find your way home above.',
        name: 'Josh Alexakos'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404: No Page Found',
        errorMsg: 'Page not found. You can find your way home above.',
        name: 'Josh Alexakos'
    })
})

app.listen(3000, () => {
    console.log('Server is up on port 3000.')
})