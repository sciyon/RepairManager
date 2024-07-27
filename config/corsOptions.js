const allowedOrigins = require('./allowedOrigins')

const corsOptions = {
  origin: (origin, callback) => {
    if(allowedOrigins.indexOf(origin) !== -1 || !origin){
      //if origin is in allowed websites, or has NO origin
      callback(null, true) 
    }else{
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true, 
  optionsSuccessStatus: 200 //smartTVs, old browsers
}

module.exports = corsOptions