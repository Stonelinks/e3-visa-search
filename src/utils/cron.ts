import { DEFAULT_CRON_INTERVAL_MS } from "../common/constants";
import { MILLISECONDS_IN_SECOND, now, timeout } from "../common/time";
import { CacheCleanCronJob, CacheSaveCronJob } from "./cache";

interface CronJobs {
  name: string;
  intervalMs: (() => Promise<number>) | number;
  fn: (nowMs: number) => Promise<any> | void;
}

class Cron {
  jobs: CronJobs[];
  lastRunMs: number[] = [];
  constructor(jobs: CronJobs[]) {
    this.jobs = jobs;
  }

  async start() {
    while (true) {
      await timeout(MILLISECONDS_IN_SECOND);
      await this.tick();
    }
  }

  async tick() {
    for (let i = 0; i < this.jobs.length; i++) {
      const { intervalMs, fn, name } = this.jobs[i];

      let iMs: number = DEFAULT_CRON_INTERVAL_MS;
      if (typeof intervalMs === "function") {
        iMs = await intervalMs();
      } else if (typeof intervalMs === "number") {
        iMs = intervalMs;
      }

      const lastRunMs = this.lastRunMs[i];
      const nowMs = now();
      let shouldRun = false;
      if (!lastRunMs) {
        shouldRun = true;
      } else if (lastRunMs + iMs < nowMs) {
        shouldRun = true;
      }

      if (shouldRun) {
        this.lastRunMs[i] = nowMs;
        try {
          console.log(`cron: running ${name}`);
          await fn(nowMs);
        } catch (e) {
          console.error(e);
        }
      }
    }
  }
}

const crons = [CacheCleanCronJob, CacheSaveCronJob];

export const cron = new Cron(crons);
