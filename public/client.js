
const getInputField = (fieldname) => {
  return document.querySelectorAll('form input[name="' + fieldname + '"]')[0]
}

const getDate = () => {
  return getInputField('date')
}

const getName = () => {
  return getInputField('name')
}

const getCourse = () => {
  return getInputField('courseChoice')
}

const getToday = () => {
  const now = new Date()

  const day = ("0" + now.getDate()).slice(-2)
  const month = ("0" + (now.getMonth() + 1)).slice(-2)

  return now.getFullYear() + "-" + (month) + "-" + (day)
}

const uploadMenu = () => {
  var formData = new FormData()
  var imagefile = document.querySelector('#menu_file')
  const image = imagefile.files[0]
  if (!image) {
    errorDialog('Nessun file selezionato!')
    return
  }
  formData.append("image", image)
  showCover()
  axios.post('upload_menu', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }).then(res => {
    hideCover()
    successDialog('Invio completato', 'File salvato!')
  }).catch(err => {
    hideCover()
    errorDialog('Upload fallito: errore: ' + err.message)
  })
}

document.addEventListener("DOMContentLoaded", () => {

  const dateEl = getDate()
  dateEl.value = getToday()

  if (localStorage.username) {
    getName().value = localStorage.username
  }

  setDownloadLink()

  document.querySelector('#name_form').addEventListener('submit', (event) => {
    event.stopPropagation()
    event.preventDefault()

    const name = getName().value
    const date = getDate().value
    const course = getCourse().value
    const rememberMe = getRememberMe().value

    if (!name) {
      errorDialog('Il nome è obbligatorio!');
      return;
    }
    if (rememberMe) {
      localStorage.username = name
    }

    showCover()
    axios.post('/form', {
      name: name,
      date: date,
      course: course
    }).then(function (res) {
      hideCover()
      const errorMsg = res.data.errorMsg
      if (errorMsg) {
        errorDialog(errorMsg)
      } else {
        successDialog('Felice di vederti ' + name + '!', 'Sei in lista!')
      }
    })
  })
})

const successDialog = (mainMsg, smallMsg) => {
  Swal.fire(mainMsg, smallMsg, 'success')
}

const errorDialog = (msg) => {
  Swal.fire({
    type: 'error',
    title: 'Oops...',
    text: msg
  })
}
const setDownloadLink = () => {
  axios.get('/download_info').then(res => {
    const data = res.data
    let downloadEl = getElement('download_menu')
    let a = document.createElement('a')
    const linkText = document.createTextNode('Scarica il menù del ' + data.changed_at)
    a.appendChild(linkText)
    a.title = 'Scarica il menù'
    a.href = data.link
    a.setAttribute('target', '_blank')
    downloadEl.appendChild(a)
  })
}

const showCover = () => {
  getCover().style.display = 'block'
}

const hideCover = () => {
  getCover().style.display = 'none'
}

const getCover = () => {
  return getElement('cover')
}

const getElement = (id) => {
  return document.getElementById(id)
}

const getRememberMe = () => {
  return getInputField('rememberMe')
}

const getList = () => {
  showCover()
  const date = getDate().value
  axios.get('/list', {
    params: {
      date: date
    }
  }).then(function (res) {
    hideCover()
    const len = res.data.length
    let container = document.getElementById('result_table')
    container.innerHTML = ""
    let trh = getTableRow()
    let tdh1 = getTableHeaderCell()
    tdh1.appendChild(createTextCell('Nome'))
    trh.appendChild(tdh1)
    let tdh2 = getTableHeaderCell()
    tdh2.appendChild(createTextCell('Piatto scelto'))
    trh.appendChild(tdh2)
    container.appendChild(trh)
    for (let i = 0; i < len; i++) {
      const name = res.data[i].name
      const course = res.data[i].course || '<nessuna scelta>'
      let tr = createElement('tr')
      let td = createElement('td')
      td.appendChild(createTextCell(name))
      let tdCourse = createElement('td')
      tr.appendChild(td)
      tdCourse.appendChild(createTextCell(course))
      tr.appendChild(tdCourse)
      container.appendChild(tr)
    }
    let tr = createElement('tr')
    let td = createElement('td')
    td.appendChild(createTextCell('Totale: ' + len))
    tr.appendChild(td)
    container.appendChild(tr)
  })
}

const getTableRow = () => {
  return createElement('tr')
}

const getTableCell = () => {
  return createElement('td')
}

const getTableHeaderCell = () => {
  return createElement('th')
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
  showCover()
  axios.post('/deleteme', {
    name: name,
    date: date
  }).then(function (res) {
    hideCover()
    const errorMsg = res.data.errorMsg
    if (errorMsg) {
      errorDialog(errorMsg)
    } else {
      successDialog('Ci mancherai ' + name + '!', 'Non sei più in lista')
    }
  })

}