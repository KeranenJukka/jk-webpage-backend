import { describe, expect, test, jest, afterEach } from '@jest/globals'
import QuestController from './QuestController'
import connection from '../../config/database'

jest.mock('request-ip', () => {
    return {
        getClientIp: () => '1.2.3.4.5'
    }
})

afterEach(() => {
    jest.resetAllMocks()
})

describe('QuestController', () => {
    test('getQuest creates a new quest when quest not found', async () => {
        const executeFunction = {
            execute: jest
                .fn()
                .mockImplementationOnce(() => {
                    return [[]]
                })
                .mockImplementationOnce(() => {
                    return [[]]
                })
        }

        jest.spyOn(connection, 'promise')
            .mockImplementationOnce(() => executeFunction)
            .mockImplementationOnce(() => executeFunction)

        const mockRequest = {}
        const result = await QuestController.getQuest(mockRequest)
        expect(executeFunction.execute).toHaveBeenCalledWith('SELECT * FROM quest WHERE ip = ?', ['1.2.3.4.5'])

        const sql = 'INSERT INTO quest (uuid, ip, last_visited, times_visited) VALUES(?, ?, ?, ?)'
        expect(executeFunction.execute).toHaveBeenCalledWith(sql, [expect.anything(), '1.2.3.4.5', expect.anything(), 1])

        const regex = /[a-z0-9]*-[a-z0-9]*-[a-z0-9]*-[a-z0-9]*-[a-z0-9]*/
        expect(result).toEqual(expect.stringMatching(regex))
    })

    test('getQuest returns and updates an old quest', async () => {
        const executeFunction = {
            execute: jest
                .fn()
                .mockImplementationOnce(() => {
                    return [[{
                        id: 1,
                        uuid: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
                        ip: '1.2.3.4.5',
                        last_visited: '2022-09-19T08:17:50.000Z',
                        times_visited: 50,
                        website_rating: 5
                    }]]
                })
                .mockImplementationOnce(() => {
                    return [[]]
                })
        }

        jest.spyOn(connection, 'promise')
            .mockImplementationOnce(() => executeFunction)
            .mockImplementationOnce(() => executeFunction)

        const mockRequest = {}
        const result = await QuestController.getQuest(mockRequest)
        expect(executeFunction.execute).toHaveBeenCalledWith('SELECT * FROM quest WHERE ip = ?', ['1.2.3.4.5'])
        expect(executeFunction.execute).toHaveBeenCalledWith('UPDATE quest SET times_visited = ?, last_visited = ? WHERE uuid = ?', [51, expect.anything(), '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'])
        expect(result).toBe('9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d')
    })

    test('getQuest returns and updates an old quest', async () => {
        const executeFunction = {
            execute: jest
                .fn()
                .mockImplementationOnce(() => {
                    return [[{
                        id: 1,
                        uuid: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
                        ip: '1.2.3.4.5',
                        last_visited: '2022-09-19T08:17:50.000Z',
                        times_visited: 50,
                        website_rating: 5
                    }]]
                })
                .mockImplementationOnce(() => {
                    return [[]]
                })
        }

        jest.spyOn(connection, 'promise')
            .mockImplementationOnce(() => executeFunction)
            .mockImplementationOnce(() => executeFunction)

        const mockRequest = {}
        const result = await QuestController.getQuest(mockRequest)
        expect(executeFunction.execute).toHaveBeenCalledWith('SELECT * FROM quest WHERE ip = ?', ['1.2.3.4.5'])
        expect(executeFunction.execute).toHaveBeenCalledWith('UPDATE quest SET times_visited = ?, last_visited = ? WHERE uuid = ?', [51, expect.anything(), '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'])
        expect(result).toBe('9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d')
    })

    test('addWebsiteRating adds rating', async () => {
        const executeFunction = {
            execute: jest
                .fn()
                .mockImplementationOnce(() => {
                    return [[{}]]
                })
        }

        jest.spyOn(connection, 'promise')
            .mockImplementationOnce(() => executeFunction)

        const mockRequest = {
            query: {
                uuid: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
                rating: 5
            }
        }
        const result = await QuestController.addWebsiteRating(mockRequest)
        expect(executeFunction.execute).toHaveBeenCalledWith('SELECT * FROM quest WHERE uuid = ?', ['9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'])
        expect(executeFunction.execute).toHaveBeenCalledWith('UPDATE quest SET website_rating = ? WHERE uuid = ?', [5, '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'])
        expect(result).toBe(true)
    })

    test('addWebsiteRating throws an error when quest is not found', async () => {
        const executeFunction = {
            execute: jest
                .fn()
                .mockImplementationOnce(() => {
                    return [[]]
                })
        }

        jest.spyOn(connection, 'promise')
            .mockImplementationOnce(() => executeFunction)

        const mockRequest = {
            query: {
                uuid: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
                rating: 5
            }
        }

        try {
            await QuestController.addWebsiteRating(mockRequest)
        } catch (err) {
            expect(err.statusCode).toBe(400)
        }
    })
})
