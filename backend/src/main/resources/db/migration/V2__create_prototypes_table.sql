CREATE TABLE prototypes (
  id SERIAL NOT NULL,
  name VARCHAR(256) NOT NULL,
  slogan VARCHAR(256) NOT NULL,
  concept VARCHAR(512) NOT NULL,
  image VARCHAR(256) NOT NULL,
  user_id INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);