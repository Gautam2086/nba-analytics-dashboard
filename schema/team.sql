CREATE TABLE IF NOT EXISTS nba.team (
  team_id bigint NOT NULL,
  full_name text,
  abbreviation text,
  nickname text,
  city text,
  state text,
  year_founded integer,
  id integer,
  PRIMARY KEY (team_id)
);

