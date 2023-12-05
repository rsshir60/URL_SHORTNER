/* ### GET /:urlCode
- Redirect to the original URL corresponding
- Use a valid HTTP status code meant for a redirection scenario.
- Return a suitable error for a url not found
- Return HTTP status 400 for an invalid request */

const AppError = require('../error/AppError');
const Url = require('../models/UrlModel');
const {getFromCache, addToCache } = require('./redisCont');
 
exports.getUrl = async (req, res, next) => {
    const {urlCode } = req.param;

    //CHECKING IN CATCH
    const dataCatch =await getFromCache(urlCode);
    if (dataCatch) {
        return res.redirect(302,dataCatch);
    }
    //CHECK IN DATABASE
    const dataDb = await Url.findOne(req.params);
    if (dataDb) {
        //ADDING IN CATCH 
        addToCache(dataDb);
        return res.redirect(302, dataDb.longUrl);

    }
    
    //RETURN ERROR FOR INVALID REQUEST
    next(
        new AppError(
          `UrlCode: ${urlCode} is not present!! Please use a valid urlCode`,
          400
        )
      );
};
