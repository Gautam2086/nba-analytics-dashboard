CREATE TABLE IF NOT EXISTS nba.inactive_players (
  game_id bigint NOT NULL,
  player_id bigint NOT NULL,
  first_name text,
  last_name text,
  jersey_num text,
  team_id bigint,
  team_city text,
  team_name text,
  team_abbreviation text,
  PRIMARY KEY (game_id, player_id)
);

