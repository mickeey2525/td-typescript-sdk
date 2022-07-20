export type jobCreate = {
  job: number;
  job_id: number;
  database: string;
};

export type JobStatus = {
  job_id: number;
  cpu_time: number;
  created_at: string;
  end_at: string;
  duration: number;
  num_records: number;
  result_size: number;
  start_at: string;
  status: string;
  updated_at: string;
};
