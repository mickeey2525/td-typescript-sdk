import * as mf from "https://deno.land/x/mock_fetch@0.3.0/mod.ts";
import { assertEquals } from "https://deno.land/std@0.165.0/testing/asserts.ts";
import { TDClient } from "https://raw.githubusercontent.com/mickeey2525/td-typescript-sdk/main/mod.ts";

mf.install();

Deno.test("list database", ()=> {
    const body = {
        "databases": [
            {
                "name": "020_fod_tr_production",
                "created_at": "2020-06-11 10:25:10 UTC",
                "updated_at": "2020-06-11 10:25:10 UTC",
                "count": 7,
                "organization": null,
                "permission": "administrator",
                "delete_protected": false
            },
            {
                "name": "access_fluentd_website",
                "created_at": "2019-07-02 02:44:56 UTC",
                "updated_at": "2019-07-02 02:44:56 UTC",
                "count": 1314649249,
                "organization": null,
                "permission": "administrator",
                "delete_protected": false
            }]
    }

    mf.mock("GET@/v3/database/list", (_req, _) => {
        return new Response(JSON.stringify(body), {
            status: 200,
        });
    });

    const td = new TDClient("https://localhost:1234", "dummy")
    td.listDatabases().then(result=> {
        assertEquals(result.status, 200)
        result.json().then(js=>{
            assertEquals(JSON.stringify(js), JSON.stringify(body))
        })
    })
})
