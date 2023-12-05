// ### Models
// - Url Model
// ```
// { urlCode: { mandatory, unique, lowercase, trim }, longUrl: {mandatory, valid url}, shortUrl: {mandatory, unique} }

const mongoose = require('mongoose');
const valid = require('validator');

const urlSchema = new mongoose.Schema({
  // urlCode: { mandatory, unique, lowercase, trim }
  urlCode: {
    type: String,
    required: [true, 'Please provide UrlCode!'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  // longUrl: {mandatory, valid url}
  longUrl: {
    type: String,
    trim: true,
    required: [true, 'Please provide a valid Url!'],
    lowercase: true,
  },
  // shortUrl: {mandatory, unique}
  shortUrl: {
    type: String,
    required: [
      true,
      'Please provide a shortUrl like tiny.com or tiny.co.in etc',
    ],
    unique: true,
  },
});

const Url = mongoose.model('Url', urlSchema);
module.exports = Url;