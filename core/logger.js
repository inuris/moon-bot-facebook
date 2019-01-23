const winston = require('winston');

// define the custom settings for each transport (file, console)
const options = {
  infofile: {
    level: 'info',
    filename: './core/info.json',
    handleExceptions: true,
    json: true,
    colorize: false
  },
  errorfile: {
    level: 'error',
    filename: './core/error.json',
    handleExceptions: true,
    json: true,
    colorize: false
  },
  console: {
    level: 'info',
    handleExceptions: true,
    json: false,
    colorize: true
  }  
};

// instantiate a new Winston Logger with the settings defined above
const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.splat(),
    winston.format.simple()
  ),
  transports: [
    new winston.transports.File(options.infofile),    
    new winston.transports.File(options.errorfile),
    new winston.transports.Console(options.console)
  ],
  exitOnError: false // do not exit on handled exceptions
});

module.exports = {
   logger
 } 