require('dotenv').config()
const fetch = require('node-fetch')

let count = 0

const run = async () => {
  fetch('https://fs-api.etherisc.com/api/v1/status-oracle', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ carrierFlightNumber: 'LH/117', yearMonthDay: '2021/12/14' }),
  }).then((response) => {
    count += 1
    console.log(`Call #${count}, response = ${response.status} ${response.statusText}`)
  })

  setTimeout(run, 200)
}

run()
  .then(console.log)
  .catch(console.error)
