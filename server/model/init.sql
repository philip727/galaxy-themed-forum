USE main;

/* create users table */
CREATE TABLE users (
	UID int PRIMARY KEY AUTO_INCREMENT NOT NULL UNIQUE,
    name VARCHAR(16) NOT NULL UNIQUE,
    email varchar(50) NOT NULL UNIQUE,
    regdate DATETIME NOT NULL DEFAULT NOW(),
    role ENUM('admin', 'moderator', 'user') NOT NULL,
    password varchar(72) NOT NULL,
    pfpdestination VARCHAR(255),
    bio VARCHAR(200)
);

/* create categories table */
CREATE TABLE categories (
	id int PRIMARY KEY AUTO_INCREMENT NOT NULL UNIQUE,
    name VARCHAR(16) NOT NULL UNIQUE,
    description VARCHAR(255) NOT NULL,
    type VARCHAR(20) NOT NULL
);

/* create categories table */
CREATE TABLE posts (
	id int PRIMARY KEY AUTO_INCREMENT NOT NULL UNIQUE,
    name VARCHAR(30) NOT NULL,
    content TEXT NOT NULL,
    category_id int NOT NULL,
    profile_id int NOT NULL
);
ALTER TABLE posts ADD FOREIGN KEY(category_id) REFERENCES categories(id) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE posts ADD FOREIGN KEY(profile_id) REFERENCES users(UID) ON DELETE RESTRICT ON UPDATE CASCADE;

/* create profile comments table */
CREATE TABLE profile_comments (
	id int PRIMARY KEY AUTO_INCREMENT NOT NULL UNIQUE,
    profile_id int NOT NULL, 
    poster_id int NOT NULL,
    content VARCHAR(120) NOT NULL,
    postdate DATETIME NOT NULL DEFAULT NOW()
);
ALTER TABLE profile_comments ADD FOREIGN KEY(profile_id) REFERENCES users(UID) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE profile_comments ADD FOREIGN KEY(poster_id) REFERENCES users(UID) ON DELETE CASCADE ON UPDATE CASCADE;
