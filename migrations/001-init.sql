-- Up
CREATE TABLE 'users' (
    id INTEGER PRIMARY KEY,
    username TEXT NOT NULL,
    email TEXT NOT NULL,
    socketId TEXT,
    wins INT DEFAULT 0,
    draws INT DEFAULT 0,
    losses INT DEFAULT 0,
    score INT DEFAULT 1000,
    activeGame STRING
);

-- Down
DROP TABLE IF EXISTS 'users';