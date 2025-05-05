CREATE TABLE IF NOT EXISTS nba.official (
  game_id bigint NOT NULL,
  official_id bigint NOT NULL,
  first_name text,
  last_name text,
  jersey_num bigint,
  PRIMARY KEY (game_id, official_id)
);

