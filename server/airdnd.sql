\echo 'Delete and recreate airdnd db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE IF EXISTS airdnd;
CREATE DATABASE airdnd;
\connect airdnd

\i airdnd-schema.sql
\i airdnd-seed.sql

\echo 'Delete and recreate airdnd_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE airdnd_test;
CREATE DATABASE airdnd_test;
\connect airdnd_test

\i airdnd-schema.sql