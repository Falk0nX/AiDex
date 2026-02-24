-- AiDex v0.1 schema
-- Safe to commit (no secrets)

CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(64) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS tool_submissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  website_url VARCHAR(2048) NOT NULL,
  description VARCHAR(500) NOT NULL,
  category VARCHAR(100) NOT NULL,
  pricing ENUM('Free','Freemium','Paid','Open Source') NOT NULL,
  tags VARCHAR(400) NOT NULL DEFAULT '',
  is_open_source TINYINT(1) NOT NULL DEFAULT 0,
  status ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  submitted_ip VARBINARY(16) NULL,
  user_agent VARCHAR(255) NULL,
  reviewed_by_admin_id INT NULL,
  reviewed_at DATETIME NULL,
  approved_tool_id INT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status_created (status, created_at),
  INDEX idx_reviewed_by (reviewed_by_admin_id),
  CONSTRAINT fk_submissions_reviewed_by FOREIGN KEY (reviewed_by_admin_id)
    REFERENCES admins(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS tools (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  website_url VARCHAR(2048) NOT NULL,
  description VARCHAR(500) NOT NULL,
  category VARCHAR(100) NOT NULL,
  pricing ENUM('Free','Freemium','Paid','Open Source') NOT NULL,
  tags VARCHAR(400) NOT NULL DEFAULT '',
  is_open_source TINYINT(1) NOT NULL DEFAULT 0,
  upvotes INT NOT NULL DEFAULT 0,
  downvotes INT NOT NULL DEFAULT 0,
  source_submission_id INT NULL UNIQUE,
  needs_copy_review TINYINT(1) NOT NULL DEFAULT 0,
  copy_review_notes VARCHAR(500) NULL,
  date_added TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_date_added (date_added),
  INDEX idx_category (category),
  INDEX idx_copy_review (needs_copy_review, date_added),
  CONSTRAINT fk_tools_submission FOREIGN KEY (source_submission_id)
    REFERENCES tool_submissions(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS tool_votes (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  tool_id INT NOT NULL,
  voter_fingerprint CHAR(64) NOT NULL,
  vote_value TINYINT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_tool_voter (tool_id, voter_fingerprint),
  INDEX idx_tool_id (tool_id),
  CONSTRAINT fk_tool_votes_tool FOREIGN KEY (tool_id)
    REFERENCES tools(id) ON DELETE CASCADE,
  CONSTRAINT chk_vote_value CHECK (vote_value IN (-1, 1))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
