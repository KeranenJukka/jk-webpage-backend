import connection from '../../config/database'
import CustomError from '../../models/CustomError'
import Quest from '../../models/Quest'
import { v1 as uuidv1 } from 'uuid'
import { Request } from 'express'
const requestIp = require('request-ip')

class QuestController {
    private getPromiseConnection () {
        return connection.promise()
    }

    /**
     * @param {string} uuid
     * @param {number} visitingTimes
     * @returns {Promise<boolean>}
     */
    private async updateQuestInformation (uuid: string, visitingTimes: number): Promise<boolean> {
        const timesVisited = visitingTimes + 1
        const date: Date = new Date()
        const lastVisited: string = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`

        const sql = 'UPDATE quest SET times_visited = ?, last_visited = ? WHERE uuid = ?'

        const promiseConnection = this.getPromiseConnection()
        await promiseConnection.execute(sql, [timesVisited, lastVisited, uuid])
        return true
    }

    /**
     * @param {string} questIp
     * @returns {Promise<number>}
     */
    private async createQuest (questIp: string): Promise<string> {
        const promiseConnection = this.getPromiseConnection()

        const uuid: string = uuidv1()
        const ip: string = `${questIp}`
        const date: Date = new Date()
        const lastVisited: string = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
        const timesVisited: number = 1

        const sql = 'INSERT INTO quest (uuid, ip, last_visited, times_visited) VALUES(?, ?, ?, ?)'

        await promiseConnection.execute(sql, [uuid, ip, lastVisited, timesVisited])

        return uuid
    }

    /**
     * @param {string} clientIp
     * @returns {Promise<Quest | null>}
     */
    private async findQuestFromDatabase (clientIp: string): Promise<Quest | null> {
        const sql: string = 'SELECT * FROM quest WHERE ip = ?'

        const promiseConnection: any = this.getPromiseConnection()
        const result: any = await promiseConnection.execute(sql, [clientIp])

        if (result[0].length > 0) {
            return new Quest(
                result[0][0].id,
                result[0][0].uuid,
                result[0][0].ip,
                result[0][0].last_visited,
                result[0][0].times_visited,
                result[0][0].website_rating
            )
        }

        return null
    }

    /**
     * @param {Request} req
     * @returns {Promise<number>}
     */
    public async getQuest (req: Request): Promise<string> {
        const clientIp: string = `${requestIp.getClientIp(req)}`
        const quest: Quest | null = await this.findQuestFromDatabase(clientIp)

        if (quest === null) {
            const uuid: string = await this.createQuest(clientIp)
            return uuid
        }

        await this.updateQuestInformation(quest.uuid, quest.timesVisited)
        return quest.uuid
    }

    /**
     * @param {Request} req
     * @returns {Promise<boolean>}
     */
    public async addWebsiteRating (req: Request): Promise<boolean> {
        const questUuid: any = req.query.uuid

        const promiseConnection = this.getPromiseConnection()

        const questSql: string = 'SELECT * FROM quest WHERE uuid = ?'
        const result: any = await promiseConnection.execute(questSql, [questUuid])

        if (result[0].length === 0) {
            throw new CustomError(400, 'Bad request')
        }

        const rating: any = req.query.rating

        const sql = 'UPDATE quest SET website_rating = ? WHERE uuid = ?'
        await promiseConnection.execute(sql, [rating, questUuid])

        return true
    }
}

export default new QuestController()
