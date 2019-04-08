// client-side js
// run by the browser each time your view template is loaded

document.addEventListener("DOMContentLoaded", () => {
  var now = new Date();

  var day = ("0" + now.getDate()).slice(-2);
  var month = ("0" + (now.getMonth() + 1)).slice(-2);

  var today = now.getFullYear()+"-"+(month)+"-"+(day) ;
  
  const dateEl = document.querySelectorAll('form input[name="date"]')[0]
  dateEl.value = today
  
  document.querySelector('form').addEventListener('submit', (event) => {
    event.stopPropagation()
    event.preventDefault()

    const name = document.querySelectorAll('form input[name="name"]')[0].value
    const date = document.querySelectorAll('form input[name="date"]')[0].value
    
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

const getList = () => {
  axios.get('https://api.airtable.com/v0/appf7mrRY6a3xK8jT/Subscriptions?maxRecords=3&view=Grid%20view', { 
                                headers: { Authorization: "Bearer "+'key1t0VRiFHd7Kuj8'} 
                            }).then(function (res) {
    console.log(res.data.records)
    let container = document.getElementById('result_table')
    for (let i=0; i < res.data.records.length; i++) {
      let tr = document.createElement('tr')
      let td = document.createElement('td')
      td.appendChild(document.createTextNode(res.data.records[i].fields.Name))
      tr.appendChild(td)
      container.appendChild(tr)
    }
  })
}
