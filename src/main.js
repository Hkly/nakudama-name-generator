import './style.scss'

function generateNames() {
  return Array(8).fill('Placeholder Name')
}

document.querySelector('#app').innerHTML = `
  <h1>Nakudama Name Generator</h1>
  <button id="generate-btn">Generate Names</button>
  <div id="results"></div>
`

document.querySelector('#generate-btn').addEventListener('click', () => {
  const names = generateNames()
  const results = document.querySelector('#results')
  results.innerHTML = `
    <ul class="name-grid">
      ${names.map(name => `<li>${name}</li>`).join('')}
    </ul>
  `
})
