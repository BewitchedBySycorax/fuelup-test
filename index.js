// const express = require('express')
const server = require('express')()
const consolidate = require('consolidate')
const fetch = require('node-fetch')

const PORT = process.env.PORT || 8000

const apikey = 'd389ce64-1390-402f-8d7d-d5b5ce1248fa'

const fuelUpSource = 'https://aggregator.api.test.fuelup.ru/'

const fetchStationsInfo = `${fuelUpSource}/tanker/station?apikey=${apikey}`
const fetchPricesInfo =   `${fuelUpSource}/tanker/price?apikey=${apikey}`

server.engine('hbs', consolidate.handlebars)
server.set('view engine', 'hbs')

server.get('/', async (_req, res) => {
  try {
    const outputData = []

    await fetch(fetchStationsInfo)
      .then(data => data.json())
      .then(dataJSON => {
        dataJSON.forEach((currentStation, i) => {
          outputData.push({
            Number: i+1,
            Id: currentStation.Id,
            Enable: currentStation.Enable,
            Name: currentStation.Name,
            Address: currentStation.Address,
            // Location: JSON.stringify(currentStation.Location),
            // Columns: JSON.stringify(currentStation.Columns)
          })
        })
      })

    res.render('gas-stations', { outputData: outputData, title: 'Gas station info with prices' })

  } catch (err) {
    console.error(err.message)
  }
})

server.listen(PORT, () => console.log(`Server has been started on localhost: ${PORT}`))
