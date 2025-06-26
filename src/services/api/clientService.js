import { clientData } from '@/services/mockData/clients.json'

class ClientService {
  constructor() {
    this.clients = [...clientData]
  }

  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async getAll() {
    await this.delay()
    return [...this.clients]
  }

  async getById(id) {
    await this.delay()
    const client = this.clients.find(c => c.id === id)
    if (!client) {
      throw new Error('Client not found')
    }
    return { ...client }
  }

  async create(clientData) {
    await this.delay()
    const newId = Math.max(...this.clients.map(c => parseInt(c.id)), 0) + 1
    const newClient = {
      ...clientData,
      id: newId.toString(),
      dateJoined: new Date().toISOString()
    }
    this.clients.push(newClient)
    return { ...newClient }
  }

  async update(id, updateData) {
    await this.delay()
    const index = this.clients.findIndex(c => c.id === id)
    if (index === -1) {
      throw new Error('Client not found')
    }
    this.clients[index] = { ...this.clients[index], ...updateData }
    return { ...this.clients[index] }
  }

  async delete(id) {
    await this.delay()
    const index = this.clients.findIndex(c => c.id === id)
    if (index === -1) {
      throw new Error('Client not found')
    }
    this.clients.splice(index, 1)
    return true
  }
}

export const clientService = new ClientService()