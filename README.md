# Site Campanha Hexa - MVP

Este é o MVP do sistema de Bolão para a Campanha Hexa da Copercana.

## Tecnologias
- **Frontend**: React, Vite, TailwindCSS, Framer Motion, Lucide React
- **Backend**: Node.js, Express, MySQL

## Como rodar o projeto

### 1. Requisitos
- Node.js instalado
- MySQL instalado e rodando

### 2. Configuração do Banco de Dados
1. Crie um banco de dados chamado `bolao_hexa`.
2. O sistema criará a tabela `participantes` automaticamente ao iniciar o servidor.

### 3. Configuração do Backend
1. Entre na pasta `backend/`.
2. Edite o arquivo `.env` com suas credenciais do MySQL.
3. Instale as dependências: `npm install` (já feito na inicialização).
4. Inicie o servidor: `node server.js`

### 4. Configuração do Frontend
1. Entre na pasta `frontend/`.
2. Instale as dependências: `npm install` (já feito na inicialização).
3. Inicie o projeto: `npm run dev`

## Estrutura do Banco de Dados
```sql
CREATE TABLE participantes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150),
    telefone VARCHAR(20),
    email VARCHAR(150),
    cupom_fiscal VARCHAR(100) UNIQUE,
    placar_brasil INT,
    placar_adversario INT,
    primeiro_gol VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
