import winston from "winston";
import 'winston-daily-rotate-file';

const logFormat = winston.format.printf(({ level, message, timestamp }) => {
    //template string, modifica el formato de la cadena de texto
    return `${timestamp} [${level.toUpperCase()}] ${message}`;
});

const customLevelOptions = {
    levels: {
        error: 0,
        warning: 1,
        info: 2,
        debug: 3,
    },
    colors: {
        error: "red",
        warning: "yellow",
        info: "green",
        debug: "blue",
    },
};

const fileTransport = new winston.transports.DailyRotateFile({ //DailyRotateFile
    dirname: "./logs",
    filename:"application-%DATE%.log", //application-2024-10-25.log application-2024-10-25.log
    datePattern: "YYYY-MM-DD-HH-mm",
    //vamos a definir una politica de retencion de archivos
   //vamos a comprimir los archivos que ya no se esten usando
    zippedArchive: true,
    //vamos a definir el tamaño de los archivos
    maxSize: "1m",
    //vamos a definir el numero maximo de archivos que vamos a tener disponibles una ves que llguemos a este numero automaticamente los archivos mas antiguos se van a eliminar
    maxFiles: 3,
    //vamos a definir la frecuencia en tiempo que queremos segmentgar nuestos logs
    // recomendado que se segmente por dia
    frecuency:"1m",
    //rewgitrar ek nivel en este caso todos los eventos
    level: "debug",
});

//Vamos a crear nuestro logger
//Para esto tenemos que definir un transporte
const logger = winston.createLogger({
    levels: customLevelOptions.levels,
    format: winston.format.combine(
        winston.format.timestamp({
            format: "YYYY-MM-DD HH:mm:ss",
        }),
        logFormat
    ),
    transports: [
        new winston.transports.Console({
            level: "debug", //mas bajo, menos prioridad, a partir de aqui se registran los eventos
            format: winston.format.colorize({
                all: true,
                colors: customLevelOptions.colors,
            }),
        }),
        //new winston.transports.File({
          //  filename: "logs/error.log", //aqui es donde se van a registrar los eventos
           // level: "warn",
        //}),
        fileTransport,
    ],
});

//Como registrar los eventos en consola
//logger.error("Hello World this is an error");
//logger.warn("Hello World this is a warning");
//logger.info("Hello World with logger");
//logger.http("Hello World this is an http log");
//logger.verbose("Hello World this is a verbose");
//logger.debug("Hello World this is a debug");
//logger.silly("Hello World this is a silly");
export default logger;