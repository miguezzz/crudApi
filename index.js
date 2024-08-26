// importa o modulo express para criar o servidor web
const express = require('express');

// importa a classe Pool do módulo pg para gerenciar conexões com o postgreSQL
const { Pool } = require('pg');

// importa o modulo dotenv
const dotenv = require('dotenv');

// carrega as variaveis de ambiente do .env
dotenv.config();

// cria uma instância do aplicativo Express
const app = express();
// configura o Express para analisar o corpo das requisicoes como json
app.use(express.json());

// pegando dados do .env
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

const port = process.env.PORT || 3000;  // usa a porta do .env ou 3000 como padrão

// implementando a rota POST /pessoas para criar uma nova pessoa
app.post('/pessoas', async (req, res) => {
    try {
        // obtenbdo os dados da requisicao
        const { apelido, nome, nascimento, stack } = req.body;

        // validando se os campos obrigatorios estao presentes
        if (!apelido || !nome || !nascimento) {
            return res.status(422).json({ error: 'Campos obrigatórios faltando!' });
        }

        // validando o comprimento dos campos
        if (apelido.length > 32 || nome.length > 100) {
            return res.status(422).json({ error: 'Comprimento dos campos excede o permitido.' });
        }

        // validando o formato da data (AAAA-MM-DD) com regex
        if (!/^\d{4}-\d{2}-\d{2}$/.test(nascimento)) {
            return res.status(422).json({ error: 'Formato de data inválido! Por favor, siga o formato AAAA-MM-DD.' });
        }

        // validando o formato da stack. Explicando >>>
        // caso exista a stack E stack não seja array, error 422
        // OU caso algum elemento dentro de stack tenha comprimento maior que 32 carac., error 422 
        if (stack && !Array.isArray(stack) || stack.some(item => item.length > 32)) {
            return res.status(422).json({ error: 'Formato inválido para stack.' });
        }

        // inserindo a nova pessoa no banco de dados
        const result = await pool.query(
            'INSERT INTO pessoas (apelido, nome, nascimento, stack) VALUES ($1, $2, $3, $4) RETURNING *',
            [apelido, nome, nascimento, stack ? JSON.stringify(stack) : null]
        );

        // retorna a resposta com o status 201 (Created) e os dados da nova pessoa
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Erro ao criar pessoa:', error);
        res.status(400).json({ error: 'Erro na requisição.' });
    }
});

// inicia o servidor e escuta na porta definida
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
