import pino from 'pino'

const isDevelopment = process.env.NODE_ENV !== 'production'

const pinoConfig: pino.LoggerOptions = {
  level: isDevelopment ? 'debug' : 'info',
}

const logger = pino(pinoConfig)

export default logger
