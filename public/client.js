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

document.addEventListener("DOMContentLoaded", () => {
  var now = new Date();

  var day = ("0" + now.getDate()).slice(-2);
  var month = ("0" + (now.getMonth() + 1)).slice(-2);

  var today = now.getFullYear()+"-"+(month)+"-"+(day) ;
  
  const dateEl = getDate() //document.querySelectorAll('form input[name="date"]')[0]
  dateEl.value = today
  
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
console.log(getDate().value)  
  axios.get('https://api.airtable.com/v0/appf7mrRY6a3xK8jT/Subscriptions?maxRecords=50&view=Grid%20view&filterByFormula=Date=DATETIME_PARSE("'+getDate().value+'")', { 
        headers: { Authorization: "Bearer "+'key1t0VRiFHd7Kuj8'} 
    }).then(function (res) {
    console.log(res.data.records)
    let container = document.getElementById('result_table')
    container.innerHTML = ""
    for (let i=0; i < res.data.records.length; i++) {
      let tr = createElement('tr')
      let td = createElement('td')
      td.appendChild(createTextCell(res.data.records[i].fields.Name))
      tr.appendChild(td)
      container.appendChild(tr)
    }
    let tr = createElement('tr')
    let td = createElement('td')
    td.appendChild(createTextCell('Total: ' + res.data.records.length))
    tr.appendChild(td)
    container.appendChild(tr)
  })
}
