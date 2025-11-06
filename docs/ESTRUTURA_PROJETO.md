# Estrutura Técnica do Projeto

## Stack Tecnológica Sugerida

### Frontend
- **Framework:** React/Next.js ou Vue.js
- **Estado Global:** Redux/Zustand ou Pinia
- **Realtime:** Socket.io Client
- **UI Components:** Tailwind CSS + componente library (Shadcn/ui, Ant Design, etc.)
- **Mapas/Canvas:** Fabric.js, Konva.js ou Pixi.js para renderização de mapas

### Backend
- **Framework:** Node.js (Express/NestJS) ou Python (FastAPI)
- **Realtime:** Socket.io ou WebSockets
- **Banco de Dados:**
  - PostgreSQL (dados relacionais)
  - Redis (cache e sessões)
  - Possivelmente MongoDB (dados de sessões de jogo)
- **Autenticação:** NextAuth.js ou Auth0 ou implementação própria com JWT
- **Storage:** AWS S3, Cloudinary ou similar para assets (mapas, imagens)

### Infraestrutura
- **Containerização:** Docker
- **CI/CD:** GitHub Actions ou similar
- **Deploy:** Vercel/Netlify (frontend), AWS/Railway/Render (backend)

---

## Arquitetura de Módulos

### 1. Módulo de Autenticação
- Login com múltiplos provedores (Google, Discord, Steam)
- Sistema de confirmação de email
- Recuperação de senha
- Gerenciamento de contas vinculadas

### 2. Módulo de Usuários e Perfis
- Perfil do usuário
- Configurações de conta
- Gerenciamento de assinaturas

### 3. Módulo de Sessões
- Criação de sessões
- Gerenciamento de sessões
- Sistema de roles e permissões
- Convites e gestão de jogadores

### 4. Módulo de Mesa de RPG
- Renderização de mapas
- Sistema de Fog of War
- Gerenciamento de assets (monstros, NPCs, objetos)
- Sistema de fichas
- Sistema de status e efeitos
- Sistema de rolagem de dados

### 5. Módulo de Chat
- Chat global
- Chat pessoal
- Chat da mesa
- Chat em grupos

### 6. Módulo de Dashboard do Mestre
- Gerenciamento de vida
- Histórico de ações
- Gerenciamento de habilidades
- Sistema de logs

### 7. Módulo de Notificações
- Notificações em tempo real
- Sistema de alertas globais
- Notificações de sessão

### 8. Módulo de Assets
- Upload de mapas
- Upload de livros de regras
- Gerenciamento de arquivos
- Biblioteca de assets

### 9. Módulo de Comunicação
- Sistema de email
- Patch notes
- Comunicados globais

---

## Estrutura de Diretórios Sugerida

```
rpg-platform/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   ├── session/
│   │   │   ├── map/
│   │   │   ├── chat/
│   │   │   └── dashboard/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── store/
│   │   ├── services/
│   │   └── utils/
│   └── public/
├── backend/
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── users/
│   │   │   ├── sessions/
│   │   │   ├── maps/
│   │   │   ├── chat/
│   │   │   └── dashboard/
│   │   ├── shared/
│   │   └── config/
│   └── tests/
├── shared/
│   └── types/
└── docs/
```

---

## Modelos de Dados Principais

### User
- id, email, username, avatar
- provider (google/discord/steam/platform)
- subscription_plan
- created_at, updated_at

### Session
- id, name, description
- master_id (owner)
- status (active/paused/ended)
- settings (fog_war, etc.)
- created_at, updated_at

### SessionMember
- id, session_id, user_id
- role (master/co_master/player/listener)
- permissions (custom JSON)
- joined_at

### Map
- id, session_id, name
- image_url, dimensions
- fog_war_data
- created_at, updated_at

### Asset
- id, session_id, name, type
- position, status, health
- metadata (JSON)

### CharacterSheet
- id, session_id, user_id
- data (JSON structure)
- created_at, updated_at

### ChatMessage
- id, session_id, user_id
- type (global/personal/table)
- content, timestamp

---

## Próximos Passos

1. Definir stack tecnológica final
2. Configurar ambiente de desenvolvimento
3. Criar estrutura inicial do projeto
4. Implementar módulo de autenticação
5. Implementar estrutura básica de sessões
6. Desenvolver sistema de chat básico
7. Implementar renderização de mapas
8. Desenvolver Dashboard do Mestre




