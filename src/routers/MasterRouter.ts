import { Router } from 'express'
import QuestRouter from './QuestRouter/QuestRouter'

class MasterRouter {
    private readonly _router = Router()
    private readonly _questRouter = QuestRouter

    get router (): Router {
        return this._router
    }

    constructor () {
        this._configure()
    }

    /**
   * Connect routes to their matching routers.
   */
    private _configure (): void {
        this._router.use('/quest', this._questRouter)
    }
}

export = new MasterRouter().router
