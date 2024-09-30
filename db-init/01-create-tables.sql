CREATE TABLE parties (
    id SERIAL PRIMARY KEY,
    party_name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE candidates (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(50) UNIQUE NOT NULL,
    party_id INT REFERENCES parties(id)
);

