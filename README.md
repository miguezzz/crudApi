# CRUD API com Node.JS e PostgreSQL

## Descrição
Esta API foi desenvolvida em Node.js utilizando o Express para gerenciar requisições HTTP e o PostgreSQL como banco de dados relacional. A API implementa um CRUD (Create, Read, Update, Delete) para gerenciar informações de pessoas, permitindo criar (POST), consultar(GET), atualizar(PUT) e excluir(DELETE) registros.

## Versões Utilizadas

- **WSL2**: Ubuntu v22.04.1
- **Node.js**: v20.17.0
- **npm**: v10.8.2
- **Express**: v4.19.2
- **PostgreSQL**: v14.13
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
2. Instale as dependências: 
    - Site oficial Node: https://nodejs.org/ ou no WSL2: https://tocodando.medium.com/instalando-node-js-no-wsl2-1387f87bf79a
    - verifique se o node e o npm foram instalados corretamente:
    `node -v`
    `npm -v`
    - Para instalar o PostgreSQL, siga as instruções disponíveis em https://www.postgresql.org/download/ ou no WSL2: https://dev.to/sfpear/install-and-use-postgres-in-wsl-423d.
    - No diretório raiz do projeto, execute `npm install`. Isto irá instalar todas as dependências listadas no arquivo package.json, incluindo o express, pg, dotenv.
3. Certifique a configuração correta do arquivo `.env`.
4. Não se esqueça de criar o banco de dados e o usuário:
```sql
CREATE DATABASE crudapi;
CREATE USER medfutura WITH ENCRYPTED PASSWORD 'medfutura';
GRANT ALL PRIVILEGES ON DATABASE crudapi TO medfutura;
```
5. Inicie o servidor: `npm start`.
6. verifique o funcionamento em localhost:3000/

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

## Exemplos de testes

### Testando POST /pessoas com curl
```bash
curl -X POST http://localhost:3000/pessoas \
-H "Content-Type: application/json" \
-d '{
  "apelido": "estagiario",
  "nome": "Victor Miguez",
  "nascimento": "2004-05-12",
  "stack": ["Node", "React", "Express", "Python"]
}'
```

### Testando GET /pessoas/:id com curl

```bash
curl -X GET http://localhost:3000/pessoas/1
```

### Testando GET /pessoas?t= com curl

```bash
curl -X GET http://localhost:3000/pessoas?t=estag
```

### Testando PUT /pessoas/:id com curl
```bash
curl -X PUT http://localhost:3000/pessoas/1 \
-H "Content-Type: application/json" \
-d '{
  "apelido": "Junior",
  "stack": ["Node", "Angular"]
}'
```

### Testando DELETE /pessoas/:id com curl
```bash
curl -X DELETE http://localhost:3000/pessoas/1
```
