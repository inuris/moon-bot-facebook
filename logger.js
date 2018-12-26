const fs = require('fs');
const winston = require('winston');

const filename = './log.txt';

//
// Create a new winston logger instance with two tranports: Console, and File
const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename })
  ]
});

module.exports = {
  logger:logger
}