
import { NextFunction, Request, Response, Router } from 'express'
import QuestController from '../../controllers/QuestController/QuestController'

class QuestRouter {
    private readonly _router: Router = Router()
    private readonly _controller = QuestController

    get router (): Router {
        return this._router
    }

    constructor () {
        this._configure()
    }

    private _configure (): void {
        this._router.post('/', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const result = await this._controller.getQuest(req)
                res.status(200).json(result)
            } catch (error) {
                next(error)
            }
        })

        this._router.put('/', async (req: Request, res: Response, next: NextFunction) => {
            try {
                await this._controller.addWebsiteRating(req)
                res.status(200).json('rating added')
            } catch (error) {
                next(error)
            }
        })
    }
}

export = new QuestRouter().router
