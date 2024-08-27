// importa o modulo express para criar o servidor web
const express = require('express');

// importa a classe Pool do módulo pg para gerenciar conexões com o postgreSQL
const { Pool } = require('pg');

// importa o modulo dotenv
const dotenv = require('dotenv');

// Importa o módulo 'path' do Node.js, que fornece utilitários para trabalhar com caminhos de arquivos e diretórios.
// O módulo 'path' permite manipular e resolver caminhos de forma independente do sistema operacional.
const path = require('path');

// Importa o módulo 'fs' (File System) do Node.js, que fornece uma API para interagir com o sistema de arquivos.
// O módulo 'fs' permite ler, escrever, manipular e excluir arquivos e diretórios.
const fs = require('fs');

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

// função assíncrona para inicializar o banco de dados
async function initDb() {
    const client = await pool.connect();
    try {
        const schemaPath = path.join(__dirname, 'schema.sql');
        // lê o conteúdo do arquivo schema.sql de forma síncrona e o armazena em uma variável como uma string UTF-8
        const schema = fs.readFileSync(schemaPath, 'utf8');
        // executa o conteúdo do arquivo schema.sql como um comando SQL no banco de dados
        await client.query(schema);
        console.log('Banco de dados inicializado com sucesso!');
    } catch (err) {
        console.error('Erro ao inicializar o banco de dados:', err);
    } finally {
        client.release();
    }
}

initDb();

const port = process.env.PORT || 3000;  // usa a porta do .env ou 3000 como padrão

app.get('/', (req, res) => {
    res.send('Bem-vindo à API!');
});

// implementando a rota POST /pessoas para criar uma nova pessoa
app.post('/pessoas', async (req, res) => {
    
    // obtendo os dados da requisicao
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
    // caso exista a stack E a stack não seja array, error 422
    // OU caso algum elemento dentro de stack tenha comprimento maior que 32 carac., error 422 
    if (stack && !Array.isArray(stack) || stack.some(item => item.length > 32)) {
        return res.status(422).json({ error: 'Formato inválido para stack.' });
    }
    
    try {
        // Conectar ao banco de dados
        const client = await pool.connect();

        // Inserir dados na tabela
        await client.query(
        `INSERT INTO pessoas (apelido, nome, nascimento, stack)
        VALUES ($1, $2, $3, $4)`,
        [apelido, nome, nascimento, stack || []] // garantir que stack seja um array, mesmo que não seja fornecido
        );

        client.release(); // Liberar o cliente após a operação
        return res.status(201).json({ message: 'Pessoa criada com sucesso.' });
    } catch (error) {
        console.error('Erro ao criar pessoa:', error);
        res.status(400).json({ error: 'Erro na requisição.' });
    }
});

// implementando endpoint GET /pessoas/:id
app.get('/pessoas/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      // consulta a pessoa com o ID fornecido
      const result = await pool.query('SELECT * FROM pessoas WHERE id = $1', [id]);
  
      if (result.rows.length > 0) {
        // retorna 200 (pessoa encontrada)
        res.status(200).json(result.rows[0]);
      } else {
        // ou retorna 404 (pessoa não encontrada)
        res.status(404).json({ message: 'Pessoa não encontrada' });
      }
    } catch (error) {
      // retorna 500 para erros internos do servidor
      console.error('Erro ao consultar a pessoa:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// rota para buscar pessoas por termo
app.get('/pessoas', async (req, res) => {
    // Obtém o termo da query string
    const termo = req.query.t;

    // verifica se o termo foi informado
    if (!termo) {
        return res.status(400).json({ error: 'Termo de busca não informado.' });
    }

    try {
        // conecta ao banco de dados
        const client = await pool.connect();
        
        // executa a consulta SQL com correspondência parcial do termo procurado
        const result = await client.query(`
            SELECT * FROM pessoas
            WHERE apelido ILIKE $1
               OR nome ILIKE $1
               OR EXISTS (
                SELECT 1
                FROM unnest(stack) AS element
                WHERE element ILIKE $1
                )
        `, [`%${termo}%`]);

        // retorna o resultado da consulta
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Erro ao buscar pessoas:', err);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

// implementando a rota PUT /pessoas/:id para atualizar uma pessoa
app.put('/pessoas/:id', async(req, res) => {
    const { id } = req.params;
    const { apelido, nome, nascimento, stack } = req.body;

    // verifica se o ID é fornecido e é um número
    if (isNaN(id)) {
        return res.status(422).json({ error: 'ID inválido.' });
    }

    // verifica se pelo menos um campo de alteração é fornecido
    if (!apelido && !nome && !nascimento && !stack) {
        return res.status(422).json({ error: 'Nenhum campo foi fornecido.' });
    }

    // valida os campos fornecidos
    if (apelido && (apelido.length > 32 || typeof apelido !== 'string')) {
        return res.status(422).json({ error: 'Campo apelido inválido.' });
    }
    if (nome && (nome.length > 100 || typeof nome !== 'string')) {
        return res.status(422).json({ error: 'Campo nome inválido.' });
    }
    if (nascimento && !/^\d{4}-\d{2}-\d{2}$/.test(nascimento)) {
        return res.status(422).json({ error: 'Formato de data inválido. Use AAAA-MM-DD.' });
    }
    if (stack && (!Array.isArray(stack) || stack.some(item => item.length > 32))) {
        return res.status(422).json({ error: 'Formato inválido para stack.' });
    }

    try {
        // conecta ao banco de dados
        const client = await pool.connect();

        // atualiza os dados da pessoa
        // explicando COALESCE: The COALESCE() function takes in at least one value (value_1).
        // It will return the first value in the list that is non-null.
        // ou seja, se o valor for atualizado, como $ vem antes, será modificado.
        // caso contrário, o valor antigo permanecerá.
        const result = await client.query(`
            UPDATE pessoas
            SET apelido = COALESCE($1, apelido),
                nome = COALESCE($2, nome),
                nascimento = COALESCE($3, nascimento),
                stack = COALESCE($4, stack)
            WHERE id = $5
            RETURNING *;
        `, [apelido, nome, nascimento, stack || null, id]);

        client.release(); // libera cliente após operação

        if (result.rows.length > 0) {
            // pessoa encontrada
            res.status(200).json(result.rows[0]);
        } else {
            res.status(404).json({ message: 'Pessoa não encontrada' });
        }
    } catch (error) {
        console.error('Erro ao atualizar a pessoa:', error);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

// inicia o servidor e escuta na porta definida
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
