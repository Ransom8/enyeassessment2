const express = require('express');
const superagent = require('superagent');
const AppError = require('./utils/appError');

const app = express();

app.get('/', (req, res, next)=>{
  res.send('<h1>Welcome to currency conversion app</h1>' +
  '<p> click <a href="https://currency-i.herokuapp.com/api/rates?base=CZK&currency=EUR,GBP,USD">here</a> to test</p>');
});

app.get('/api/rates', async (req, res, next) => {

  try {

    let obj = {};
    const {
      base,
      currency
    } = req.query;

    const {
      body: {
        rates
      }
    } = await superagent(`https://api.exchangeratesapi.io/latest?base=${base}`);

    currency.split(',').forEach(el => {
      if (el in rates) {
        obj[el] = rates[el]
      }
    });


    res.status(200).json({
      result: {
        "base": base,
        "date": new Date(Date.now()).toISOString().slice(0, 10),
        "rates": obj
      }
    })

  } catch (err) {
    return next(new AppError(err.message, 400))
  }
});

app.all('*', (req, res, next) => {
  throw next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use((err, req, res, next) => {

  throw res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  });
})

app.listen(process.env.PORT || 3000, () => console.info("Server connected successfully!"));