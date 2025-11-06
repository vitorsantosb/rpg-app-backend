# Requisitos MVP - Plataforma de RPG de Mesa

## 1. Menus Iniciais e Navegação

### 1.1 Sistema de Login
- Login com múltiplos provedores:
  - Google
  - Discord
  - Steam
  - Conta da plataforma (própria)

### 1.2 Página de Boas-Vindas
Ponto central de navegação que dá acesso a:
- **Configurações da Conta**
- **Comunidade** (Futuro)
- **Loja (Assets)** (Futuro)
- **Banner de Notícias**
- **Menu Principal** (Menu lateral hamburger)
- **Patch Notes**
- **Comunicados/Alertas** (Mensagens globais do sistema)

### 1.3 Menu Principal (Sidebar)
- **Sidebar Open (Aberta):**
  - Perfil do usuário (avatar + nome)
  - Seção MAIN:
    - Dashboard
    - Área do RPG (com sub-itens)
    - Atualizações
    - Agenda
  - Seção Planos de Assinatura:
    - Assinar
    - Configurar assinatura
    - Mudança de plano
    - Cancelar Assinatura
  - Seção Configurações:
    - Vincular conta
    - Gerenciar conta
    - Pagamentos
    - Gerais
  - Help
  - Logout Account

- **Sidebar Closed (Fechada):**
  - Versão compacta apenas com ícones
  - Sub-menus podem ser acessados mesmo com sidebar fechada

**Observações:**
- Ícone de usuário não estará na barra de menu lateral
- Estilo da sidebar só será mostrado quando o usuário estiver dentro de uma sessão

### 1.4 Gerenciamento de Sessões
- **Criar Sessões**
- **Gerenciar Sessões**
- **Buscar Sessões** (Futuro)

---

## 2. Requisitos de Sessões de RPG

### 2.1 Requisitos Gerais
1. Sistema de roles (cargos/permissões)
2. Mais de um administrador por sessão
3. Cargos/permissões customizáveis

### 2.2 Cargos e Permissões

#### Mestre/Administrador (Dono) - Nível 0
- Poder completo + área do mestre
- Todas as funcionalidades do Co-Mestre, mais:
  - Criação da campanha
  - Deletar campanha
  - Prioridade: Pastas secretas
  - Livros de regras (upload próprio) - disponibilizar para outros jogadores (liberar ou não download)

#### Co-Mestre (Admin da Sessão) - Nível 1
- Ações não destrutivas (exceto deletar sessão e área do mestre particular)
- Funcionalidades:
  - Ativar/Desativar/Adicionar/remover assets
  - Gerenciamento/Criar/deletar/editar/ocultar fichas
  - Ocultar elementos no mapa
  - Gerenciar objetos no mapa
  - Soundboard (efeitos sonoros, músicas) - plano grátis (fixos)
  - Anotações
  - Configurar visualização do escudo do mestre
  - Chat pessoal com o player

#### Jogador - Nível 2
- Acesso básico e interação com mesa
- Funcionalidades:
  - Criar/editar ficha
  - Anotações
  - Chat Geral
  - Acesso a livros disponibilizados pelo mestre

#### Ouvinte - Nível 3
- Visualização da mesa e do chat
- Funcionalidade futura: Áudio

### 2.3 Funcionalidades Após Criação de Sessão

1. **Visualização do mapa**
2. **FOG WAR** (Névoa de guerra)
3. **Interação com os elementos da mesa**
4. **Upload do mapa** (Gerenciamento de arquivos - Assets)
5. **Monstros**
6. **Jogadores**
7. **Realtime** (Tempo real)
8. **Chat**
9. **Gerenciamento de telas** - troca entre mapas
10. **Dashboard do Mestre**
11. **Efeitos de status**
12. **Pincel**
13. **Métrica**
14. **Sistema de ping**
15. **Mapa em quadrante**
16. **Criação da ficha**

### 2.4 Dashboard do Mestre

- Gerenciar vida dos assets (monstros e afins)
- Gerenciamento de fichas dos jogadores
- Histórico de alteração - vida, itens, edições (logs)
- Histórico de rolagem de dados
- Adicionar novos player
- Remover player
- Banir jogadores (reason)
- Pausar sessão (persistência do estado atual)
- Gerenciamento de habilidades (jogadores e monstros)
- Gerenciamento de passivas
- Possível integração com API's de terceiros
- Liberação de leveling

---

## 3. Requisitos Globais (Obrigatórios)

### 3.1 Sistema de Chat
Fluxo do sistema de chat:
1. **Sistema de Chat** → 
2. **Grupo?** → 
3. **Chat pessoal** → 
4. **Chat da mesa** (Obrigatório)

### 3.2 Sistema de Email e Conta
Fluxo de gerenciamento de conta:
1. **Envio de Email** → 
2. **Confirmação de conta** → 
3. **Recuperação de senha** → 
4. **Troca de senha**

### 3.3 Funcionalidades Globais
- **Notificações** (Sistema de notificações global)
- **Chat** (Acessível em toda aplicação)
- **Profile Picture (com nome)** (Perfil do usuário acessível globalmente)

---

## 4. Design e Interface

### 4.1 Patch Notes
- Design baseado em referências do Steam
- Exibição de atualizações e notas de patch
- Interface similar à "Central de Jogos" do Steam

### 4.2 Estilo Visual
- Sidebar com tema escuro (fundo escuro, texto branco)
- Grid de fundo para organização visual
- Interface moderna e intuitiva

---

## 5. Funcionalidades Futuras

- **Comunidade** (Futuro)
- **Loja (Assets)** (Futuro)
- **Buscar Sessões** (Futuro)
- **Áudio para Ouvintes** (Futuro)

---

## 6. Notas Técnicas

- Sistema precisa ser realtime
- Persistência de estado (especialmente para pausar sessão)
- Sistema de arquivos/upload (mapas, livros de regras, assets)
- Sistema de logs/auditoria
- Integração com APIs de terceiros (possível)
- Sistema de assinatura/planos (já mencionado no menu)




