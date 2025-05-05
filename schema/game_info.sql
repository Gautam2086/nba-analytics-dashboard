CREATE TABLE IF NOT EXISTS nba.game_info (
  game_id bigint NOT NULL,
  game_date date,
  attendance bigint,
  game_time text,
  PRIMARY KEY (game_id)
);

