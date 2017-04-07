-- Table: asf

-- DROP TABLE asf;

CREATE TABLE asf(
  id varchar(36) NOT NULL DEFAULT gen_random_uuid(),
  subjectnumber integer NOT NULL,
  name text NOT NULL,
  description text,
  data text,
  PRIMARY KEY (id)
);
COMMENT ON COLUMN asf.id IS 'ID';
COMMENT ON COLUMN asf.subjectnumber IS 'Subject Number';
COMMENT ON COLUMN asf.name IS '名前';
COMMENT ON COLUMN asf.description IS '説明';
COMMENT ON COLUMN asf.data IS 'ASF';
