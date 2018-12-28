import { createLogger, format as _format, transports as _transports } from 'winston';

// define the custom settings for each transport (file, console)
const options = {
  infofile: {
    level: 'info',
    filename: './info.txt',
    handleExceptions: true,
    json: true,
    colorize: false
  },
  errorfile: {
    level: 'error',
    filename: './error.txt',
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
const logger = createLogger({
  format: _format.combine(
    _format.splat(),
    _format.simple()
  ),
  transports: [
    new _transports.File(options.infofile),    
    new _transports.File(options.errorfile),
    new _transports.Console(options.console)
  ],
  exitOnError: false // do not exit on handled exceptions
});

export default {
   logger
 } 