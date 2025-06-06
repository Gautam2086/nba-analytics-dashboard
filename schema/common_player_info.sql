CREATE TABLE IF NOT EXISTS nba.common_player_info (
  person_id bigint NOT NULL,
  first_name text,
  last_name text,
  display_first_last text,
  display_last_comma_first text,
  display_fi_last text,
  player_slug text,
  birthdate text,
  school text,
  country text,
  last_affiliation text,
  height text,
  weight bigint,
  season_exp integer,
  jersey text,
  position text,
  rosterstatus text,
  games_played_current_season_flag character(1),
  team_id bigint,
  team_name text,
  team_abbreviation text,
  team_code text,
  team_city text,
  playercode text,
  from_year bigint,
  to_year bigint,
  dleague_flag character(1),
  nba_flag character(1),
  games_played_flag character(1),
  draft_year bigint,
  draft_round bigint,
  draft_number bigint,
  greatest_75_flag character(1),
  PRIMARY KEY (person_id)
);

