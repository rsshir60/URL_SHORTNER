/* ### POST /url/shorten
- Create a short URL for an original url recieved in the request body.
- The baseUrl must be the application's baseUrl. Example if the originalUrl is http://abc.com/user/images/name/2 then the shortened url should be http://localhost:3000/xyz
- Return the shortened unique url. Refer [this](#url-shorten-response) for the response
- Ensure the same response is returned for an original url everytime
- Return HTTP status 400 for an invalid request */

const catchCont = require('../controller/redisCont');
const urlModel = require('../models/UrlModel');
const axios = require('axios');
const AppError = require('../error/AppError');

exports.createShortUrl = async (req, res, next) => {
  // HANDLING IF BODY IS EMPTY
  if (!Object.keys(req.body).length || !req.body.longUrl) {
    return next(new AppError(`Invalid input from body!`, 400));
  }

  const { longUrl } = req.body;
  // CHECKING IN CATCH
  const dataCatch = await catchCont.getFromCache(longUrl);
  if (dataCatch) {
    return res.status(200).json({
      status: true,
      from: 'catch',
      data: {
        data: JSON.parse(dataCatch),
      },
    });
  }

  // CHECKING IN DATA-BASE
  const dataDb = await urlModel.findOne({ longUrl });
  if (dataDb) {
    // ADD IN CATCH
    catchCont.addToCache(dataDb);
    return res.status(200).json({
      status: true,
      from: 'db',
      data: {
        data: dataDb,
      },
    });
  }

  // VERIFICATION OF VALID URL THROUGH axios
  try {
    await axios.get(longUrl, {
      headers: { 'Accept-Encoding': 'gzip,deflate,compress' },
    });

    // GENERATING URL-CODE
    req.body.urlCode = (Math.random() + 1).toString(36).substring(7);
    req.body.shortUrl = `http://localhost:3000/${req.body.urlCode}`;

    // STORING IN DATA-BASE
    const data = await urlModel.create(req.body);

    // STORING IN CATCH
    catchCont.addToCache(data);
    return res.status(200).json({
      status: true,
      from: 'db',
      data: {
        data,
      },
    });
  } catch (error) {
    // ERROR FOR INVALID REQUEST
    return next(new AppError(`Invalid Url!! Please provide a valid Url.`, 400));
  }
};