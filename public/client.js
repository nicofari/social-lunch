
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

  const dateEl = getDate()
  dateEl.value = getToday()

  if (localStorage.username) {
    getName().value = localStorage.username
  }

  document.querySelector('form').addEventListener('submit', (event) => {
    event.stopPropagation()
    event.preventDefault()

    const name = getName().value
    const date = getDate().value
    const rememberMe = getRememberMe().value

    if (!name) {
      alert('Il nome è obbligatorio!');
      return;
    }
    if (rememberMe) {
      localStorage.username = name
    }
    axios.post('/form', {
      name: name,
      date: date
    }).then(function (res) {
      const errorMsg = res.data.errorMsg
      if (errorMsg) {
        alert(errorMsg)
      } else {
        alert('Felice di vederti ' + name + '!')
      }
    })
  })
})

const getRememberMe = () => {
  return getInputField('rememberMe')
}

const getList = () => {
  const date = getDate().value
  axios.get('/list', {
    params: {
      date: date
    }
  }).then(function (res) {
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
    td.appendChild(createTextCell('Totale: ' + len))
    tr.appendChild(td)
    container.appendChild(tr)
  })
}

const createElement = (elem) => {
  return document.createElement(elem)
}

const createTextCell = (text) => {
  return document.createTextNode(text)
}

const deleteMe = () => {
  const name = getName().value
  const date = getDate().value

  axios.post('/deleteme', {
    name: name,
    date: date
  }).then(function (res) {
    const errorMsg = res.data.errorMsg
    if (errorMsg) {
      alert(errorMsg)
    } else {
      alert('Ci mancherai ' + name + '!')
    }
  })

}