const express = require('express')
const app = express()
const Airtable = require('airtable')
const formidable = require('formidable')
const dotenv = require('dotenv')
const cloudinary = require('cloudinary').v2

dotenv.config()

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_NAME);

app.use(express.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
})

const findByName = (name, date) => {
  return new Promise((resolve, reject) => {
    const formula = "AND(UPPER({Name})=UPPER('" + name + "'),{Date}=DATETIME_PARSE('" + date + "'))"
    console.log(formula)
    base('Subscriptions').select({
      maxRecords: 56,
      filterByFormula: formula
    }).firstPage((err, records) => {
      if (err) {
        console.log(err)
        reject(err)
        return
      }
      resolve(records)
    })
  })
}

app.post('/form', (req, res) => {
  const name = req.body.name
  const date = req.body.date
  console.log(name)
  console.log(date)

  findByName(name, date).then(records => {
    if (records.length > 0) {
      res.status(200).type('json').send({ errorMsg: name + ' sei già in lista grazie!' })
    } else {
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
    }
  })
})

app.post('/deleteme', (req, res) => {
  const name = req.body.name
  const date = req.body.date
  console.log(name)
  console.log(date)

  findByName(name, date).then(records => {
    if (records.length === 0) {
      res.status(200).type('json').send({ errorMsg: name + ' non sei nella lista!' })
    } else {
      const id = records[0].getId()
      base('Subscriptions').destroy(id, (err, record) => {
        if (err) {
          console.error(err)
          return
        }
      })
      res.status(200).type('json').end()
    }
  })
})

const getNames = (date) => {
  return new Promise((resolve, reject) => {
    base('Subscriptions').select({
      maxRecords: 56,
      filterByFormula: 'Date=DATETIME_PARSE("' + date + '")'
    }).firstPage((err, records) => {
      if (err) {
        reject(err)
        return
      }
      resolve(records)
    })
  })
}

app.get('/list', (req, res) => {
  const ret = []
  const date = req.query.date
  console.log('date = ' + date)
  getNames(date).then(records => {
    records.forEach(record => {
      const name = record.get('Name')
      console.log(name)
      ret.push(name)
    })
    console.log('return names')
    res.status(200).type('json').end(JSON.stringify(ret))
  }).catch(err => {
    console.log(err)
  })

})

app.post('/upload_menu', (req, res) => {
  const form = new formidable.IncomingForm()

  form.parse(req)

  form.on('fileBegin', (name, file) => {
    file.path = __dirname + '/' + file.name
  })

  form.on('file', (name, file) => {
    console.log('uploaded: ' + file.name)
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    })

    cloudinary.uploader.upload(file.name, {
      tags: 'social_lunch_menu',
      public_id: 'social_lunch_menu'
    }).then((image) => {
      console.log();
      console.log("** File Upload (Promise)")
      console.log("* " + image.public_id)
      console.log("* " + image.url)
    })
      .catch((err) => {
        console.log()
        console.log("** File Upload (Promise)")
        if (err) { console.warn(err) }
      })
  })

  res.status(200).type('json').send({ success: true })
})

const listener = app.listen(process.env.PORT, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
