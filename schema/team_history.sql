CREATE TABLE IF NOT EXISTS nba.team_history (
  team_id bigint NOT NULL,
  city text NOT NULL,
  nickname text,
  year_founded bigint NOT NULL,
  year_active_till bigint,
  PRIMARY KEY (team_id, city, year_founded)
);

