-- Add visibility control for published tools

ALTER TABLE tools
  ADD COLUMN is_hidden TINYINT(1) NOT NULL DEFAULT 0 AFTER is_open_source,
  ADD INDEX idx_visible_date (is_hidden, date_added);
