import * as winston from 'winston';

const logger: winston.Logger = winston.createLogger({
    level: 'debug',
    format: winston.format.combine(
        winston.format.splat(),
        winston.format.simple(),
        winston.format.json()
    ),
    defaultMeta: { service: 'notifications-module' },    
    transports: [
        new winston.transports.Console({
            format: winston.format.timestamp()
        })
    ]
});


export default logger;