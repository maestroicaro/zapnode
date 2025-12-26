# ZapNode - Integracao com Lovable CRM

## Visao Geral

Esta branch (`lovable-crm-integration`) adapta o ZapNode para funcionar com um CRM desenvolvido no Lovable, permitindo sincronizar conversas do WhatsApp diretamente no seu CRM.

## O que e o ZapNode?

ZapNode e uma aplicacao Node.js que conecta WhatsApp Web ao seu CRM, criando uma ponte automatica de comunicacao. Originalmente desenvolvido para Chatwoot, agora e adaptado para Lovable CRM.

---

## CONFIGURACAO RAPIDA

### 1. Clonar a Branch

```bash
git clone https://github.com/maestroicaro/zapnode.git
cd zapnode
git checkout lovable-crm-integration
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Variaveis de Ambiente

```bash
cp .env.lovable .env
```

Edite o arquivo `.env`:

```bash
LOVABLE_API_URL=http://localhost:3000/api
LOVABLE_API_KEY=sua_chave_api_aqui
WHATSAPP_PHONE_NUMBER=5511999999999
```

### 4. Iniciar o ZapNode

```bash
npm start
```

---

## O que o Lovable CRM Precisa Implementar

Seu CRM Lovable precisa expor estes ENDPOINTS REST:

### A) CONTATOS

```
POST   /api/contacts
GET    /api/contacts/:phone
PUT    /api/contacts/:id
DELETE /api/contacts/:id
```

Payload:
```json
{
  "phone": "+5511999999999",
  "name": "Joao Silva",
  "avatar_url": "https://...",
  "custom_attributes": {
    "origem": "whatsapp",
    "primeiro_contato": "2025-12-26T15:30:00Z"
  }
}
```

### B) CONVERSAS

```
POST   /api/conversations
GET    /api/conversations/:contact_id
PUT    /api/conversations/:id
DELETE /api/conversations/:id
```

Payload:
```json
{
  "contact_id": "123",
  "title": "Conversa com Joao Silva",
  "status": "open",
  "source_channel": "whatsapp"
}
```

### C) MENSAGENS

```
POST /api/messages
GET  /api/messages/:conversation_id
```

Payload:
```json
{
  "conversation_id": "456",
  "contact_id": "123",
  "body": "Ola, tudo bem?",
  "message_type": "incoming",
  "source_channel": "whatsapp",
  "external_id": "wamid_xxxxx",
  "created_at": "2025-12-26T15:30:00Z"
}
```

### D) AUTENTICACAO

Todas as requisicoes devem enviar:
```
X-API-Key: {LOVABLE_API_KEY}
Content-Type: application/json
```

---

## COMPONENTES DA BRANCH

### 1. Adapter Lovable CRM (app/adapters/lovable-crm-adapter.js)

Camada de compatibilidade que traduz requisicoes do ZapNode para o Lovable CRM.

Metodos principais:
- `upsertContact(data)` - Criar/atualizar contato
- `upsertConversation(data)` - Criar/atualizar conversa
- `addMessage(conversationId, contactId, data)` - Adicionar mensagem
- `getMessages(conversationId)` - Recuperar mensagens
- `closeConversation(conversationId)` - Fechar conversa

### 2. Arquivo de Configuracao (.env.lovable)

Template com todas as variaveis necessarias para conectar ao Lovable.

### 3. Documentacao (docs/LOVABLE_INTEGRATION.md)

Guia completo de implementacao.

---

## COMO FUNCIONA

1. Mensagem chega no WhatsApp
   - Puppeteer detecta a mensagem

2. ZapNode processa
   - Cria/atualiza contato no Lovable
   - Cria/atualiza conversa no Lovable
   - Adiciona mensagem a conversa

3. Mensagem aparece no CRM
   - Seu time ve a mensagem no Lovable em tempo real

4. Resposta do CRM
   - Agente responde no Lovable
   - ZapNode detecta e envia para WhatsApp

---

## PRE-REQUISITOS

- [ ] Node.js 14+ instalado
- [ ] Seu Lovable CRM com backend implementado
- [ ] Endpoints da API do Lovable funcionando
- [ ] API Key do Lovable gerada
- [ ] Acesso a WhatsApp Web

---

## PROXIMO PASSO: WEBHOOK.JS

O arquivo `app/webhook.js` ainda precisa ser adaptado para usar o LovableCRMAdapter em vez de Chatwoot.

---

Desenvolvido com amor por maestroicaro
