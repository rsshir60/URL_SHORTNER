const express = require('express');
const cors = require('cors');
require('dotenv').config({path: './config.env'});
const mongoose = require('mongoose');
const AppError = require('./error/AppError');
const router = require('./routes/route');
const { globalErrorHandler } = require('./error/globalErrorHandler');

const app = express();
app.use(express.json());
app.use(cors());
//MONGOOSE CONNECTION
mongoose.set('strictQuery',false);
mongoose
.connect(process.env.MONGODB)
.then((conn) => {
    console.log('MongoDB is connect successfully...!');

})
.catch((err) => console.log(err));

//TRANSFERRING ALL REQUEST TO ROUTER
app.use('/' , router);

//ALL OTHER ROUTE HANDLER
app.all('*', (req, res, next) => {
    return next(
      new AppError(`The url ${req.originalUrl} not found on server`, 404)
    );
  });
  //GLOBAL ERROR HANDLER
  app.use(globalErrorHandler);

  const port = process.env.PORT || 3000;
  
  app.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });
