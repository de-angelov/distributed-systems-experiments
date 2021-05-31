import winston , { format as wf, transports as wts } from 'winston';


//todo get from enviorment
const name = "TODO service name"; 
const level = "info";
const format =  
    wf.combine(
        wf.timestamp(),
        wf.json()
    )

const defaultMeta =  { service: name }

const logFiles = 
    [
        { filename: name + ' error.log', level: 'error' }, 
        { filename: name +  ' combined.log' }
    ];

const consoleSettings = 
    {
        format: wf.combine(
                    wf.timestamp(),
                    wf.colorize(),
                    wf.simple()
                )
    }

const transports = 
    [
        ...logFiles.map(x => new wts.File(x)),
        new wts.Console(consoleSettings)
    ]

const config = { level, format, defaultMeta, transports };

export const logger = winston.createLogger(config);

export type loggerT = typeof logger;


 