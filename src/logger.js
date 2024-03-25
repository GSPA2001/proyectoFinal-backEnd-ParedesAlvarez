import winston from "winston";
import chalk from "chalk"; //chalk para agregar colores
import config from "./config.js";
import { __dirname } from "./utils.js";

const customLevels = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
  colors: {
    fatal: "red",
    error: "red",
    warning: "yellow",
    info: "green",
    http: "blue",
    debug: "blue",
  },
  levelNames: [
    "fatal",
    "error",
    "warning",
    "info",
    "http",
    "debug",
  ],
};

// Define the system of nivels
const getLevel = (level) => {
  return customLevels.levels[level] || 5; //default
};

// Crea los loggers
const devLogger = winston.createLogger({
  level: "debug",
  levels: customLevels.levels,
  transports: [
    new winston.transports.Console({
      level: "debug",
      format: winston.format.combine(
        winston.format.label({ label: "development" }),
        winston.format.timestamp(),
        winston.format.printf(({ level, message, timestamp, label }) => {
          let colorizedMessage = message;
          if (level === "error" || level === "fatal") {
            colorizedMessage = chalk.red(message);
          } else if (level === "warning") {
            colorizedMessage = chalk.yellow(message);
          } else if (level === "info") {
            colorizedMessage = chalk.green(message);
          } else if (level === "debug" || level === "http") {
            colorizedMessage = chalk.blue(message);
          }
          return `${label} [${customLevels.levelNames[getLevel(level)]}] ${timestamp} ${colorizedMessage}`;
        })
      ),
    }),
  ],
});

const prodLogger = winston.createLogger({
  level: "error",
  levels: customLevels.levels,
  transports: [
    new winston.transports.Console({
      level: "info",
      format: winston.format.combine(
        winston.format.label({ label: "production" }),
        winston.format.timestamp(),
        winston.format.prettyPrint(),
      ),
    }),
    new winston.transports.File({
      level: "info",
      filename: `${__dirname}/logs/errors.log`,
      format: winston.format.combine(
        winston.format.label({ label: "production" }),
        winston.format.timestamp(),
        winston.format.prettyPrint(),
      ),
    }),
  ],
});

export const addLogger = (req, res, next) => {
  req.logger =
    config.MODE === "devel" ? devLogger : prodLogger;
  req.logger.http(
    `${new Date().toDateString()} ${req.method} ${req.url}`,
    { message: `${req.method} ${req.url}` }
  );
  next();
};

export default addLogger;