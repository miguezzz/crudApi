CREATE TABLE IF NOT EXISTS pessoas (
    id SERIAL PRIMARY KEY,
    apelido VARCHAR(32) UNIQUE NOT NULL,
    nome VARCHAR(100) NOT NULL,
    nascimento DATE NOT NULL, -- por padrão, AAAA-MM-DD
    stack TEXT[]
);