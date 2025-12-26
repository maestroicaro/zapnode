# ZapNode - Integracao WhatsApp + CRM

> Conecte WhatsApp com seu CRM e sincronize conversas em tempo real

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-16+-green.svg)](https://nodejs.org/)

## Visao Geral

ZapNode e uma aplicacao Node.js que conecta WhatsApp Web com seu CRM, permitindo:

- Receber mensagens do WhatsApp e sincronizar no CRM
- Enviar respostas do CRM de volta para o WhatsApp
- Gerenciar contatos e conversas automaticamente
- Manter historico completo de mensagens

## Branches Disponiveis

### `main` - Chatwoot
Integracao original com Chatwoot CRM.

### `lovable-crm-integration` **[NOVO]** 
Integracao com CRM desenvolvido no Lovable.

**Use esta branch se:**
- Voce desenvolveu seu CRM no Lovable
- Precisa de um backend REST API personalizado
- Quer sincronizar mensagens do WhatsApp no seu CRM

---

## Guia Rapido para a Branch Lovable

### 1. Clonar a branch

```bash
git clone https://github.com/maestroicaro/zapnode.git
cd zapnode
git checkout lovable-crm-integration
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variaveis de ambiente

Copie o template:

```bash
cp .env.lovable .env
```

Edite o arquivo `.env`:

```env
# URL e chave da API do seu CRM Lovable
LOVABLE_API_URL=http://seu-crm.com/api
LOVABLE_API_KEY=sua_chave_api_super_secreta

# Numero do WhatsApp
WHATSAPP_PHONE_NUMBER=5511999999999

# Configuracoes opcionais
NODE_ENV=development
PORT=3001
```

### 4. Iniciar o ZapNode

```bash
npm start
```

Voce vera um QR Code no terminal. Escaneie com seu WhatsApp para autorizar.

---

## O que o Lovable CRM Precisa Implementar

Seu CRM Lovable precisa ter um **backend REST API** com os seguintes endpoints:

### Contatos

```
POST   /api/contacts          - Criar contato
GET    /api/contacts/:phone   - Obter contato
PUT    /api/contacts/:id      - Atualizar contato
DELETE /api/contacts/:id      - Remover contato
```

### Conversas

```
POST   /api/conversations     - Criar conversa
GET    /api/conversations/:id - Obter conversas
PUT    /api/conversations/:id - Atualizar conversa
DELETE /api/conversations/:id - Remover conversa
```

### Mensagens

```
POST   /api/messages          - Adicionar mensagem
GET    /api/messages/:id      - Obter mensagens
```

### Webhook

```
POST   /api/webhook/whatsapp  - Receber mensagens do WhatsApp
```

**Autenticacao:** Todas as requisicoes usam header `X-API-Key`

---

## Arquivos Importantes

### Para a Branch Lovable

```
zapnode/
├── app/
│   ├── adapters/
│   │   ├── lovable-crm-adapter.js    <- Adapter para Lovable
│   │   └── chatwoot-adapter.js       <- Adapter original (nao usado)
│   ├── server.js                     <- Servidor principal
│   ├── webhook.js                    <- Handler de webhooks
│   └── whatsapp.js                   <- Integracao com WhatsApp
├── docs/
│   └── LOVABLE_INTEGRATION.md        <- Documentacao tecnica detalhada
├── .env.lovable                      <- Template de configuracao
├── LOVABLE_QUICKSTART.md             <- Guia rapido
└── README.md                         <- Este arquivo
```

---

## Como Funciona

```
WhatsApp Web
    |
    | (Puppeteer detecta)
    v
[ZapNode]
    |
    | (LovableCRMAdapter traduz)
    v
[Seu CRM Lovable]
    |
    | (API REST)
    v
[Banco de Dados]
```

### Fluxo de Mensagens Recebidas

1. **WhatsApp Web:** Usuario envia mensagem
2. **ZapNode:** Puppeteer detecta a nova mensagem
3. **Adapter Lovable:** Cria/atualiza contato e conversa
4. **API do CRM:** Envia dados para seu backend
5. **CRM:** Armazena no banco de dados
6. **Interface:** Voce ve a mensagem no CRM em tempo real

### Fluxo de Mensagens Enviadas

1. **CRM:** Agente responde uma conversa
2. **Webhook:** ZapNode recebe a resposta
3. **ZapNode:** Envia para WhatsApp Web
4. **WhatsApp:** Mensagem e enviada ao cliente

---

## Requisitos

### Pre-requisitos

- Node.js versao 16 ou superior
- npm ou yarn
- Chrome/Chromium (para Puppeteer)
- CRM Lovable com backend implementado

### Requisitos do CRM Lovable

- Express.js ou similar
- PostgreSQL ou MongoDB
- API Key segura (minimo 32 caracteres)
- Endpoints implementados conforme especificacao

---

## Instalacao

### 1. Clone o repositorio

```bash
git clone https://github.com/maestroicaro/zapnode.git
cd zapnode
git checkout lovable-crm-integration
```

### 2. Instale as dependencias

```bash
npm install
```

### 3. Configure as variaveis de ambiente

```bash
cp .env.lovable .env
# Edite o arquivo .env com suas configuracoes
```

### 4. Inicie o servidor

```bash
npm start
```

---

## Configuracao

Veja o arquivo `.env.lovable` para todas as opcoes de configuracao.

### Variaveis Principais

```env
# Obrigatorias
LOVABLE_API_URL=http://localhost:3000/api
LOVABLE_API_KEY=sua_chave_api

# Opcionais
NODE_ENV=development
PORT=3001
LOG_LEVEL=info
SYNC_CONTACTS=true
SYNC_MESSAGES=true
```

---

## Uso

### Iniciar em desenvolvimento

```bash
npm run dev
```

### Iniciar em producao

```bash
npm start
```

### Ver logs

```bash
cat logs/zapnode.log
```

---

## Documentacao

- **[LOVABLE_INTEGRATION.md](docs/LOVABLE_INTEGRATION.md)** - Guia tecnico completo
- **[LOVABLE_QUICKSTART.md](LOVABLE_QUICKSTART.md)** - Guia rapido
- **[.env.lovable](.env.lovable)** - Variaveis de ambiente

---

## Estrutura do Adapter

O arquivo `app/adapters/lovable-crm-adapter.js` implementa:

- **upsertContact()** - Sincroniza contatos
- **upsertConversation()** - Cria/atualiza conversas
- **addMessage()** - Armazena mensagens
- **getMessages()** - Recupera historico
- **closeConversation()** - Fecha conversas

---

## Testes

Testar os endpoints do CRM:

```bash
# Criar contato
curl -X POST http://localhost:3000/api/contacts \
  -H "X-API-Key: sua_chave" \
  -H "Content-Type: application/json" \
  -d '{"phone": "+5511999999999", "name": "Joao"}'

# Obter contato
curl -X GET http://localhost:3000/api/contacts/+5511999999999 \
  -H "X-API-Key: sua_chave"
```

---

## Troubleshooting

### QR Code nao aparece
- Certifique-se de que o Chrome/Chromium esta instalado
- Verifique os logs: `npm start 2>&1 | grep -i erro`

### Conexao recusada ao CRM
- Verifique se `LOVABLE_API_URL` esta correto
- Confirme que `LOVABLE_API_KEY` foi gerada no seu CRM
- Teste a conexao: `curl -H "X-API-Key: sua_chave" http://seu-crm/api/contacts`

### Mensagens nao sincronizam
- Verifique os logs do ZapNode
- Confirme que o webhook esta recebendo dados
- Teste os endpoints do CRM manualmente

---

## Status da Branch

- [x] Adapter Lovable CRM criado
- [x] Configuracao .env.lovable
- [x] Documentacao tecnica
- [x] Guia rapido
- [ ] Webhook.js adaptado para usar LovableCRMAdapter
- [ ] Testes de integracao
- [ ] Deploy em producao

---

## Contribuindo

Duvidas ou sugestoes? Abra uma issue no repositorio!

---

## Licenca

MIT License - veja [LICENSE](LICENSE) para mais detalhes.

---

## Proximos Passos

1. **Backend Lovable:** Implemente os endpoints conforme especificacao
2. **Teste Local:** Configure o .env e teste a integracao
3. **Webhook Adaptado:** Quando robusto, adapte webhook.js para usar o adapter
4. **Deploy:** Configure em ambiente de producao

---

**Desenvolvido com amor por maestroicaro**

Ultima atualizacao: 26 de dezembro de 2025

Branch: `lovable-crm-integration`
