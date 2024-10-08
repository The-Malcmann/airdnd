CREATE TABLE users (
    username VARCHAR(25) PRIMARY KEY,
    password TEXT NOT NULL,
    email VARCHAR(50) NOT NULL  
        CHECK (position('@' IN email) > 1 AND position('.' IN email) > position('@' IN email) + 1),
    location TEXT,
    is_admin BOOLEAN DEFAULT FALSE,
    pref_remote BOOLEAN DEFAULT FALSE,
    pref_in_person BOOLEAN DEFAULT FALSE,
    can_dm BOOLEAN DEFAULT FALSE,
    image TEXT
);

CREATE TABLE groups (
    id SERIAL PRIMARY KEY,
    title VARCHAR(50) NOT NULL,
    description TEXT,
    host VARCHAR(25) REFERENCES users(username) ON DELETE CASCADE,
    game_edition VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    is_remote BOOLEAN DEFAULT FALSE,
    max_players INT DEFAULT 7, 
    is_public BOOLEAN DEFAULT TRUE,
    location VARCHAR(75),
    current_players INT DEFAULT 1,
    image TEXT DEFAULT ""
);

CREATE TABLE members (
    user_id VARCHAR(25) REFERENCES users(username) ON DELETE CASCADE,
    group_id INT REFERENCES groups(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, group_id),
    is_accepted BOOLEAN DEFAULT FALSE,
    is_dm BOOLEAN DEFAULT FALSE
);