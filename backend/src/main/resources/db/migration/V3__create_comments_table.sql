CREATE TABLE comments (
  id SERIAL NOT NULL,
  text VARCHAR(512) NOT NULL,
  user_id INT NOT NULL,
  prototype_id INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY(user_id) REFERENCES users (id),
  FOREIGN KEY(prototype_id) REFERENCES prototypes (id) ON DELETE CASCADE
);