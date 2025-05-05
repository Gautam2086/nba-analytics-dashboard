CREATE TABLE IF NOT EXISTS nba.team_details (
  team_id bigint NOT NULL,
  abbreviation text,
  nickname text,
  yearfounded bigint,
  city text,
  arena text,
  arenacapacity bigint,
  owner text,
  generalmanager text,
  headcoach text,
  dleagueaffiliation text,
  facebook text,
  instagram text,
  twitter text,
  PRIMARY KEY (team_id)
);

