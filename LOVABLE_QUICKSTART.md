# ZapNode - Lovable CRM Integration - Quick Start

## O que foi criado nesta branch?

✅ **Adapter Lovable CRM** - Integra WhatsApp com seu CRM no Lovable
✅ **Arquivo de configuracao** - Template .env.lovable pronto pra usar
✅ **Documentacao completa** - Guia de implementacao em docs/LOVABLE_INTEGRATION.md

---

## Passos para implementar no seu CRM Lovable

### 1. Seu Lovable CRM precisa de um BACKEND

Por enquanto, seu CRM foi desenvolvido SEM backend. Voce precisa pedir ao Lovable para criar:

**Express.js REST API** com os seguintes endpoints:

```
POST   /api/contacts          - Criar contato
GET    /api/contacts/:phone   - Obter contato
PUT    /api/contacts/:id      - Atualizar contato

POST   /api/conversations     - Criar conversa
GET    /api/conversations/:id - Obter conversas
PUT    /api/conversations/:id - Atualizar conversa

POST   /api/messages          - Adicionar mensagem
GET    /api/messages/:id      - Obter mensagens
```

Veja detalhes completos em: `docs/LOVABLE_INTEGRATION.md`

### 2. Clone esta branch localmente

```bash
git clone https://github.com/maestroicaro/zapnode.git
cd zapnode
git checkout lovable-crm-integration
npm install
```

### 3. Configure as variaveis de ambiente

```bash
cp .env.lovable .env
```

Edite `.env`:
```bash
LOVABLE_API_URL=http://seu-crm.com/api
LOVABLE_API_KEY=sua_chave_api_secreta
WHATSAPP_PHONE_NUMBER=5511999999999
```

### 4. Inicie o ZapNode

```bash
npm start
```

Scanneie o QR Code com WhatsApp.

---

## Arquivos nesta branch

```
zapnode/
├── app/
│   ├── adapters/
│   │   ├── lovable-crm-adapter.js    <- NOVO: Adapter para Lovable
│   │   └── chatwoot-adapter.js       (Original)
│   ├── server.js
│   ├── webhook.js
│   └── whatsapp.js
├── docs/
│   └── LOVABLE_INTEGRATION.md        <- NOVO: Documentacao detalhada
├── .env.lovable                      <- NOVO: Template de configuracao
├── LOVABLE_QUICKSTART.md             <- NOVO: Este arquivo
└── ...
```

---

## O que fazer agora?

1. **Para o Lovable criar o backend:**
   - Abra seu projeto no Lovable
   - Peça para criar um servidor Express.js
   - Implemente os endpoints listados em `docs/LOVABLE_INTEGRATION.md`
   - Gere uma API Key para autenticacao

2. **Quando o backend estiver pronto:**
   - Clone esta branch
   - Configure o .env
   - Execute `npm start`
   - Teste a integracao

3. **Adaptar webhook.js** (EM PROGRESSO):
   - O arquivo `app/webhook.js` ainda usa Chatwoot
   - Depois que testar, atualize para usar `LovableCRMAdapter`

---

## Suporte

Tem duvidas? Veja:
- `docs/LOVABLE_INTEGRATION.md` - Documentacao tecnica completa
- `.env.lovable` - Exemplo de configuracao
- `app/adapters/lovable-crm-adapter.js` - Codigo do adapter com comentarios

---

**Branch criada em 26/12/2025**
**Status: Pronta para testes com o backend do Lovable**
