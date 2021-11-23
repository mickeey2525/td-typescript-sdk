import { TDClient } from "https://github.com/mickeey2525/td-typescript-sdk/raw/main/mod.ts";

const apiKey = Deno.env.get('TD_API_KEY') as string
const td = new TDClient('https://api.treasuredata.com', apiKey)
try {
    let query = await td.query('presto', 'sample_datasets', 'select * from www_access limit 100')
    let job = await query.json()
    let jobStatus = await td.getJobStatus(job.job_id)
    let status = await jobStatus.json()

    for(;;) {
        if (status.status === 'error' || status.status === 'success'){
            break
        }
        jobStatus = await td.getJobStatus(job.job_id)
        console.log(`${job.job_id} status : ${status.status}`)
        await td.sleep(3)
        status = await jobStatus.json()
    }

    console.log(status.num_records)
    let result = await td.getJobResult(status.job_id, 'tsv')
    console.log(await result.text())

    result = await td.listDatabases()
    console.log(await result.json())

    result = await td.jobList(0,1, 'success')
    console.log(await result.json())
} catch(e) {
    console.log(e)
}

