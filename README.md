# Gerenciador de Tarefas — API REST Fullstack

Aplicação fullstack desenvolvida para praticar a construção e o consumo de uma API REST com **Node.js, TypeScript, Express e PostgreSQL**.

O sistema permite cadastrar, listar, concluir, reabrir e excluir tarefas por meio de uma interface web. Os dados são persistidos no PostgreSQL, e o frontend se comunica com o backend utilizando requisições HTTP e JSON.

## Tecnologias utilizadas

- **Frontend:** HTML5, CSS3, TypeScript e Vite.
- **Backend:** Node.js, TypeScript e Express.
- **Banco de dados:** PostgreSQL e `node-postgres` (`pg`).
- **Ferramentas:** npm, Git e GitHub.

## Funcionalidades

- Cadastro de tarefas com validação básica do título.
- Listagem das tarefas cadastradas.
- Marcação de tarefas como concluídas ou pendentes.
- Exclusão de tarefas.
- Persistência dos dados no PostgreSQL.
- Comunicação entre frontend e backend via API REST.
- Tratamento básico de erros e respostas HTTP.

## Arquitetura

```text
Navegador (HTML/CSS/TypeScript)
             |
        HTTP / JSON
             |
      Proxy do Vite
             |
        API Express
             |
       node-postgres
             |
         PostgreSQL
```

## Estrutura do projeto

Principais arquivos da aplicação (sem dependências instaladas e arquivos gerados pela compilação):

```text
gerenciador-tarefas/
├── backend/
│   ├── src/
│   │   ├── db.ts
│   │   └── server.ts
│   ├── .env.example
│   ├── package.json
│   ├── package-lock.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── main.ts
│   │   └── style.css
│   ├── index.html
│   ├── vite.config.ts
│   ├── package.json
│   ├── package-lock.json
│   └── tsconfig.json
├── .gitignore
├── package.json
└── package-lock.json
```

## Como executar localmente

### Pré-requisitos

- Node.js e npm instalados (versão do Node.js compatível com a versão do Vite utilizada).
- PostgreSQL instalado e em execução.
- Git instalado para clonar o repositório.

### 1. Clone o repositório

```bash
git clone https://github.com/programmer977/gerenciador-tarefas.git
cd gerenciador-tarefas
```

### 2. Crie o banco de dados

Acesse o PostgreSQL como administrador:

```bash
sudo -u postgres psql
```

Crie um usuário e um banco para a aplicação, substituindo a senha do exemplo:

```sql
CREATE ROLE tarefas_app WITH LOGIN PASSWORD 'substitua_por_uma_senha_forte';
CREATE DATABASE tarefas_db OWNER tarefas_app;
```

Saia com `\q` e conecte-se ao novo banco:

```bash
psql -h 127.0.0.1 -U tarefas_app -d tarefas_db -W
```

Crie a tabela:

```sql
CREATE TABLE tarefas (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    titulo VARCHAR(120) NOT NULL CHECK (length(btrim(titulo)) > 0),
    concluida BOOLEAN NOT NULL DEFAULT FALSE,
    criada_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

Saia com `\q`.

> Se você já possui um usuário e um banco configurados, utilize suas credenciais e certifique-se de que a tabela `tarefas` exista no banco indicado no `.env`.

### 3. Configure as variáveis de ambiente do backend

No diretório `backend/`, crie um arquivo `.env` com:

```env
PGHOST=127.0.0.1
PGPORT=5432
PGUSER=tarefas_app
PGPASSWORD=sua_senha_real
PGDATABASE=tarefas_db
```

Substitua `sua_senha_real` pela senha configurada no PostgreSQL. **Não versione o arquivo `.env` com credenciais reais.**

### 4. Instale as dependências e execute o backend

Abra um terminal na raiz do repositório e execute:

```bash
cd backend
npm install
npm run dev
```

A API utiliza o endereço `http://localhost:3000`.

Outros scripts disponíveis no backend:

```bash
npm run typecheck  # Verifica os tipos, sem compilar
npm run build      # Compila o TypeScript para dist/
npm start          # Executa a versão compilada
```

Para utilizar `npm start`, execute `npm run build` antes.

### 5. Instale as dependências e execute o frontend

Abra **outro terminal** na raiz do repositório e execute:

```bash
cd frontend
npm install
npm run dev
```

Acesse no navegador o endereço indicado pelo Vite, geralmente:

**http://localhost:5173**

O proxy configurado no Vite encaminha as requisições `/api` para o backend na porta `3000`. Para utilizar a aplicação, mantenha backend e frontend em execução.

## Endpoints da API

| Método | Endpoint | Descrição | Sucesso |
|---|---|---|---|
| `GET` | `/api/tarefas` | Lista todas as tarefas | `200 OK` |
| `POST` | `/api/tarefas` | Cadastra uma tarefa | `201 Created` |
| `PATCH` | `/api/tarefas/:id` | Atualiza o estado de conclusão | `200 OK` |
| `DELETE` | `/api/tarefas/:id` | Exclui uma tarefa | `204 No Content` |

O backend também pode responder com `400 Bad Request` para dados inválidos, `404 Not Found` quando a tarefa não existe e `500 Internal Server Error` para falhas inesperadas.

### Exemplo: cadastrar tarefa

**Requisição**

```http
POST /api/tarefas
Content-Type: application/json
```

```json
{
  "titulo": "Estudar TypeScript"
}
```

**Resposta esperada (`201 Created`; ID e data ilustrativos):**

```json
{
  "id": 1,
  "titulo": "Estudar TypeScript",
  "concluida": false,
  "criada_em": "2026-10-15T15:00:00.000Z"
}
```

### Exemplo: atualizar uma tarefa

```http
PATCH /api/tarefas/1
Content-Type: application/json
```

```json
{
  "concluida": true
}
```

### Exemplo: excluir uma tarefa

```http
DELETE /api/tarefas/1
```

Quando a exclusão é bem-sucedida, a API responde com `204 No Content`, sem corpo JSON.

## Objetivo do projeto

Compreender na prática a integração entre frontend, API REST e banco de dados relacional, exercitando:

- Métodos HTTP e códigos de resposta.
- Manipulação do DOM e consumo de APIs com `fetch()`.
- Tipagem estática com TypeScript.
- Rotas e middlewares com Express.
- Consultas SQL parametrizadas e persistência no PostgreSQL.
- Organização e execução de um projeto com frontend e backend separados.

## Autor

**João Marcelo Alves de Carvalho**  
Estudante de Ciência da Computação.

GitHub: [programmer977](https://github.com/programmer977)
