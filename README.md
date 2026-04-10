# Aerocode - Gestão de Produção Aeronáutica (AV1)

## 📌 Descrição
O **Aerocode** é um sistema de interface de linha de comando (CLI) desenvolvido para gerenciar o ciclo de vida da produção de aeronaves, inspirado nos processos da Embraer. O projeto foca em Programação Orientada a Objetos (POO), tipagem estática e persistência de dados.

O sistema simula desde a autenticação de funcionários até a entrega final, com validação de etapas de produção e geração de relatórios técnicos.

---

## ⚙️ Funcionalidades
- **Gestão de Aeronaves:** Cadastro de modelos comerciais e militares.
- **Controle de Produção:** Sistema de etapas com trava lógica (não permite finalizar uma etapa sem concluir a anterior).
- **Inventário de Peças:** Associação de peças nacionais e importadas com atualização de status.
- **Segurança:** Autenticação de funcionários com diferentes níveis de permissão (Admin, Engenheiro, Operador).
- **Qualidade:** Registro de testes elétricos, hidráulicos e aerodinâmicos.
- **Persistência de Dados:** Salvamento automático do estado da aeronave em JSON e geração de relatório final em TXT.

---

## 🛠️ Tecnologias Utilizadas
- **TypeScript:** Linguagem principal (Tipagem estática e POO).
- **Node.js (v24+):** Ambiente de execução.
- **File System (fs):** Para persistência de dados em arquivos de texto.
- **ts-node:** Carregamento em tempo de execução para TypeScript.

---

## ▶️ Como Executar

1. **Instale as dependências:**
   ```bash
   npm install

2. Execute o sistema:
Devido ao uso de ES Modules e à versão recente do Node.js, utilize o carregador oficial para garantir a compatibilidade:

```bash
  node --loader ts-node/esm --no-warnings src/index.ts
