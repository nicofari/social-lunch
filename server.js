const express = require('express')
const app = express()

const base = require('airtable').base(process.env.AIRTABLE_BASE_NAME)
const table = base(process.env.AIRTABLE_TABLE_NAME)

Airtable.configure({
    apiKey: process.env.AIRTABLE_API_KEY
})

app.use(express.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
})

app.post('/form', (req, res) => {
  const name = req.body.name
  const date = req.body.date
  console.log(name)
  console.log(date)

    table.create({
      "Name": name,
      "Date": date
    }, (err, record) => {
      if (err) {
        console.error(err)
        return
      }

    console.log(record.getId())
  })
  res.status(200).type('json').end()
})

const listener = app.listen(process.env.PORT, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
