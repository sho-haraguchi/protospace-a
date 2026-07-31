CREATE TABLE bookmarks (
  id SERIAL NOT NULL,
  user_id INT NOT NULL,
  prototype_id INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY(user_id) REFERENCES users (id) ON DELETE CASCADE,
  FOREIGN KEY(prototype_id) REFERENCES prototypes (id) ON DELETE CASCADE,
  UNIQUE(user_id, prototype_id)
);