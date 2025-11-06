# 🎲 RPG Real-Time System Backend

Backend em tempo real para uma aplicação de RPG (similar ao Roll20), projetada para suportar **mestre**, **jogadores** e **sistemas de ficha personalizáveis**.  
O foco é em **tempo real**, **baixo acoplamento** e **flexibilidade** para evoluir futuramente como um ecossistema completo (app, web e integração com desktop/Steam).

---

## 🧠 Visão Geral

O sistema é composto por:

- **Backend em Node.js + TypeScript**
- **Banco de dados MongoDB** (modelagem flexível e alta performance)
- **Comunicação em tempo real com Socket.IO**
- **Autenticação e permissões baseadas em níveis (player, mestre, admin)**
- **Suporte a múltiplas salas e campanhas simultâneas**
- **Suporte a fichas dinâmicas e customizáveis**
- **Infraestrutura para persistência de logs e histórico de ações**

---

## 🏗️ Arquitetura Geral

```mermaid
graph TD;
    Client[🎮 Client (Electron/React)] -->|WebSocket| Gateway[🌐 Socket.IO Gateway];
    Gateway -->|Eventos| Services[⚙️ Services Layer];
    Services -->|CRUD| MongoDB[(🗄️ MongoDB)];
    Services --> Auth[🔐 Auth & Permissions];
    Auth --> MongoDB;
```

---

## 🧩 Tecnologias Principais

| Categoria | Tecnologia | Descrição |
|------------|-------------|------------|
| Linguagem | **TypeScript** | Tipagem forte, manutenção e escalabilidade |
| Runtime | **Node.js** | Performance e ecossistema maduro |
| Banco de dados | **MongoDB** | Flexibilidade para fichas e dados dinâmicos |
| Comunicação | **Socket.IO** | Tempo real (sincronização de salas, rolagens, etc.) |
| Autenticação | **JWT** | Sessões seguras e escaláveis |
| Testes | **Jest** | Testes unitários e de integração |
| ORM/ODM | **Mongoose** | Modelagem de dados MongoDB |
| Cache (futuro) | **Redis** | Otimização de dados e eventos frequentes |
| Infraestrutura (futuro) | **Docker** | Contêinerização e deploy simplificado |

---

## 🧱 Estrutura de Pastas

```
backend/
├── src/
│   ├── core/
│   │   ├── socket/
│   │   │   ├── index.ts          # Configuração principal do Socket.IO
│   │   │   ├── events/           # Eventos (ex: roll-dice, update-character)
│   │   │   └── middlewares/
│   │   ├── auth/                 # JWT, níveis de permissão, middlewares
│   │   ├── database/
│   │   │   ├── models/           # Schemas Mongoose
│   │   │   ├── repositories/     # Abstração de persistência
│   │   │   └── index.ts          # Conexão com Mongo
│   │   ├── services/             # Lógica de negócio
│   │   ├── utils/                # Funções auxiliares
│   │   └── config/               # Configurações gerais
│   ├── tests/
│   │   ├── unit/
│   │   └── integration/
│   └── index.ts                  # Ponto de entrada do servidor
├── .env                          # Variáveis de ambiente
├── package.json
├── tsconfig.json
└── README.md
```

---

## ⚙️ Funcionalidades Planejadas

### 🧑‍🤝‍🧑 Permissões e Usuários
- Autenticação via JWT
- Três níveis principais:
  - **Player:** cria e gerencia fichas próprias
  - **Mestre:** gerencia campanhas, jogadores e rolagens globais
  - **Admin:** gerenciamento completo (criação, logs, permissões)

### 🧾 Fichas de Personagem
- Estrutura flexível e dinâmica (definição customizável pelo mestre)
- Atributos customizados (ex: força, destreza, HP, mana)
- Vínculo automático com sala/campanha

### ⚔️ Campanhas e Salas
- Salas em tempo real (Socket.IO)
- Sincronização instantânea entre jogadores
- Histórico de ações, chat e rolagens
- Configurações customizadas por mestre

### 🎲 Rolagens de Dados
- Suporte a rolagens padrão (`1d20 + mod`)
- Eventos broadcast para todos os usuários conectados
- Logs armazenados no banco

### 🪄 Sistema de Eventos
- Conectado via Socket.IO
- Exemplo de evento:

```typescript
socket.on("roll-dice", ({ expression, user }) => {
  const result = rollDice(expression);
  io.to(user.roomId).emit("dice-result", { user, result });
});
```

---

## 🧪 Testes Automatizados

- **Unit Tests:** lógica de fichas, rolagens, validações
- **Integration Tests:** sockets e autenticação
- **Mock de banco:** MongoMemoryServer para testes isolados
- **Cobertura esperada:** 80%+

---

## 🚀 Como Executar

### 1. Clonar o projeto
```bash
git clone https://github.com/seuusuario/rpg-realtime-backend.git
cd rpg-realtime-backend
```

### 2. Instalar dependências
```bash
npm install
```

### 3. Configurar variáveis de ambiente
Crie um arquivo `.env`:
```
MONGO_URI=mongodb://localhost:27017/rpg_backend
JWT_SECRET=sua_chave_segura
PORT=3000
```

### 4. Rodar o servidor
```bash
npm run dev
```

### 5. Rodar testes
```bash
npm test
```

---

## 📡 Rotas Iniciais (HTTP)

| Método | Rota | Descrição |
|--------|------|------------|
| `POST` | `/auth/register` | Cria um novo usuário |
| `POST` | `/auth/login` | Gera token JWT |
| `GET` | `/users/me` | Retorna informações do usuário logado |

---

## 🧠 Futuras Expansões

- [ ] Sistema de módulos customizáveis para fichas
- [ ] Dashboard do mestre (monitoramento em tempo real)
- [ ] Integração com Electron e React
- [ ] Modo offline (cache local + sync)
- [ ] WebRTC para voz e vídeo durante sessões
- [ ] Exportação de campanhas e logs em JSON

---

## 🧑‍💻 Autor

**Vitor Batista**  
Full Stack & Game Developer  
🎮 Experiência com Node.js, MongoDB, Electron, React e integração em tempo real.

---

## 📄 Licença

MIT License © 2025 Vitor Batista
