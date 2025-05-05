CREATE TABLE IF NOT EXISTS nba.game_summary (
  game_id bigint NOT NULL,
  game_date_est date,
  game_sequence bigint,
  game_status_id bigint,
  game_status_text text,
  gamecode text,
  home_team_id bigint,
  visitor_team_id bigint,
  season bigint,
  live_period bigint,
  natl_tv_broadcaster_abbreviation text,
  wh_status bigint,
  PRIMARY KEY (game_id)
);

