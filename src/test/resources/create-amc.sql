-- Table: amc

-- DROP TABLE amc;

CREATE TABLE amc(
  id varchar(36) NOT NULL DEFAULT gen_random_uuid(),
  asfid varchar(36) NOT NULL,
  name text NOT NULL,
  description text,
  data text NOT NULL,
  lower text,
  PRIMARY KEY (id)
);
COMMENT ON COLUMN amc.id IS 'ID';
COMMENT ON COLUMN amc.asfid IS 'ASF ID';
COMMENT ON COLUMN amc.name IS '名前';
COMMENT ON COLUMN amc.description IS '説明';
COMMENT ON COLUMN amc.data IS 'AMC';
