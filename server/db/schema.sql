-- Pick & Sip database

CREATE TABLE IF NOT EXISTS profiles (
  id          SERIAL PRIMARY KEY,
  username    VARCHAR(50) NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cafes (
  id           SERIAL PRIMARY KEY,
  name         VARCHAR(120) NOT NULL,
  location     VARCHAR(200) NOT NULL DEFAULT '',
  latitude     DOUBLE PRECISION,
  longitude    DOUBLE PRECISION,
  price_range  VARCHAR(3) NOT NULL CHECK (price_range IN ('P', 'PP', 'PPP')),
  rating       NUMERIC(2,1) NOT NULL DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  tags         TEXT[] NOT NULL DEFAULT '{}',
  notes        TEXT[],
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS visits (
  id          SERIAL PRIMARY KEY,
  cafe_id     INTEGER NOT NULL REFERENCES cafes(id) ON DELETE CASCADE,
  visit_date  DATE NOT NULL,
  notes       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS orders (
  id          SERIAL PRIMARY KEY,
  visit_id    INTEGER NOT NULL REFERENCES visits(id) ON DELETE CASCADE,
  item        VARCHAR(120) NOT NULL,
  price       NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (price >= 0),
  rating      NUMERIC(2,1) NOT NULL DEFAULT 0 CHECK (rating >= 0 AND rating <= 5)
);

CREATE INDEX IF NOT EXISTS cafes_name_idx
  ON cafes (LOWER(name));

CREATE INDEX IF NOT EXISTS cafes_location_idx
  ON cafes (LOWER(location));

CREATE INDEX IF NOT EXISTS visits_cafe_date_idx
  ON visits (cafe_id, visit_date DESC, id DESC);

CREATE INDEX IF NOT EXISTS orders_visit_idx
  ON orders (visit_id);