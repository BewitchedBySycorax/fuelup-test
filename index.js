const express = require('express')
const consolidate = require('consolidate')
const fetch = require('node-fetch')

const PORT = process.env.PORT || 8000

const app = express()

app.use(express.static('public'))

app.engine('hbs', consolidate.handlebars)
app.set('view engine', 'hbs')

const apikey = 'd389ce64-1390-402f-8d7d-d5b5ce1248fa'

const fuelUpSource = 'https://aggregator.api.test.fuelup.ru/'

const fetchStationsInfo = `${fuelUpSource}/tanker/station?apikey=${apikey}`
const fetchPricesInfo =   `${fuelUpSource}/tanker/price?apikey=${apikey}`

app.get('/', async (_req, res) => {
  try {
    const 
      outputStationsData = [],
      outputPricesData = []

    await fetch(fetchStationsInfo)
      .then(stationsInfo => stationsInfo.json())
      .then(stationsInfoJSON => {
        stationsInfoJSON.forEach((station, i) => {
          outputStationsData.push({
            Number: i+1,
            Id: station.Id,
            Enable: station.Enable ? 'Да' : 'Нет',
            Name: station.Name,
            Address: station.Address,
            Location: station.Location,
            PostPay: station.PostPay ? 'Да' : 'Нет',
            Columns: Object.values(station.Columns).map((column, i) => {

              /** Попытка вывести названия горючего на русском языке:
                * необходимо дополнительно распарсить строки с индентификаторами,
                * которые являются эелементами массива
                */

              // switch(column[i]) {
              //   case 'diesel':
              //     column[i] = 'дизель'
              //     // return 'дизель'
              //     break
              //   case 'diesel_premium':
              //     column[i] = 'брендированный дизель'
              //     // return 'брендированный дизель'
              //     break
              //   case 'a80':
              //     return column[i] = 'бензин марки А80'
              //     // return 'бензин марки А80'
              //     break
              //   case 'a92':
              //     return column[i] = 'бензин марки А92'
              //     // return 'бензин марки А92'
              //     break
              //   case 'a92_premium':
              //     column[i] = 'брендированный бензин марки А92'
              //     // return 'брендированный бензин марки А92'
              //     break
              //   case 'a95':
              //     column[i] = 'бензин марки А95'
              //     // return 'бензин марки А95'
              //     break
              //   case 'a95_premium':
              //     column[i] = 'брендированный бензин марки А95'
              //     // return 'брендированный бензин марки А95'
              //     break
              //   case 'a98':
              //     column[i] = 'бензин марки А98'
              //     // return 'бензин марки А98'
              //     break
              //   case 'a98_premium':
              //     column[i] = 'брендированный бензин марки А98'
              //     // return 'брендированный бензин марки А98'
              //     break
              //   case 'a100':
              //     column[i] = 'бензин марки А100'
              //     // return 'бензин марки А100'
              //     break
              //   case 'a100_premium':
              //     column[i] = 'брендированный бензин марки А100'
              //     // return 'брендированный бензин марки А100'
              //     break
              //   case 'propane':
              //     column[i] = 'газ пропан'
              //     // return 'газ пропан'
              //     break
              //   case 'metan':
              //     column[i] = 'метан'
              //     // return 'метан'
              //     break
              //   default:
              //     // return
              //     break
              // }

              return `${i+1}. ${column}`
            })
          })
        })
      })

    await fetch(fetchPricesInfo)
      .then(pricesInfo => pricesInfo.json())
      .then(pricesInfoJSON => {
        pricesInfoJSON.forEach(fuel => {
          outputPricesData.push({
            StationId: fuel.StationId,
            ProductId: fuel.ProductId,
            Price: fuel.Price,
          })
        })
      })

    res.render('gas-stations', {
      outputData: {
        stations: outputStationsData,
        prices: outputPricesData
      },
      title: 'Gas station info with fuel prices'
    })

  } catch (err) {
    console.error(err.message)
  }
})

app.listen(PORT, () => console.log(`Server has been started on localhost: ${PORT}`))
