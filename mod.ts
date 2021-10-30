export class TDClient {
    endpoint: string;
    apikey: string;

    constructor(endpoint: string, apikey: string) {
        this.endpoint = endpoint
        this.apikey = apikey
    }

    async query(type: string, db: string, query: string) : Promise<Response> {
        const encodedQuery = encodeURI(query)
        const path = `v3/job/issue/${type}/${db}?query=${encodedQuery}`
        const res = await this.request(path, 'POST')
        if (res.ok) {
            return res
        }
        return res
    }

    private async request(path: string, method: string, ...opts: any): Promise<Response> {
        const url = this.endpoint + '/' + path
        try {
            const res = await fetch(
                `${url}`,
                {
                    method: method,
                    headers: {
                        'Authorization': `TD1 ${this.apikey}`
                    }
                }
            )
            if (res.status <= 299 && res.status >= 200) {
                return res
            } else {
                return Promise.reject(`Error: ${res.status}, ${await res.text()}`)
            }
        } catch (e) {
            return Promise.reject(`Error: ${e}`)
        }
    }

    async getJobStatus(jobId: number): Promise<Response> {
        const path = `v3/job/status/${jobId}`
        const method = 'GET'
        return await this.request(path, method).catch(err => {
            throw new Error(`Failed to call API: ${err}`)
        })
    }

    async getJobResult(jobId: number, format: string = 'json'): Promise<Response> {
        const path = `v3/job/result/${jobId}?format=${format}`
        const method = 'GET'
        return await this.request(path, method).catch(err => {
            throw new Error(`Failed to call API: ${err}`)
        })
    }

    // wait for job result
    sleep(seconds: number) {
        return new Promise((resolve => setTimeout(resolve, seconds * 1000)))
    }

    async listDatabases(): Promise<Response> {
        const path = 'v3/database/list'
        const method = 'GET'
        return await this.request(path, method)
    }

    async jobList(from: number = 0, to: number = 0, status?: string): Promise<Response> {
        const path = 'v3/job/list'
        const method = 'GET'
        return await this.request(path, method)
    }

}
