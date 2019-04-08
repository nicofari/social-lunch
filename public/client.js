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
