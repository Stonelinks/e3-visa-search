import { Application } from "express";
import { SEARCH_VALUE_ANY } from "../common/constants";
import { decode } from "../common/encode";
import { MILLISECONDS_IN_SECOND, now } from "../common/time";
import { E3Record, SearchArgs } from "../common/types";
import { recordMatch, records } from "../utils/e3db";

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

      const ret = records.filter((r: E3Record) => recordMatch(r, searchArgs));

      console.log(
        `searched and found ${ret.length} records in ${(now() - start) /
          MILLISECONDS_IN_SECOND} seconds (${JSON.stringify(
          searchArgs,
          null,
          2,
        )})`,
      );

      res.send(JSON.stringify(ret.slice(0, 1000)));
    },
  );
};
