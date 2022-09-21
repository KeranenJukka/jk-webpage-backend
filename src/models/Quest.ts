export default class Quest {
    id: number
    uuid: string
    ip: string
    lastVisited: string
    timesVisited: number
    websiteRating: number

    constructor (
        id: number,
        uuid: string,
        ip: string,
        lastVisited: string,
        timesVisited: number,
        websiteRating: number
    ) {
        this.id = id
        this.uuid = uuid
        this.ip = ip
        this.lastVisited = lastVisited
        this.timesVisited = timesVisited
        this.websiteRating = websiteRating
    }
}
