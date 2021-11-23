import { Application } from "express";
import {
  MAX_SEARCH_RECORDS_TO_RETURN,
  SEARCH_VALUE_ANY,
} from "../common/constants";
import { decode } from "../common/encode";
import { MILLISECONDS_IN_SECOND, now } from "../common/time";
import { SearchArgs } from "../common/types";
import { recordSearch } from "../utils/e3db";

export const registerE3DbRoutes = async (app: Application) => {
  app.get(
    "/search/:employerName/:jobTitle/:worksiteCity/:worksiteState/:decisionDate",
    async (req, res) => {
      const start = now();
      const searchArgs: SearchArgs = {};

      const employerName = decode(req.params.employerName) as string;
      if (employerName !== SEARCH_VALUE_ANY) {
        searchArgs.employerName = employerName;
      }
      const jobTitle = decode(req.params.jobTitle) as string;
      if (jobTitle !== SEARCH_VALUE_ANY) {
        searchArgs.jobTitle = jobTitle;
      }
      const worksiteCity = decode(req.params.worksiteCity) as string;
      if (worksiteCity !== SEARCH_VALUE_ANY) {
        searchArgs.worksiteCity = worksiteCity;
      }
      const worksiteState = decode(req.params.worksiteState) as string;
      if (worksiteState !== SEARCH_VALUE_ANY) {
        searchArgs.worksiteState = worksiteState;
      }
      const decisionDate = decode(req.params.decisionDate) as string;
      if (decisionDate !== SEARCH_VALUE_ANY) {
        searchArgs.decisionDate = decisionDate;
      }

      const ret = await recordSearch(searchArgs);

      const durationMs = now() - start;

      console.log(
        `searched and found ${ret.length} records in ${durationMs /
          MILLISECONDS_IN_SECOND} seconds (${JSON.stringify(
          searchArgs,
          null,
          2,
        )})`,
      );

      res.send(
        JSON.stringify({
          durationMs,
          results: ret.slice(0, MAX_SEARCH_RECORDS_TO_RETURN),
        }),
      );
    },
  );
};
