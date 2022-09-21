export default class CustomError extends Error {
    constructor (
        public statusCode: number,
        public message: string
    ) {
        super()
    }
}
