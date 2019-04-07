// client-side js
// run by the browser each time your view template is loaded

document.addEventListener("DOMContentLoaded", () => {
  
  const dateEl = document.querySelectorAll('form input[name="date"]')[0]
  dateEl.value = 
  
  document.querySelector('form').addEventListener('submit', (event) => {
    event.stopPropagation()
    event.preventDefault()

    const name = document.querySelectorAll('form input[name="name"]')[0].value
    const date = document.querySelectorAll('form input[name="date"]')[0].value
    
    axios.post('/form', {
      name,
      date
    })    
  })
})
