export const PROGRAM_COLUMNS = [
  'Program', 'Organisation', 'Type', 'Applications period', 'What you get',
  'Pool', 'Award size', 'Who can apply', 'Apply', 'slug', 'status', 'end_date', 'last_checked',
] as const;
export type ProgramColumn = typeof PROGRAM_COLUMNS[number];
export type ProgramStatus = 'live' | 'history';
export type ProgramType = 'Hackathon' | 'Buildathon' | 'Fellowship' | 'Grants Program'
  | 'Research Grants' | 'Credits Program' | 'Startup Program' | 'Other';
export type BenefitTag = 'Grant' | 'Cash prizes' | 'API credits' | 'Cloud credits'
  | 'Compute' | 'Subscription' | 'Hardware Support';
/** Original CSV cells, including maintenance-only last_checked. No normalization. */
export interface ProgramRow {
  Program: string;
  Organisation: string;
  Type: string;
  'Applications period': string;
  'What you get': string;
  Pool: string;
  'Award size': string;
  'Who can apply': string;
  Apply: string;
  slug: string;
  status: ProgramStatus;
  end_date: string;
  last_checked: string;
}
export type RawProgramRow = Record<ProgramColumn, string>;
export interface RowIssue { row: number; reasons: string[] }
export interface DuplicateSlug { slug: string; rows: number[] }
export interface ProgramsData {
  totalRowsParsed: number;
  allRows: RawProgramRow[];
  programs: ProgramRow[];
  malformedRows: RowIssue[];
  duplicateSlugs: DuplicateSlug[];
}
export interface SiteMetaRow { key: string; value: string }
export interface SiteMetaData { rows: SiteMetaRow[]; last_updated: string }
