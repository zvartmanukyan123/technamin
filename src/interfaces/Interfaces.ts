export interface DataResponse {
  _id: string;
  _remove?: boolean;
  _new?: boolean;
  markets_count: number;
  date: Date;
  home: Home;
  away: Away;
  match_info: MatchInfo;
  region: Region;
  sport: Sport;
  tournament: Tournament;
  status: Status;
}

export interface MatchInfo {
  score: string;
}

interface Away {
  abbreviation: string;
  alias: string;
  country: string;
  country_code: string;
  gender: string;
  id: string;
  name: string;
  short_name: string;
}

interface Date {
  start: number;
  start_day: number;
  start_hour: number;
  start_pretty: string;
}

interface Home {
  abbreviation: string;
  alias: string;
  country: string;
  country_code: string;
  gender: string;
  id: string;
  name: string;
  short_name: string;
  markets_count: number;
}

interface Region {
  alias: string;
  id: string;
  name: string;
  order: number;
}

interface Sport {
  alias: string;
  id: string;
  name: string;
  order: number;
}

interface Status {
  alias: string;
  id: string;
  name: string;
  origin_id: string;
  short_name: string;
}

interface Tournament {
  alias: string;
  id: string;
  name: string;
  order: number;
}

export interface MessageData {
  data: DataResponse[];
  rid?: string;
  sid?: string;
}

export interface WrapperProps {
  name: string;
  field: string;
  nodes: WrapperProps[];
}

export interface LocationState {
  home: string;
  away: string;
  matchInfo: MatchInfo;
  marketsCount: number;
}
