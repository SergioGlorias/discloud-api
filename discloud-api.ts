import axios from "axios"
import { Errors } from "./error"

interface UserStatus {
    userID: string,
    plan: string
}

interface GetBot {
    app_id: string,
    info: string,
    container: string,
    cpu: string,
    memory: string,
    last_restart: string
}

interface BotLogs {
    app_id: string,
    link: string,
    logs: string | string[] | null
}

interface BotRestart {
    status: string,
    message: string
}

type Languages = "en" | "pt"

export class DiscloudAPI {

    private readonly token: string
    private readonly lang: Languages
    constructor(token: string, options?: { lang?: Languages }) {
        this.token = token
        this.lang = options?.lang ? options.lang : "en"
    }

    private url = "https://discloud.app/api/v2"
    private readonly error = new Errors()

    /**
     * @author GardZock
     * @description Get status of user.
     * @return {Promise<UserStatus | void>}
     */
    public async userStatus(): Promise<UserStatus | void> {

        let data;
        try {
            data = (await axios.get(`${this.url}/user`, {
                headers: {
                    "api-token": `${this.token}`
                }
            })).data
        } catch (err: any) {
            if (err.code == 401) {
                    return this.error.newError("UNAUTHORIZED", this.lang)
                }
                return console.error(err)
        }
        if (!data) return this.error.newError("NO_DATA", this.lang)

        return data;
    }

    public bot = {
        /**
        * @author GardZock
        * @description Get data of a bot.
        * @param {string} bot_id ID of Bot
        * @return {Promise<GetBot | void>}
        */
        get: async (bot_id: string): Promise<GetBot | void> => {

            if (!bot_id) return this.error.newError("BOT_ID", this.lang)

            let data;
            try {
                data = (await axios.get(`${this.url}/app/${bot_id}`, {
                    headers: {
                        "api-token": `${this.token}`
                    }
                })).data
            } catch (err: any) {
                if (err.code == 401) {
                    return this.error.newError("UNAUTHORIZED", this.lang)
                }
                return console.error(err)
            }

            if (!data) return this.error.newError("NO_DATA", this.lang)

            return data;
        },

        /**
        * @author GardZock
        * @description Get log of a bot.
        * @param {string} bot_id ID of Bot
        * @return {Promise<BotLogs | void>}
        */
        logs: async (bot_id: string): Promise<BotLogs | void> => {

            if (!bot_id) return this.error.newError("BOT_ID", this.lang)

            let data;
            try {
                data = (await axios.get(`${this.url}/app/${bot_id}/logs`, {
                    headers: {
                        "api-token": `${this.token}`
                    }
                })).data
            } catch (err: any) {
                if (err.code == 401) {
                    return this.error.newError("UNAUTHORIZED", this.lang)
                }
                return console.error(err)
            }

            if (!data) return this.error.newError("NO_DATA", this.lang)

            return data;
        },

        /**
        * @author GardZock
        * @param {string} bot_id ID of Bot
        * @description Restart the bot.
        * @return {Promise<BotRestart | void>}
        */
        restart: async (bot_id: string): Promise<BotRestart | void> => {

            if (!bot_id) return this.error.newError("BOT_ID", this.lang)

            let data;
            try {
                data = (await axios.post(`${this.url}/app/${bot_id}/restart`, {}, {
                    headers: {
                        "api-token": `${this.token}`
                    }
                })).data
            } catch (err: any) {
                if (err.code == 401) {
                    return this.error.newError("UNAUTHORIZED", this.lang)
                }
                return console.error(err)
            }

            if (!data) return this.error.newError("NO_DATA", this.lang)

            return data;
        }
    }
}