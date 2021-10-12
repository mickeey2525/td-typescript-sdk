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
        return await fetch(
            `${url}`,
            {
                method: method,
                headers: {
                    'Authorization': `TD1 ${this.apikey}`
                }
            }
        ).catch(err => {
            throw new Error(`Error Happened: ${err}`)
        });
    }

    async getJobStatus(jobId: number): Promise<Response> {
        const path = `v3/job/status/${jobId}`
        const method = 'GET'
        return await this.request(path, method).catch(err => {
            throw new Error(`Failed to call API: ${err}`)
        })
    }

    async getJobResult(jobId: number): Promise<Response> {
        const path = `v3/job/result/${jobId}`
        const method = 'GET'
        return await this.request(path, method).catch(err => {
            throw new Error(`Failed to call API: ${err}`)
        })
    }

    // wait for job result
    sleep(seconds: number) {
        return new Promise((resolve => setTimeout(resolve, seconds * 1000)))
    }
}
