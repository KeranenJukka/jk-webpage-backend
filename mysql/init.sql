CREATE TABLE quest (
  id INT NOT NULL AUTO_INCREMENT,
  uuid VARCHAR(45) NOT NULL,
  ip VARCHAR(45) NOT NULL,
  last_visited DATETIME NOT NULL,
  times_visited INT NOT NULL,
  website_rating INT NULL,
  PRIMARY KEY (id)
);