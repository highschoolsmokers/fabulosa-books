-- #region schema
CREATE TABLE IF NOT EXISTS employees (
  id                  TEXT PRIMARY KEY,
  name                TEXT NOT NULL,
  kind                TEXT NOT NULL CHECK (kind IN ('regular', 'on-call')),
  key_holder          BOOLEAN NOT NULL DEFAULT FALSE,
  max_shifts_per_week INTEGER NOT NULL CHECK (max_shifts_per_week BETWEEN 0 AND 7)
);

CREATE TABLE IF NOT EXISTS unavailability (
  employee_id TEXT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  day         SMALLINT NOT NULL CHECK (day BETWEEN 0 AND 6),
  shifts      TEXT[]          -- NULL means the whole day
);

CREATE TABLE IF NOT EXISTS time_off (
  employee_id TEXT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  date        DATE NOT NULL,
  reason      TEXT,
  PRIMARY KEY (employee_id, date)
);

CREATE TABLE IF NOT EXISTS assignments (
  week_start  DATE NOT NULL CHECK (EXTRACT(DOW FROM week_start) = 0),
  day         SMALLINT NOT NULL CHECK (day BETWEEN 0 AND 6),
  shift       TEXT NOT NULL CHECK (shift IN ('opening', 'mid', 'closing')),
  employee_id TEXT NOT NULL REFERENCES employees(id),
  PRIMARY KEY (week_start, day, shift)
);
-- #endregion schema
