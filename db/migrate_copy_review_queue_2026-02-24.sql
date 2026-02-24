-- Add copy review workflow fields for approved tools

ALTER TABLE tools
  ADD COLUMN needs_copy_review TINYINT(1) NOT NULL DEFAULT 0 AFTER source_submission_id,
  ADD COLUMN copy_review_notes VARCHAR(500) NULL AFTER needs_copy_review,
  ADD INDEX idx_copy_review (needs_copy_review, date_added);

-- Backfill existing records to reviewed (don't flood queue retroactively)
UPDATE tools SET needs_copy_review = 0 WHERE needs_copy_review IS NULL;
