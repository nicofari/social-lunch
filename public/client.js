// client-side js
// run by the browser each time your view template is loaded

const getInputField = (fieldname) => {
  return document.querySelectorAll('form input[name="' + fieldname + '"]')[0]
}

const getDate = () => {
  return getInputField('date')
}

const getName = () => {
  return getInputField('name')
}

const getToday = () => {
  const now = new Date()

  const day = ("0" + now.getDate()).slice(-2)
  const month = ("0" + (now.getMonth() + 1)).slice(-2)

  return now.getFullYear() + "-" + (month) + "-" + (day)
}

document.addEventListener("DOMContentLoaded", () => {

  const dateEl = getDate() //document.querySelectorAll('form input[name="date"]')[0]
  dateEl.value = getToday()

  document.querySelector('form').addEventListener('submit', (event) => {
    event.stopPropagation()
    event.preventDefault()

    const name = getName().value // document.querySelectorAll('form input[name="name"]')[0].value
    const date = getDate().value // document.querySelectorAll('form input[name="date"]')[0].value

    if (!name) {
      alert('Name is mandatory!');
      return;
    }
    axios.post('/form', {
      name: name,
      date: date
    }).then(function (res) {
      console.log('after post')
      alert('Happy to see you, ' + name + '!')
    })
  })
})

const createElement = (elem) => {
  return document.createElement(elem)
}

const createTextCell = (text) => {
  return document.createTextNode(text)
}

const getList = () => {
  const date = getDate().value
  console.log(date)
  axios.get('/list', {
    params: {
      date: date
    }
  }).then(function (res) {
    console.log(res.data)
    const len = res.data.length
    let container = document.getElementById('result_table')
    container.innerHTML = ""
    for (let i = 0; i < len; i++) {
      let tr = createElement('tr')
      let td = createElement('td')
      td.appendChild(createTextCell(res.data[i]))
      tr.appendChild(td)
      container.appendChild(tr)
    }
    let tr = createElement('tr')
    let td = createElement('td')
    td.appendChild(createTextCell('Total: ' + len))
    tr.appendChild(td)
    container.appendChild(tr)
  })
}
