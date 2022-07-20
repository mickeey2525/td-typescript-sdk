import { path } from "./deps.ts";
import { parse } from "./deps.ts";
import { dataModelType, dataBuildType} from "./type.ts";

export class TDClient {
  public endpoint: string;
  public apikey: string;

  constructor(endpoint: string, apikey: string) {
    this.endpoint = endpoint;
    this.apikey = apikey;
  }

  private async request(path: string, param: RequestInit): Promise<Response> {
    const url = this.endpoint + "/" + path;
    try {
      const res = await fetch(
        url,
        param,
      );
      if (res.ok) {
        return res;
      } else {
        return Promise.reject(`Error: ${res.status}, ${await res.text()}`);
      }
    } catch (e) {
      return Promise.reject(`Error: ${e}`);
    }
  }

  async query(type: string, db: string, query: string): Promise<Response> {
    const encodedQuery = encodeURI(query);
    const path = `v3/job/issue/${type}/${db}?query=${encodedQuery}`;
    let param: RequestInit = {
      method: "POST",
      headers: {
        "Authorization": `TD1 ${this.apikey}`,
      },
    };
    return await this.request(path, param);
  }

  async getJobStatus(jobId: number): Promise<Response> {
    const path = `v3/job/status/${jobId}`;
    const param: RequestInit = {
      method: "GET",
      headers: {
        "Authorization": `TD1 ${this.apikey}`,
      },
    };
    return await this.request(path, param);
  }

  async getJobResult(jobId: number, format = "json"): Promise<Response> {
    const path = `v3/job/result/${jobId}?format=${format}`;
    const param: RequestInit = {
      method: "GET",
      headers: {
        "Authorization": `TD1 ${this.apikey}`,
      },
    };
    return await this.request(path, param);
  }

  // wait for job result
  sleep(seconds: number) {
    return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
  }

  async listDatabases(): Promise<Response> {
    const path = "v3/database/list";
    const param: RequestInit = {
      method: "GET",
      headers: {
        "Authorization": `TD1 ${this.apikey}`,
      },
    };
    return await this.request(path, param);
  }

  async jobList(from = 0, to = 0, status?: string): Promise<Response> {
    const path = `v3/job/list?=from_id=${from}&to_id=${to}&status=${status}`;
    const param: RequestInit = {
      method: "GET",
    };
    return await this.request(path, param);
  }

  async creteDataModel(filePath: string): Promise<Response> {
    const urlPath = "reporting/datamodels";
    const file = await Deno.readTextFile(path.join(Deno.cwd(), filePath));
    const newModel = parse(file);
    const postDetail: RequestInit = {
      method: "POST",
      headers: {
        "Authorization": `TD1 ${this.apikey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newModel),
    };
    return await this.request(urlPath, postDetail);
  }

  async getDataModels(datatype: dataModelType): Promise<Response> {
    const url = `reporting/datamodels?type=${datatype}`;
    const param: RequestInit = {
      method: "GET",
      headers: {
        "Authorization": `TD1 ${this.apikey}`,
      },
    };
    return await this.request(url, param);
  }

  async getDataModelWithId(oid: string): Promise<Response> {
    const url = `reporting/datamodels/${oid}`;
    const param: RequestInit = {
      method: "GET",
      headers: {
        "Authorization": `TD1 ${this.apikey}`,
      },
    };
    return await this.request(url, param);
  }

  async updateDataModel(oid: string, description: string): Promise<Response> {
    const url = `reporting/datamodels/${oid}`;
    const param: RequestInit = {
      method: "PUT",
      headers: {
        "Authorization": `TD1 ${this.apikey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ datamodel: { description: description } }),
    };
    return await this.request(url, param);
  }

  async deleteDataModel(oid: string): Promise<Response> {
    const url = `reporting/datamodels/${oid}`;
    const param: RequestInit = {
      method: "DELETE",
      headers: {
        "Authorization": `TD1 ${this.apikey}`,
      },
    };
    return await this.request(url, param);
  }

  async getDatamodelBuilding(oid: string): Promise<Response> {
    const url = `reporting/datamodels/${oid}/builds`;
    const param: RequestInit = {
      method: "GET",
      headers: {
        "Authorization": `TD1 ${this.apikey}`,
      },
    };
    return await this.request(url, param);
  }

  async startDatamodelBuilding(
    oid: string,
    buildType: dataBuildType,
  ): Promise<Response> {
    const url = `reporting/datamodels/${oid}/builds`;
    const param: RequestInit = {
      method: "POST",
      headers: {
        "Authorization": `TD1 ${this.apikey}`,
      },
      body: JSON.stringify({ build_type: buildType }),
    };
    return await this.request(url, param);
  }

  async stopAllBuilding(oid: string): Promise<Response> {
    const url = `reporting/datamodels/${oid}/builds`;
    const param: RequestInit = {
      method: "DELETE",
      headers: {
        "Authorization": `TD1 ${this.apikey}`,
      },
    };
    return await this.request(url, param);
  }

  async getBuild(datamodel_oid: string, build_oid: string): Promise<Response> {
    const url = `reporting/datamodels/${datamodel_oid}/builds/${build_oid}`;
    const param: RequestInit = {
      method: "GET",
      headers: {
        "Authorization": `TD1 ${this.apikey}`,
      },
    };
    return await this.request(url, param);
  }

  async stopBuild(datamodel_oid: string, build_oid: string): Promise<Response> {
    const url = `reporting/datamodels/${datamodel_oid}/builds/${build_oid}`;
    const param: RequestInit = {
      method: "DELETE",
      headers: {
        "Authorization": `TD1 ${this.apikey}`,
      },
    };
    return await this.request(url, param);
  }
}
