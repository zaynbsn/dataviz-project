const express = require('express')
const path = require('path')

const app = express()

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'))
})

app.listen(3000, () => {
  console.log("listening on http:localhost:3000")
})

app.get('/moon', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/moon.html'))
})
app.get('/iss', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/iss.html'))
})
app.get('/mars', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/mars.html'))
})
app.get('/credits', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/credits.html'))
})