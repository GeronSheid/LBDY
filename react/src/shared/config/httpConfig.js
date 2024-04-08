import {TOKEN} from "shared/consts/storagesKeys";

const token = localStorage.getItem(TOKEN)

class Network {
    constructor() {
        this.config = {
            baseURL: 'https://lbdy.ru/',
            token: localStorage.getItem(TOKEN) || '',
            headersUrlencoded: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            defaultHeaders: {
                'Content-Type': 'application/json'
            },
            headersJson: {
                'Authorization': `Bearer ${localStorage.getItem(TOKEN)}`,
                'accept' : 'application/json',
                'Content-Type': 'application/json'

            },
            headersFiles: {
                'Authorization': `Bearer ${localStorage.getItem(TOKEN)}`,
                'accept' : '/'
            }
        }
        this.updateToken = this.updateToken.bind(this);
        this.requestUrlencoded = this.requestUrlencoded.bind(this);
        this.requestJson = this.requestJson.bind(this);
        this.requestNoBody = this.requestNoBody.bind(this);
        this.get = this.get.bind(this);
        this.put = this.put.bind(this);
        this.post = this.post.bind(this);
        this.postUrlencoded = this.postUrlencoded.bind(this)
        this.delete = this.delete.bind(this);
        this.deleteNoBody = this.deleteNoBody.bind(this);
    }

    updateToken(newToken) {
        this.config.token = newToken;
        this.config.headersJson = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${newToken}`,

        }
        localStorage.setItem(TOKEN, newToken)
    }

    createURL(url, microService, newBaseUrl) {
        return newBaseUrl ? `https://${newBaseUrl}/` + `${microService}/api/` + url : this.config.baseURL + `${microService}/api/` + url
    }

    async requestUrlencoded(url, method, body, microService, newBaseUrl) {
        let response = await fetch(this.createURL(url, microService, newBaseUrl), {
            method: method,
            headers: this.config.headersUrlencoded,
            body: new URLSearchParams({...body})
        })

        const data = await response.json()
        return {
            data,
            errors: !response.ok
        }
    }

    async requestJson(url, method, body, microService, newBaseUrl) {
        const response = await fetch(this.createURL(url, microService, newBaseUrl), {
            method: method,
            headers: this.config.headersJson,
            body: JSON.stringify(body)
        })
        const data = await response.json()
        return {
            data,
            errors: !response.ok
        }
    }

    async requestNoBody(url, method, type, microService, newBaseUrl) {
        let response
        if (type === "bearer") {
            response = await fetch(this.createURL(url, microService, newBaseUrl), {
                method: method,
                headers: this.config.headersJson,
            })
        } else {
            response = await fetch(this.createURL(url, microService, newBaseUrl), {
                method: method,
                headers: this.config.defaultHeaders,
            })
        }

        const data = await response.json()
        return {
            data,
            errors: !response.ok
        }
    }

    async requestFiles(url, method, body, microService, newBaseUrl) {
        const response = await fetch(this.createURL(url, microService, newBaseUrl), {
            method: method,
            headers: this.config.headersFiles,
            body: body
        })
        const data = await response.json()
        return {
            data,
            errors: !response.ok
        }
    }

    async get({url, type="bearer", microService, newBaseUrl}) {
        return await this.requestNoBody(url, 'GET', type, microService, newBaseUrl)
    }

    async put({url, body, microService, newBaseUrl}) {
        return await this.requestJson(url, 'PUT', body, microService, newBaseUrl)
    }

    async patchNoBody({url, type="bearer", microService, newBaseUrl}) {
        return await this.requestNoBody(url, 'PATCH', type, microService, newBaseUrl)
    }

    async postNoBody({url, type="bearer", microService, newBaseUrl}) {
        return await this.requestNoBody(url, 'POST', type, microService, newBaseUrl)
    }
    async patch({url, body, microService, newBaseUrl}) {
        return await this.requestJson(url, 'PATCH', body, microService, newBaseUrl)
    }
    async post({url, body, microService, newBaseUrl}) {
        return await this.requestJson(url, 'POST', body, microService, newBaseUrl)
    }

    async postUrlencoded({url, body, microService, newBaseUrl}) {
        return await this.requestUrlencoded(url, 'POST', body, microService, newBaseUrl)
    }

    async postFiles({url, body, microService, newBaseUrl}) {
        return await this.requestFiles(url, 'POST', body, microService, newBaseUrl)
    }

    async delete({url, body, microService, newBaseUrl}) {
        return await this.requestJson(url, 'DELETE', body, microService, newBaseUrl)
    }

    async deleteNoBody({url, microService, type='', newBaseUrl}) {
        return await this.requestNoBody(url, 'DELETE', type, microService, newBaseUrl)
    }
}

const LbdyNetwork = new Network()

export default LbdyNetwork
