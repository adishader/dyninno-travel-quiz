// Order matches CLAUDE.md's dropdown option list and the finish.company_option.* keys.
export const companyOfficeOptions = [
  "latvia",
  "moldova",
  "india",
  "egypt",
  "uzbekistan",
  "colombia",
  "philippines_cebu",
  "philippines_manila",
  "uae",
  "other",
] as const;

export type CompanyOfficeOption = (typeof companyOfficeOptions)[number];
