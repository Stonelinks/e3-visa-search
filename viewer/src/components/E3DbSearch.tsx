import React from "react";
import * as _ from "lodash";
import { connect, ConnectedProps } from "react-redux";
import {
  MAX_SEARCH_RECORDS_TO_RETURN,
  SEARCH_VALUE_ANY,
} from "../common/constants";
import { formatNumber, median, parseCurrencyStr } from "../common/number";
import { E3Record } from "../common/types";
import { RootState } from "../redux";
import { apiCall } from "../redux/api/actions";
import { MILLISECONDS_IN_SECOND } from "../common/time";

const mapState = (state: RootState) => ({
  searchResults: state.api.e3search.value as {
    durationMs: number;
    results: E3Record[];
  },
});

const mapDispatch = {
  onSearch: (
    employerName: string,
    jobTitle: string,
    worksiteCity: string,
    worksiteState: string,
    decisionDate: string,
  ) =>
    apiCall("e3search", {
      employerName: employerName ? employerName : SEARCH_VALUE_ANY,
      jobTitle: jobTitle ? jobTitle : SEARCH_VALUE_ANY,
      worksiteCity: worksiteCity ? worksiteCity : SEARCH_VALUE_ANY,
      worksiteState: worksiteState ? worksiteState : SEARCH_VALUE_ANY,
      decisionDate: decisionDate ? decisionDate : SEARCH_VALUE_ANY,
    }),
};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

interface OwnProps {}

type Props = PropsFromRedux & OwnProps;

const E3DbSearch = ({ searchResults, onSearch }: Props) => {
  const [busy, setBusy] = React.useState(true);
  const [employerName, setEmployerName] = React.useState("");
  const [jobTitle, setJobTitle] = React.useState("");
  const [worksiteCity, setWorksiteCity] = React.useState("");
  const [worksiteState, setWorksiteState] = React.useState("");
  const [decisionDate, setDecisionDate] = React.useState("");

  React.useEffect(() => {
    doSearch(employerName, jobTitle, worksiteCity, worksiteState, decisionDate);
  }, [employerName, jobTitle, worksiteCity, worksiteState, decisionDate]);

  const doSearch = React.useCallback(
    _.debounce(
      async (
        _employerName: string,
        _jobTitle: string,
        _worksiteCity: string,
        _worksiteState: string,
        _decisionDate: string,
      ) => {
        setBusy(true);
        await onSearch(
          _employerName,
          _jobTitle,
          _worksiteCity,
          _worksiteState,
          _decisionDate,
        );
        setBusy(false);
      },
      MILLISECONDS_IN_SECOND,
    ),
    [],
  );

  const handleChangeEmployerName = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newEmployerName = e.target.value;
    setEmployerName(newEmployerName);
  };

  const handleChangeJobTitle = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newJobTitle = e.target.value;
    setJobTitle(newJobTitle);
  };

  const handleChangeWorksiteCity = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newWorksiteCity = e.target.value;
    setWorksiteCity(newWorksiteCity);
  };

  const handleChangeWorksiteState = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newWorksiteState = e.target.value;
    setWorksiteState(newWorksiteState);
  };

  const handleChangeDecisionDate = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newDecisionDate = e.target.value;
    setDecisionDate(newDecisionDate);
  };

  const { results, durationMs } = searchResults;

  return (
    <>
      <div style={{ marginBottom: "30px" }}>
        <div>
          <label>
            {"Employer name"}
            <input
              style={{ marginLeft: "10px" }}
              value={employerName}
              onChange={handleChangeEmployerName}
            />
          </label>
        </div>
        <div>
          <label>
            {"Job title"}
            <input
              style={{ marginLeft: "10px" }}
              value={jobTitle}
              onChange={handleChangeJobTitle}
            />
          </label>
        </div>
        <div>
          <label>
            {"Worksite city"}
            <input
              style={{ marginLeft: "10px" }}
              value={worksiteCity}
              onChange={handleChangeWorksiteCity}
            />
          </label>
        </div>
        <div>
          <label>
            {"Worksite state"}
            <input
              style={{ marginLeft: "10px" }}
              value={worksiteState}
              onChange={handleChangeWorksiteState}
            />
          </label>
        </div>
        <div>
          <label>
            {"Decision date"}
            <input
              style={{ marginLeft: "10px" }}
              value={decisionDate}
              onChange={handleChangeDecisionDate}
            />
          </label>
        </div>
      </div>

      {busy ? (
        <b>Please wait, searching...</b>
      ) : (
        <>
          {results && results.length ? (
            <>
              <div style={{ marginBottom: "30px" }}>
                <div>
                  <b>{"Number of records: "}</b>
                  {results.length === MAX_SEARCH_RECORDS_TO_RETURN
                    ? `${formatNumber(
                        results.length,
                      )} (max results, please narrow down your search)`
                    : formatNumber(results.length)}
                </div>
                <div>
                  <b>{"Median salary: "}</b>
                  {"$" +
                    formatNumber(
                      median(
                        results.map((r: E3Record) =>
                          parseCurrencyStr(r.wageRateOfPayFrom),
                        ),
                      ),
                    )}
                </div>
              </div>

              <table
                style={{
                  marginBottom: "30px",
                  width: "100%",
                  border: "1px solid black",
                }}
              >
                <thead>
                  <tr>
                    <th style={{ border: "1px solid black" }}>
                      {"Employer name"}
                    </th>
                    <th style={{ border: "1px solid black" }}>{"Job title"}</th>
                    <th style={{ border: "1px solid black" }}>
                      {"Wage rate of pay from"}
                    </th>
                    <th style={{ border: "1px solid black" }}>
                      {"Worksite city"}
                    </th>
                    <th style={{ border: "1px solid black" }}>
                      {"Worksite state"}
                    </th>
                    <th style={{ border: "1px solid black" }}>
                      {"Begin date"}
                    </th>
                    <th style={{ border: "1px solid black" }}>
                      {"Case status"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r: E3Record) => {
                    return (
                      <tr>
                        <td style={{ border: "1px solid black" }}>
                          {r.employerName}
                        </td>
                        <td style={{ border: "1px solid black" }}>
                          {r.jobTitle}
                        </td>
                        <td style={{ border: "1px solid black" }}>
                          {r.wageRateOfPayFrom}
                        </td>
                        <td style={{ border: "1px solid black" }}>
                          {r.worksiteCity}
                        </td>
                        <td style={{ border: "1px solid black" }}>
                          {r.worksiteState}
                        </td>
                        <td style={{ border: "1px solid black" }}>
                          {r.beginDate}
                        </td>
                        <td style={{ border: "1px solid black" }}>
                          {r.caseStatus}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div
                style={{ marginBottom: "30px" }}
              >{`Got results in ${durationMs /
                MILLISECONDS_IN_SECOND} seconds`}</div>
            </>
          ) : (
            <b>No results</b>
          )}
        </>
      )}
    </>
  );
};

export default connector(E3DbSearch);
