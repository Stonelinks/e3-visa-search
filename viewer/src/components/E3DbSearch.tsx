import React from "react";
import * as _ from "lodash";
import { connect, ConnectedProps } from "react-redux";
import { SEARCH_VALUE_ANY } from "../common/constants";
import { median } from "../common/number";
import { E3Record } from "../common/types";
import { RootState } from "../redux";
import { apiCall } from "../redux/api/actions";
import { MILLISECONDS_IN_SECOND } from "../common/time";

const mapState = (state: RootState) => ({
  searchResults: state.api.e3search.value as E3Record[],
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
      (
        _employerName: string,
        _jobTitle: string,
        _worksiteCity: string,
        _worksiteState: string,
        _decisionDate: string,
      ) => {
        onSearch(
          _employerName,
          _jobTitle,
          _worksiteCity,
          _worksiteState,
          _decisionDate,
        );
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

      {searchResults && searchResults.length ? (
        <>
          <div style={{ marginBottom: "30px" }}>
            <div>
              <b>{"Number of records: "}</b>
              {searchResults.length}
            </div>
            <div>
              <b>{"Median salary: "}</b>
              {"$" +
                median(
                  searchResults.map((r: E3Record) => {
                    return Number(
                      r.wageRateOfPayFrom.replace(/[^0-9.-]+/g, ""),
                    );
                  }),
                )
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </div>
          </div>

          <table style={{ width: "100%", border: "1px solid black" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid black" }}>{"Employer name"}</th>
                <th style={{ border: "1px solid black" }}>{"Job title"}</th>
                <th style={{ border: "1px solid black" }}>
                  {"Wage rate of pay from"}
                </th>
                <th style={{ border: "1px solid black" }}>{"Worksite city"}</th>
                <th style={{ border: "1px solid black" }}>
                  {"Worksite state"}
                </th>
                <th style={{ border: "1px solid black" }}>{"Begin date"}</th>
                <th style={{ border: "1px solid black" }}>{"Case status"}</th>
              </tr>
            </thead>
            <tbody>
              {searchResults.map((r: E3Record) => {
                return (
                  <tr>
                    <td style={{ border: "1px solid black" }}>
                      {r.employerName}
                    </td>
                    <td style={{ border: "1px solid black" }}>{r.jobTitle}</td>
                    <td style={{ border: "1px solid black" }}>
                      {r.wageRateOfPayFrom}
                    </td>
                    <td style={{ border: "1px solid black" }}>
                      {r.worksiteCity}
                    </td>
                    <td style={{ border: "1px solid black" }}>
                      {r.worksiteState}
                    </td>
                    <td style={{ border: "1px solid black" }}>{r.beginDate}</td>
                    <td style={{ border: "1px solid black" }}>
                      {r.caseStatus}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      ) : <b>No results</b>}
    </>
  );
};

export default connector(E3DbSearch);
