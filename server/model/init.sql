USE main;

/* create users table */
CREATE TABLE users (
	UID int PRIMARY KEY AUTO_INCREMENT NOT NULL UNIQUE,
    name VARCHAR(16) NOT NULL UNIQUE,
    email varchar(50) NOT NULL UNIQUE,
    regdate DATETIME NOT NULL DEFAULT NOW(),
    role VARCHAR(16) NOT NULL,
    password varchar(72) NOT NULL
);

/* create categories table */
CREATE TABLE categories (
	CID int PRIMARY KEY AUTO_INCREMENT NOT NULL UNIQUE,
    name VARCHAR(16) NOT NULL UNIQUE,
    description VARCHAR(255) NOT NULL
);

/* create categories table */
CREATE TABLE posts (
	PID int PRIMARY KEY AUTO_INCREMENT NOT NULL UNIQUE,
    name VARCHAR(16) NOT NULL,
    content TEXT NULL,
    parent_CID int NOT NULL,
    poster_UID int NOT NULL
);

/* link the posts to the category */
ALTER TABLE posts ADD FOREIGN KEY(parent_CID) REFERENCES categories(CID) ON DELETE RESTRICT ON UPDATE CASCADE;

/* links the posts to the poster */
ALTER TABLE posts ADD FOREIGN KEY(poster_UID) REFERENCES users(UID) ON DELETE RESTRICT ON UPDATE CASCADE;
