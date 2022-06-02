CREATE TABLE photos (
  id SERIAL,
  answer_id INT,
  url VARCHAR (255),
  PRIMARY KEY (id),
  CONSTRAINT fk_answer
    FOREIGN KEY(answer_id)
      REFERENCES answers(id)
);
copy photos(id, answer_id, url)
FROM '/Users/kylekk/Downloads/answers_photos.csv'
DELIMITER ','
CSV HEADER;

-- sudo -u postgres psql < server/answers_photos.sql