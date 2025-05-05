CREATE TABLE IF NOT EXISTS nba.player (
  player_id bigint NOT NULL,
  full_name text,
  first_name text,
  last_name text,
  is_active smallint,
  PRIMARY KEY (player_id)
);

