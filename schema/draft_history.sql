CREATE TABLE IF NOT EXISTS nba.draft_history (
  person_id bigint NOT NULL,
  player_name text,
  season bigint NOT NULL,
  round_number integer,
  round_pick bigint,
  overall_pick bigint,
  draft_type text,
  team_id bigint,
  team_city text,
  team_name text,
  team_abbreviation text,
  organization text,
  organization_type text,
  player_profile_flag smallint,
  PRIMARY KEY (person_id, season)
);

