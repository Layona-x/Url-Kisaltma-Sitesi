const mongoose = require('mongoose')

const conn = () => {
  mongoose
  .connect(process.env.db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    console.log('Mongoose Confirm')
  })
  .catch((err) => console.log(err));
}

module.exports = conn;