const express = require('express')
const app = express()
const Airtable = require('airtable')

//const base = require('airtable').base(process.env.AIRTABLE_BASE_NAME)
const base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base('appf7mrRY6a3xK8jT');
//const table = base(process.env.AIRTABLE_TABLE_NAME)
/*
Airtable.configure({
    apiKey: process.env.AIRTABLE_API_KEY
})
*/
app.use(express.json())
app.use(express.static('public'))
app.set('view engine', 'pug')

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
})

app.post('/form', (req, res) => {
  const name = req.body.name
  const date = req.body.date
  console.log(name)
  console.log(date)

  base('Subscriptions').create({
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

const getNames = async () => {
  base('Subscriptions').select({
      maxRecords: 56,
      view: "Grid view"
  }).eachPage(function page(records, fetchNextPage) {
      // This function (`page`) will get called for each page of records.

      records.forEach(function(record) {
          console.log('Retrieved', record.get('Name'));
      });

      // To fetch the next page of records, call `fetchNextPage`.
      // If there are more records, `page` will get called again.
      // If there are no more records, `done` will get called.
      fetchNextPage();

  }, function done(err) {
      if (err) { console.error(err); return; }
  })  
}

app.get('/list', (req, res) => {
  getNames().then(names => {
      res.render(__dirname + '/views/admin.pug', { names: names })
      res.end()
  })
  res.sendFile(__dirname + '/views/admin.pug') 
})

const listener = app.listen(process.env.PORT, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
