const express = require('express')
const app = express()
const port = 3002

// add template engine
const path = require('path')
app.set('view engine','ejs')
app.set('views', path.join(__dirname, 'views'))

//static files - CSS, JS, Images
app.use(express.static(path.join(__dirname, 'public')))


app.get('/', (req, res) => {
    res.render('index')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})