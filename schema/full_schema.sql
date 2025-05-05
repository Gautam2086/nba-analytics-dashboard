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

CREATE TABLE IF NOT EXISTS nba.game (
  game_id bigint NOT NULL,
  season_id bigint,
  game_date date,
  season_type text,
  team_id_home bigint,
  team_abbreviation_home text,
  team_name_home text,
  matchup_home text,
  wl_home character(1),
  min bigint,
  fgm_home bigint,
  fga_home bigint,
  fg_pct_home real,
  fg3m_home bigint,
  fg3a_home bigint,
  fg3_pct_home real,
  ftm_home bigint,
  fta_home integer,
  ft_pct_home real,
  oreb_home integer,
  dreb_home integer,
  reb_home integer,
  ast_home integer,
  stl_home integer,
  blk_home integer,
  tov_home integer,
  pf_home integer,
  pts_home integer,
  plus_minus_home integer,
  video_available_home integer,
  team_id_away bigint,
  team_abbreviation_away text,
  team_name_away text,
  matchup_away text,
  wl_away character(1),
  fgm_away integer,
  fga_away integer,
  fg_pct_away real,
  fg3m_away integer,
  fg3a_away integer,
  fg3_pct_away real,
  ftm_away integer,
  fta_away integer,
  ft_pct_away real,
  oreb_away integer,
  dreb_away integer,
  reb_away integer,
  ast_away integer,
  stl_away integer,
  blk_away integer,
  tov_away integer,
  pf_away integer,
  pts_away integer,
  plus_minus_away integer,
  video_available_away integer,
  PRIMARY KEY (game_id)
);

CREATE TABLE IF NOT EXISTS nba.game_info (
  game_id bigint NOT NULL,
  game_date date,
  attendance bigint,
  game_time text,
  PRIMARY KEY (game_id)
);

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

CREATE TABLE IF NOT EXISTS nba.official (
  game_id bigint NOT NULL,
  official_id bigint NOT NULL,
  first_name text,
  last_name text,
  jersey_num bigint,
  PRIMARY KEY (game_id, official_id)
);

CREATE TABLE IF NOT EXISTS nba.other_stats (
  game_id bigint NOT NULL,
  league_id bigint,
  team_id_home bigint,
  team_abbreviation_home text,
  team_city_home text,
  pts_paint_home bigint,
  pts_2nd_chance_home bigint,
  pts_fb_home bigint,
  largest_lead_home bigint,
  lead_changes bigint,
  times_tied bigint,
  team_turnovers_home bigint,
  total_turnovers_home bigint,
  team_rebounds_home bigint,
  pts_off_to_home bigint,
  team_id_away bigint,
  team_abbreviation_away text,
  team_city_away text,
  pts_paint_away bigint,
  pts_2nd_chance_away bigint,
  pts_fb_away bigint,
  largest_lead_away bigint,
  team_turnovers_away bigint,
  total_turnovers_away bigint,
  team_rebounds_away bigint,
  pts_off_to_away bigint,
  PRIMARY KEY (game_id)
);

CREATE TABLE IF NOT EXISTS nba.player (
  player_id bigint NOT NULL,
  full_name text,
  first_name text,
  last_name text,
  is_active smallint,
  PRIMARY KEY (player_id)
);

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

CREATE TABLE IF NOT EXISTS nba.team_history (
  team_id bigint NOT NULL,
  city text NOT NULL,
  nickname text,
  year_founded bigint NOT NULL,
  year_active_till bigint,
  PRIMARY KEY (team_id, city, year_founded)
);

-- Indexes
CREATE INDEX idx_draft_person ON nba.draft_history USING btree (person_id);
CREATE INDEX idx_draft_season ON nba.draft_history USING btree (season);
CREATE INDEX idx_game_pts_home ON nba.game USING btree (pts_home);
CREATE INDEX idx_officials_game_id ON nba.official USING btree (game_id);

