var winston = require('winston');

// define the custom settings for each transport (file, console)
var options = {
  infofile: {
    level: 'info',
    filename: `./logs/info.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
  },
  infoconsole: {
    level: 'info',
    handleExceptions: true,
    json: false,
    colorize: true,
  },
  errorfile: {
    level: 'error',
    filename: `./logs/error.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
  },
  errorconsole: {
    level: 'error',
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};

// instantiate a new Winston Logger with the settings defined above
var logger = winston.createLogger({
  transports: [
    new winston.transports.File(options.infofile),
    new winston.transports.Console(options.infoconsole),
    new winston.transports.File(options.errorfile),
    new winston.transports.Console(options.errorconsole),
  ],
  exitOnError: false, // do not exit on handled exceptions
});

module.exports = logger;