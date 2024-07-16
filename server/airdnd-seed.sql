INSERT INTO users(username, password, email, location, is_admin, pref_remote, pref_in_person, can_dm)
VALUES ('testuser', '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q', 'test@test.com', 'Reno, NV', false, true, true, false),
('testadmin', '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q', 'test@test.com', 'Reno, NV', true, true, true, false);

INSERT INTO groups(title, description, host, game_edition, is_active, is_remote, max_players, is_public)
VALUES ('Testusers group', 'lorem ipscum', 'testuser', '5th edition', true, true, 6, true);

INSERT INTO members(member_id, group_id, is_accepted, is_dm)
VALUES ('testuser', 1, true, true);

