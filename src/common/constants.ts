import * as path from "path";
import {
  DAYS_IN_WEEK,
  MILLISECONDS_IN_DAY,
  MILLISECONDS_IN_MINUTE,
  MILLISECONDS_IN_SECOND,
} from "./time";

const prefixPath = (s: string) =>
  process.env.BASE_PATH
    ? `${(process as any).env.BASE_PATH}/${s}`
    : path.resolve(s);

export const DEFAULT_CRON_INTERVAL_MS = 30 * MILLISECONDS_IN_MINUTE;

export const CACHE_FOLDER = prefixPath(".cache");
export const CACHE_MAX_AGE_DAYS = DAYS_IN_WEEK;
export const CACHE_CRON_INTERVAL_MS = 2 * MILLISECONDS_IN_DAY;

export const VIEWER_FOLDER = path.resolve("./viewer/build");
export const DATA_FOLDER = path.resolve("./csv");
export const SERVER_PORT =
  parseInt((process as any).env.SERVER_PORT, 10) || 4001;
export const CONFIG_FILE = prefixPath("config.json");

export const SEARCH_VALUE_ANY = "@@SEARCH_VALUE_ANY@@";
export const MAX_SEARCH_RECORDS_TO_RETURN = 10000;
