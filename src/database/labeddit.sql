-- Active: 1694579098989@@127.0.0.1@3306

CREATE TABLE
    users (
        id TEXT NOT NULL UNIQUE PRIMARY KEY,
        nick TEXT NOT NULL,
        email TEXT NOT NULL,
        password TEXT NOT NULL,
        created_at TEXT DEFAULT (DATETIME ()) NOT NULL
    );

SELECT * FROM users;

CREATE TABLE
    posts (
        id TEXT NOT NULL UNIQUE PRIMARY KEY,
        creator_id TEXT NOT NULL,
        content TEXT NOT NULL,
        likes INT NOT NULL,
        dislikes INT NOT NULL,
        created_at TEXT DEFAULT (DATETIME ()) NOT NULL,
        FOREIGN KEY (creator_id) REFERENCES users (id)
    );

SELECT * FROM posts;

CREATE TABLE
    comments (
        id TEXT NOT NULL UNIQUE PRIMARY KEY,
        creator_id TEXT NOT NULL,
        post_id TEXT NOT NULL,
        content TEXT NOT NULL,
        likes INT NOT NULL,
        dislikes INT NOT NULL,
        created_at TEXT DEFAULT (DATETIME ()) NOT NULL,
        FOREIGN KEY (creator_id) REFERENCES users (id),
        FOREIGN KEY (post_id) REFERENCES posts (id)
    );

CREATE TABLE
    likes_dislikes (
        user_id TEXT NOT NULL,
        post_id TEXT NOT NULL,
        like INT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (post_id) REFERENCES posts (id)
    );

SELECT * FROM likes_dislikes;

CREATE TABLE
    comments_likes_dislikes (
        user_id TEXT NOT NULL,
        comment_id TEXT NOT NULL,
        like INT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (comment_id) REFERENCES comments (id)
    );
