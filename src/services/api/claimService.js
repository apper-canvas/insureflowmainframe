import { claimData } from '@/services/mockData/claims.json'

class ClaimService {
  constructor() {
    this.claims = [...claimData]
  }

  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async getAll() {
    await this.delay()
    return [...this.claims]
  }

  async getById(id) {
    await this.delay()
    const claim = this.claims.find(c => c.id === id)
    if (!claim) {
      throw new Error('Claim not found')
    }
    return { ...claim }
  }

  async create(claimData) {
    await this.delay()
    const newId = Math.max(...this.claims.map(c => parseInt(c.id)), 0) + 1
    const newClaim = {
      ...claimData,
      id: newId.toString(),
      dateSubmitted: new Date().toISOString()
    }
    this.claims.push(newClaim)
    return { ...newClaim }
  }

  async update(id, updateData) {
    await this.delay()
    const index = this.claims.findIndex(c => c.id === id)
    if (index === -1) {
      throw new Error('Claim not found')
    }
    this.claims[index] = { ...this.claims[index], ...updateData }
    return { ...this.claims[index] }
  }

  async delete(id) {
    await this.delay()
    const index = this.claims.findIndex(c => c.id === id)
    if (index === -1) {
      throw new Error('Claim not found')
    }
    this.claims.splice(index, 1)
    return true
  }
}

export const claimService = new ClaimService()