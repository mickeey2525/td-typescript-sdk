//import { TDClient } from "https://github.com/mickeey2525/td-typescript-sdk/raw/main/mod.ts";
import { TDClient} from "../mod.ts";

const apiKey = Deno.env.get("TD_API_KEY") as string;
const td = new TDClient("https://api.treasuredata.com", apiKey);


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


let oid_mine;

try {
  const res = await td.creteDataModel("./sample.yaml");
  const resObj = await res.json();
  oid_mine = resObj.oid;
  console.log(JSON.stringify(resObj));
} catch (e) {
  console.log(e);
}


try {
  const res = await td.getDataModels("elasticube");
  const resObj = await res.json();
  console.log(JSON.stringify(resObj));
} catch (e) {
  console.log(e);
}


try {
  const res = await td.getDataModelWithId(
    "cfc0a141-6605-4dce-a461-89752adf5aa3",
  );
  const resObj = await res.json();
  console.log(JSON.stringify(resObj));
} catch (e) {
  console.log(e);
}

try {
  const res = await td.updateDataModel(
    "706d8c8e-395b-43d3-b39a-1eaf19a05519",
    "test_test",
  );
  const resObj = await res.json();
  console.log(JSON.stringify(resObj));
} catch (e) {
  console.log(e);
}

try {
  const res = await td.startDatamodelBuilding(
    oid_mine,
    "full",
  );
  const resObj = await res.json();
  console.log(resObj);
} catch (e) {
  console.log(e);
}

try {
  const res = await td.getDatamodelBuilding(
    oid_mine,
  );
  const resObj = await res.json();
  console.log(resObj);
} catch (e) {
  console.log(e);
}


const res = td.deleteDataModel(oid_mine);
console.log(JSON.stringify(res));
