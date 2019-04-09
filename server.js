const express = require('express')
const app = express()
const Airtable = require('airtable')

const dotenv = require('dotenv')
dotenv.config()

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
  await base('Subscriptions').select({
      maxRecords: 56
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

app.get('/list', async (req, res) => {
  await getNames().then(names => {
//      res.render(__dirname + '/views/list.pug', { names: names })
    res.status(200).type('json').end(JSON.stringify(names))
  })
  //res.sendFile(__dirname + '/views/list.pug') 
})

const listener = app.listen(process.env.PORT, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
