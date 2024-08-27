# CRUD API com Node.JS e PostgreSQL

## Descrição
Esta API foi desenvolvida em Node.js utilizando o Express para gerenciar requisições HTTP e o PostgreSQL como banco de dados relacional. A API implementa um CRUD (Create, Read, Update, Delete) para gerenciar informações de pessoas, permitindo criar (POST), consultar(GET), atualizar(UPDATE) e excluir(DELETE) registros.

## Versões Utilizadas

- **WSL2**: Ubuntu v22.04.1
- **Node.js**: v20.17.0
- **npm**: v10.8.2
- **Express**: v4.19.2
- **PostgreSQL: v14.13
- **dotenv**: v16.4.5

## Configuração do Ambiente

Configure o arquivo `.env` com as seguintes variáveis:
- `DB_HOST=localhost`
- `DB_PORT=5432`
- `DB_USER=seu_usuario`
- `DB_PASSWORD=sua_senha`
- `DB_NAME=crudapi`
- `PORT=3000`

## Instalação e Execução

1. Clone o repositório: git@github.com:miguezzz/crudApi.git ou https://github.com/miguezzz/crudApi.git
2. Instale as dependências: `npm install`.
3. Configure o arquivo `.env`.
4. Inicie o servidor: `npm start`.

## Utilizando os ENDPOINTS

### Criar Pessoa (POST /pessoas)
Cria uma nova pessoa na base de dados.

- Corpo da requisição:

```json
{
  "apelido": "josé",
  "nome": "José Roberto",
  "nascimento": "2000-10-01",
  "stack": ["C#", "Node", "Oracle"]
}
```

- Respostas:
    - 201 Created: Pessoa criada com sucesso.
    - 422 Unprocessable Entity: Erro de validação nos dados fornecidos.
    - 400 Bad Request: Para outros erros de requisição.

### Consultar pessoa por ID (GET /pessoas/:id)

Consulta as informações de uma pessoa com base no id.

- Respostas:
    - 200 OK: Pessoa encontrada e retornada.
    - 404 Not Found: Pessoa não encontrada.

### Buscar Pessoas por Termo (GET /pessoas?t=)

Retorna pessoas que contenham o termo pesquisado no apelido, nome ou stack.

- Respostas:
    - 200 OK: Lista de pessoas (pode estar vazia).
    - 400 Bad Request: Termo não informado.

### Atualizar Pessoa (PUT /pessoas/:id)

Atualiza as informações de uma pessoa já existente na base de dados.

Corpo da Requisição:

Mesmo formato da rota de criação (POST /pessoas).

- Respostas:

    - 200 OK: Pessoa atualizada com sucesso.
    - 422 Unprocessable Entity: Erro de validação nos dados fornecidos.

### Excluir Pessoa (DELETE /pessoas/:id)

Exclui uma pessoa do banco de dados com base no id.

- Respostas:
    - 204 No Content: Pessoa excluída com sucesso.
    - 400 Bad Request: Erro na requisição ou ID inválido.