/**
 * Adapter para integração ZapNode com Lovable CRM
 * 
 * Este adapter traduz as requisições do ZapNode para o padrão de API do Lovable CRM
 * e vice-versa, criando uma camada de compatibilidade entre os dois sistemas.
 */

const axios = require('axios');
const logger = require('../utils/logger');

class LovableCRMAdapter {
  constructor(config) {
    this.baseURL = config.LOVABLE_API_URL || 'http://localhost:3000/api';
    this.apiKey = config.LOVABLE_API_KEY;
    this.timeout = config.API_TIMEOUT || 30000;

    if (!this.apiKey) {
      throw new Error('LOVABLE_API_KEY não configurada no .env');
    }

    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: this.timeout,
      headers: {
        'X-API-Key': this.apiKey,
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Criar ou atualizar contato no Lovable CRM
   * @param {Object} contactData - Dados do contato
   * @returns {Promise<Object>} Resposta com ID do contato
   */
  async upsertContact(contactData) {
    try {
      const phone = contactData.phone || contactData.wa_id;
      
      // Verificar se contato já existe
      const existingContact = await this.getContactByPhone(phone);
      
      if (existingContact) {
        // Atualizar contato existente
        return await this.updateContact(existingContact.id, {
          name: contactData.name || existingContact.name,
          custom_attributes: {
            ...existingContact.custom_attributes,
            ultimo_contato: new Date().toISOString(),
            origem: 'whatsapp'
          }
        });
      } else {
        // Criar novo contato
        return await this.createContact({
          phone,
          name: contactData.name || `WhatsApp ${phone}`,
          avatar_url: contactData.avatar_url || null,
          custom_attributes: {
            origem: 'whatsapp',
            primeiro_contato: new Date().toISOString(),
            wa_profile_name: contactData.name || 'N/A'
          }
        });
      }
    } catch (error) {
      logger.error('Erro ao upsert contato no Lovable:', error);
      throw error;
    }
  }

  /**
   * Criar novo contato
   */
  async createContact(data) {
    try {
      const response = await this.client.post('/contacts', data);
      logger.info(`Contato criado: ${response.data.id}`);
      return response.data;
    } catch (error) {
      logger.error('Erro ao criar contato:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Obter contato pelo número de telefone
   */
  async getContactByPhone(phone) {
    try {
      const response = await this.client.get(`/contacts/${phone}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return null;
      }
      logger.error('Erro ao buscar contato:', error.message);
      throw error;
    }
  }

  /**
   * Atualizar contato
   */
  async updateContact(contactId, data) {
    try {
      const response = await this.client.put(`/contacts/${contactId}`, data);
      logger.info(`Contato atualizado: ${contactId}`);
      return response.data;
    } catch (error) {
      logger.error('Erro ao atualizar contato:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Criar ou atualizar conversão
   */
  async upsertConversation(conversationData) {
    try {
      const contact = await this.getContactByPhone(conversationData.phone);
      
      if (!contact) {
        throw new Error(`Contato não encontrado: ${conversationData.phone}`);
      }

      // Verificar se conversa já existe
      const existingConversation = await this.getConversationByContact(contact.id);
      
      if (existingConversation) {
        // Atualizar conversa existente
        return await this.updateConversation(existingConversation.id, {
          status: conversationData.status || 'open',
          updated_at: new Date().toISOString()
        });
      } else {
        // Criar nova conversa
        return await this.createConversation({
          contact_id: contact.id,
          title: conversationData.title || `Conversa com ${contact.name}`,
          status: conversationData.status || 'open',
          source_channel: 'whatsapp'
        });
      }
    } catch (error) {
      logger.error('Erro ao upsert conversa:', error);
      throw error;
    }
  }

  /**
   * Criar nova conversa
   */
  async createConversation(data) {
    try {
      const response = await this.client.post('/conversations', data);
      logger.info(`Conversa criada: ${response.data.id}`);
      return response.data;
    } catch (error) {
      logger.error('Erro ao criar conversa:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Obter conversa pelo contato
   */
  async getConversationByContact(contactId) {
    try {
      const response = await this.client.get(`/conversations/${contactId}`);
      // Retorna a primeira conversa ativa
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data[0];
      }
      return null;
    } catch (error) {
      if (error.response?.status === 404) {
        return null;
      }
      logger.error('Erro ao buscar conversa:', error.message);
      throw error;
    }
  }

  /**
   * Atualizar conversa
   */
  async updateConversation(conversationId, data) {
    try {
      const response = await this.client.put(`/conversations/${conversationId}`, data);
      logger.info(`Conversa atualizada: ${conversationId}`);
      return response.data;
    } catch (error) {
      logger.error('Erro ao atualizar conversa:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Adicionar mensagem à conversa
   */
  async addMessage(conversationId, contactId, messageData) {
    try {
      const payload = {
        conversation_id: conversationId,
        contact_id: contactId,
        body: messageData.body || messageData.text,
        message_type: messageData.direction === 'inbound' ? 'incoming' : 'outgoing',
        source_channel: 'whatsapp',
        external_id: messageData.message_id || messageData.wamid,
        created_at: messageData.timestamp || new Date().toISOString()
      };

      const response = await this.client.post('/messages', payload);
      logger.info(`Mensagem adicionada à conversa: ${conversationId}`);
      return response.data;
    } catch (error) {
      logger.error('Erro ao adicionar mensagem:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Obter mensagens de uma conversa
   */
  async getMessages(conversationId) {
    try {
      const response = await this.client.get(`/messages/${conversationId}`);
      return response.data;
    } catch (error) {
      logger.error('Erro ao obter mensagens:', error.message);
      throw error;
    }
  }

  /**
   * Fechar conversa
   */
  async closeConversation(conversationId) {
    try {
      return await this.updateConversation(conversationId, {
        status: 'closed',
        closed_at: new Date().toISOString()
      });
    } catch (error) {
      logger.error('Erro ao fechar conversa:', error);
      throw error;
    }
  }
}

module.exports = LovableCRMAdapter;
