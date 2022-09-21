import express, { Request, Response, NextFunction } from 'express'
import MasterRouter from './routers/MasterRouter'
import CustomError from './models/CustomError'
const dotenv = require('dotenv')
const cors = require('cors')

dotenv.config({
    path: '.env'
})

/**
 * @description Main server
 */
class Server {
    public app = express()
    public router = MasterRouter
}

const server = new Server()

server.app.use(cors())

server.app.use('/api', server.router)

server.app.get('/', (req, res) => {
    res.send('Jukka Keränen website backend')
})

server.app.use((err: CustomError, req: Request, res: Response, next: NextFunction) => {
    const statusCode = isNaN(err.statusCode) ? 500 : err.statusCode

    res.status(statusCode).json({
        status: 'error',
        statusCode: err.statusCode,
        message: err.message
    })
})

const port = process.env.NODE_ENV === 'dev' ? process.env.APP_PORT : process.env.PORT
server.app.listen(port, () => console.log(`> Listening on port ${port}`))
