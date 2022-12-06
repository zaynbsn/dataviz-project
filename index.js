const express = require('express')
const path = require('path')

const app = express()

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/pages/index.html'))
  // res.send('Hello World!')
})

app.listen(3000, () => {
  console.log("listening on http:localhost:3000")
})

module.exports = app;

// app.get('/observatoire', (req, res) => {
//   res.sendFile(path.join(__dirname, '/public/pages/observatory.html'))
// })

// app.get('/lune', (req, res) => {
//   res.sendFile(path.join(__dirname, '/public/pages/moon.html'))
// })
// app.get('/iss', (req, res) => {
//   res.sendFile(path.join(__dirname, '/public/pages/iss.html'))
// })
// app.get('/mars', (req, res) => {
//   res.sendFile(path.join(__dirname, '/public/pages/mars.html'))
// })
// app.get('/credits', (req, res) => {
//   res.sendFile(path.join(__dirname, '/public/pages/credits.html'))
// })