import { DATA_FOLDER } from "../common/constants";
import { listDirectory, readFileAsync } from "./files";
import * as neatCsv from "neat-csv";
import { E3Record, SearchArgs } from "../common/types";
import { MILLISECONDS_IN_SECOND, now } from "../common/time";
import { makeCachedFn } from "./cache";

export const records: E3Record[] = [];

export const fieldSearch = (search: string, fullText: string) =>
  fullText.toLowerCase().includes(search.toLowerCase());

export const recordMatch = (
  r: E3Record,
  {
    employerName,
    jobTitle,
    worksiteCity,
    worksiteState,
    decisionDate,
  }: SearchArgs,
) => {
  let ret = true;
  if (employerName) {
    ret = ret && fieldSearch(employerName, r.employerName);
  }
  if (jobTitle) {
    ret = ret && fieldSearch(jobTitle, r.jobTitle);
  }
  if (worksiteCity) {
    ret = ret && fieldSearch(worksiteCity, r.worksiteCity);
  }
  if (worksiteState) {
    ret = ret && fieldSearch(worksiteState, r.worksiteState);
  }
  if (decisionDate) {
    ret = ret && fieldSearch(decisionDate, r.decisionDate);
  }
  return ret;
};

export const recordSearch = makeCachedFn("recordSearch", (a: SearchArgs) =>
  records.filter((r: E3Record) => recordMatch(r, a)),
);

