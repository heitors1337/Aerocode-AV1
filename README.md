# Aerocode - Gestão de Produção Aeronáutica (AV1)

## 📌 Descrição

O Aerocode é um sistema de interface de linha de comando (CLI) desenvolvido em TypeScript para gerenciar o ciclo de produção de aeronaves, inspirado nos processos da Embraer. O projeto aplica conceitos de Programação Orientada a Objetos (POO), tipagem estática, persistência de dados e autenticação de usuários.

O sistema simula desde o cadastro de aeronaves e funcionários até a geração do relatório final de entrega.

## ⚙️ Funcionalidades

- Cadastro de aeronaves comerciais e militares.
- Cadastro e gerenciamento de funcionários.
- Controle de permissões (Administrador, Engenheiro e Operador).
- Gerenciamento de peças e atualização de seus status.
- Controle das etapas de produção com validação da ordem de execução.
- Registro de testes elétricos, hidráulicos e aerodinâmicos.
- Geração de relatório final da aeronave.
- Persistência de dados em arquivos JSON.

## 🛠️ Tecnologias Utilizadas

- TypeScript
- Node.js
- File System (`fs`)
- ts-node
- tsx

## ▶️ Como Executar

Instale as dependências:

```bash
npm install
```

Execute o sistema:

```bash
npx tsx src/index.ts
```

## 👤 Login 

```
Usuário: admin
Senha: 123
```