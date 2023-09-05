-- SQLBook: Code
-- Active: 1693940006634@@127.0.0.1@3306

-- Queries da tabela user

CREATE TABLE
    users (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL,
        created_at TEXT DEFAULT (DATETIME()) NOT NULL
    );

INSERT INTO
    users (id, name, email, password, role)
VALUES (
        'u001',
        'Saulo Silva (ADM)',
        'saulo@email.com',
        '$2a$12$LPljUor1LmJ8/OkT4ixz9uxjVDpJS.F.6tUDsuBXRM7iDmyLuvsfK',
        'ADMIN'
    ), (
        'u002',
        'Jordan Dias',
        'jordan@email.com',
        '$2a$12$uDSf0hxNRZ.nkt0mYTooheT2pgHBzVA902elNg5Shx40B/wb0ve1q',
        'NORMAL'
    ), (
        'u003',
        'Ana Luiza',
        'luiza@email.com',
        '$2a$12$DyXQLgViShLjqColB/y3cO87bq7lFE1Zfgt9UmsBKa032qhfN/ZsO',
        'NORMAL'
    ), (
        'u004',
        'Camila Durtra',
        'camila@email.com',
        '$2a$12$stwZ7yTpp6IWb93WeAT0i.aSKjyyAimu81Oi4rSr6ufrhYCve996.',
        'NORMAL'
    );

-- Queries da tabela posts

CREATE TABLE
    posts (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        creator_id TEXT NOT NULL,
        content TEXT NOT NULL,
        likes INTEGER DEFAULT (0) NOT NULL,
        dislikes INTEGER DEFAULT (0) NOT NULL,
        created_at TEXT DEFAULT (DATETIME()) NOT NULL,
        updated_at TEXT DEFAULT (DATETIME()) NOT NULL,
        FOREIGN KEY (creator_id) REFERENCES users (id) ON UPDATE CASCADE ON DELETE CASCADE
    );

INSERT INTO
    posts (id, creator_id, content)
VALUES (
        'p001',
        'u001',
        'Bom dia, uma boa semana a todos!'
    ), (
        'p002',
        'u002',
        'Oie amigos do meu feed, olha essa receita :)'
    ), (
        'p003',
        'u003',
        'Obrigado a todos que deixaram votos de boas festas!'
    ), (
        'p004',
        'u004',
        'Muito boa a nova musica do Sesto Sento'
    );

--Query de criação da tabela likes_dislikes

CREATE TABLE
    likes_dislikes (
        user_id TEXT NOT NULL,
        post_id TEXT NOT NULL,
        like INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users (id) ON UPDATE CASCADE ON DELETE CASCADE,
        FOREIGN KEY (post_id) REFERENCES posts (id) ON UPDATE CASCADE ON DELETE CASCADE
    );

-- Queries da tabela comments

CREATE TABLE
    comments (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        creator_id TEXT NOT NULL,
        post_id TEXT NOT NULL,
        content TEXT NOT NULL,
        likes INTEGER DEFAULT (0) NOT NULL,
        dislikes INTEGER DEFAULT (0) NOT NULL,
        created_at TEXT DEFAULT (DATETIME()) NOT NULL,
        updated_at TEXT DEFAULT (DATETIME()) NOT NULL,
        FOREIGN KEY (creator_id) REFERENCES users (id) ON UPDATE CASCADE ON DELETE CASCADE,
        FOREIGN KEY (post_id) REFERENCES posts (id) ON UPDATE CASCADE ON DELETE CASCADE
    );

INSERT INTO
    comments (
        id,
        creator_id,
        post_id,
        content
    )
VALUES (
        'c001',
        'u002',
        'p001',
        'Este é o primeiro comentário no primeiro post.'
    ), (
        'c002',
        'u003',
        'p001',
        'Este é o segundo comentário no primeiro post.'
    );

CREATE TABLE
    likes_dislikes_comments (
        user_id TEXT NOT NULL,
        comment_id TEXT NOT NULL,
        like INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users (id) ON UPDATE CASCADE ON DELETE CASCADE,
        FOREIGN KEY (comment_id) REFERENCES comments (id) ON UPDATE CASCADE ON DELETE CASCADE);