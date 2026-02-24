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
  source_submission_id INT NULL UNIQUE,
  date_added TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_date_added (date_added),
  INDEX idx_category (category),
  CONSTRAINT fk_tools_submission FOREIGN KEY (source_submission_id)
    REFERENCES tool_submissions(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
