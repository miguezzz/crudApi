CREATE TABLE pessoas (
    id SERIAL PRIMARY KEY,
    apelido VARCHAR(32) UNIQUE NOT NULL,
    nome VARCHAR(100) NOT NULL, -- por padrão, AAAA-MM-DD
    nascimento DATE NOT NULL,
    stack TEXT[]
);