export const initE3Db = async () => {
  const start = now();
  const f = await listDirectory(DATA_FOLDER);

  // tslint:disable-next-line:prefer-for-of
  for (let i = 0; i < f.length; i++) {
    const fContents = await readFileAsync(`${DATA_FOLDER}/${f[i]}`);
    const fContentsCsv = await neatCsv(fContents);
    fContentsCsv.forEach((r: any) => {
      records.push({
        caseNumber: r.CASE_NUMBER, // 'I-203-20273-849784',
        caseStatus: r.CASE_STATUS, // 'Certified',
        receivedDate: r.RECEIVED_DATE, // '9/29/2020',
        decisionDate: r.DECISION_DATE, // '10/6/2020',
        originalCertDate: r.ORIGINAL_CERT_DATE, // '',
        visaClass: r.VISA_CLASS, // 'E-3 Australian',
        jobTitle: r.JOB_TITLE, // 'Vice President',
        socCode: r.SOC_CODE, // '13-2051.00',
        socTitle: r.SOC_TITLE, // 'Financial Analysts',
        fullTimePosition: r.FULL_TIME_POSITION, // 'Y',
        beginDate: r.BEGIN_DATE, // '10/22/2020',
        endDate: r.END_DATE, // '10/21/2022',
        totalWorkerPositions: r.TOTAL_WORKER_POSITIONS, // '1',
        newEmployment: r.NEW_EMPLOYMENT, // '0',
        continuedEmployment: r.CONTINUED_EMPLOYMENT, // '1',
        changePreviousEmployment: r.CHANGE_PREVIOUS_EMPLOYMENT, // '0',
        newConcurrentEmployment: r.NEW_CONCURRENT_EMPLOYMENT, // '0',
        changeEmployer: r.CHANGE_EMPLOYER, // '0',
        amendedPetition: r.AMENDED_PETITION, // '0',
        employerName: r.EMPLOYER_NAME, // 'Macquarie Holdings (USA) Inc.',
        tradeNameDba: r.TRADE_NAME_DBA, // '',
        employerAddress1: r.EMPLOYER_ADDRESS1, // '125 West 55th Street',
        employerAddress2: r.EMPLOYER_ADDRESS2, // '',
        employerCity: r.EMPLOYER_CITY, // 'New York',
        employerState: r.EMPLOYER_STATE, // 'NY',
        employerPostalCode: r.EMPLOYER_POSTAL_CODE, // '10019',
        employerCountry: r.EMPLOYER_COUNTRY, // 'UNITED STATES OF AMERICA',
        employerProvince: r.EMPLOYER_PROVINCE, // 'NY',
        employerPhone: r.EMPLOYER_PHONE, // '(1904) 365-2407',
        employerPhoneExt: r.EMPLOYER_PHONE_EXT, // '',
        naicsCode: r.NAICS_CODE, // '523110',
        employerPocLastName: r.EMPLOYER_POC_LAST_NAME, // 'Rekic',
        employerPocFirstName: r.EMPLOYER_POC_FIRST_NAME, // 'Denisa',
        employerPocMiddleName: r.EMPLOYER_POC_MIDDLE_NAME, // '',
        employerPocJobTitle: r.EMPLOYER_POC_JOB_TITLE, // 'HR Operations, Manager',
        employerPocAddress_1: r.EMPLOYER_POC_ADDRESS_1, // '125 West 55th Street',
        employerPocAddress_2: r.EMPLOYER_POC_ADDRESS_2, // '',
        employerPocCity: r.EMPLOYER_POC_CITY, // 'New York',
        employerPocState: r.EMPLOYER_POC_STATE, // 'NY',
        employerPocPostalCode: r.EMPLOYER_POC_POSTAL_CODE, // '10019',
        employerPocCountry: r.EMPLOYER_POC_COUNTRY, // 'UNITED STATES OF AMERICA',
        employerPocProvince: r.EMPLOYER_POC_PROVINCE, // '',
        employerPocPhone: r.EMPLOYER_POC_PHONE, // '(1904) 365-2407',
        employerPocPhoneExt: r.EMPLOYER_POC_PHONE_EXT, // '',
        employerPocEmail: r.EMPLOYER_POC_EMAIL, // 'denisa.rekic@macquarie.com',
        agentRepresentingEmployer: r.AGENT_REPRESENTING_EMPLOYER, // 'Yes',
        agentAttorneyLastName: r.AGENT_ATTORNEY_LAST_NAME, // 'Roberts',
        agentAttorneyFirstName: r.AGENT_ATTORNEY_FIRST_NAME, // 'Peter',
        agentAttorneyMiddleName: r.AGENT_ATTORNEY_MIDDLE_NAME, // 'Douglas',
        agentAttorneyAddress1: r.AGENT_ATTORNEY_ADDRESS1, // '142 Old Ridgefield Road, Suite 202',
        agentAttorneyAddress2: r.AGENT_ATTORNEY_ADDRESS2, // '',
        agentAttorneyCity: r.AGENT_ATTORNEY_CITY, // 'Wilton',
        agentAttorneyState: r.AGENT_ATTORNEY_STATE, // 'CT',
        agentAttorneyPostalCode: r.AGENT_ATTORNEY_POSTAL_CODE, // '06897',
        agentAttorneyCountry: r.AGENT_ATTORNEY_COUNTRY, // 'UNITED STATES OF AMERICA',
        agentAttorneyProvince: r.AGENT_ATTORNEY_PROVINCE, // '',
        agentAttorneyPhone: r.AGENT_ATTORNEY_PHONE, // '(1203) 529-3760',
        agentAttorneyPhoneExt: r.AGENT_ATTORNEY_PHONE_EXT, // '104',
        agentAttorneyEmailAddress: r.AGENT_ATTORNEY_EMAIL_ADDRESS, // 'proberts@robertsimmigration.com',
        lawfirmNameBusinessName: r.LAWFIRM_NAME_BUSINESS_NAME, // 'Roberts Immigration Law Group, LLC',
        stateOfHighestCourt: r.STATE_OF_HIGHEST_COURT, // 'MA',
        nameOfHighestStateCourt: r.NAME_OF_HIGHEST_STATE_COURT, // 'Supreme Judicial Court',
        worksiteWorkers: r.WORKSITE_WORKERS, // '1',
        secondaryEntity: r.SECONDARY_ENTITY, // 'No',
        secondaryEntityBusinessName: r.SECONDARY_ENTITY_BUSINESS_NAME, // '',
        worksiteAddress1: r.WORKSITE_ADDRESS1, // '125 West 55th Street',
        worksiteAddress2: r.WORKSITE_ADDRESS2, // '',
        worksiteCity: r.WORKSITE_CITY, // 'New York',
        worksiteCounty: r.WORKSITE_COUNTY, // 'NEW YORK',
        worksiteState: r.WORKSITE_STATE, // 'NY',
        worksitePostalCode: r.WORKSITE_POSTAL_CODE, // '10019',
        wageRateOfPayFrom: r.WAGE_RATE_OF_PAY_FROM, // '$225,000.00 ',
        wageRateOfPayTo: r.WAGE_RATE_OF_PAY_TO, // '',
        wageUnitOfPay: r.WAGE_UNIT_OF_PAY, // 'Year',
        prevailingWage: r.PREVAILING_WAGE, // '$161,346.00 ',
        pwUnitOfPay: r.PW_UNIT_OF_PAY, // 'Year',
        pwTrackingNumber: r.PW_TRACKING_NUMBER, // '',
        pwWageLevel: r.PW_WAGE_LEVEL, // 'IV',
        pwOesYear: r.PW_OES_YEAR, // '7/1/2020 - 6/30/2021',
        pwOtherSource: r.PW_OTHER_SOURCE, // '',
        pwOtherYear: r.PW_OTHER_YEAR, // '',
        pwSurveyPublisher: r.PW_SURVEY_PUBLISHER, // '',
        pwSurveyName: r.PW_SURVEY_NAME, // '',
        totalWorksiteLocations: r.TOTAL_WORKSITE_LOCATIONS, // '1',
        agreeToLcStatement: r.AGREE_TO_LC_STATEMENT, // 'Yes',
        h1BDependent: r.H1B_DEPENDENT, // 'N/A',
        willfulViolator: r.WILLFUL_VIOLATOR, // 'N/A',
        supportH1B: r.SUPPORT_H1B, // 'N/A',
        statutoryBasis: r.STATUTORY_BASIS, // '',
        appendixAAttached: r.APPENDIX_A_ATTACHED, // 'N/A',
        publicDisclosure: r.PUBLIC_DISCLOSURE, // 'Disclose Business',
        preparerLastName: r.PREPARER_LAST_NAME, // '',
        preparerFirstName: r.PREPARER_FIRST_NAME, // '',
        preparerMiddleInitial: r.PREPARER_MIDDLE_INITIAL, // '',
        preparerBusinessName: r.PREPARER_BUSINESS_NAME, // '',
        preparerEmail: r.PREPARER_EMAIL, // ''
      });
    });
  }
  console.log(
    `loaded ${records.length} records in ${(now() - start) /
      MILLISECONDS_IN_SECOND} seconds`,
  );
};
