import { policyData } from '@/services/mockData/policies.json'

class PolicyService {
  constructor() {
    this.policies = [...policyData]
  }

  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async getAll() {
    await this.delay()
    return [...this.policies]
  }

  async getById(id) {
    await this.delay()
    const policy = this.policies.find(p => p.id === id)
    if (!policy) {
      throw new Error('Policy not found')
    }
    return { ...policy }
  }

  async create(policyData) {
    await this.delay()
    const newId = Math.max(...this.policies.map(p => parseInt(p.id)), 0) + 1
    const newPolicy = {
      ...policyData,
      id: newId.toString()
    }
    this.policies.push(newPolicy)
    return { ...newPolicy }
  }

  async update(id, updateData) {
    await this.delay()
    const index = this.policies.findIndex(p => p.id === id)
    if (index === -1) {
      throw new Error('Policy not found')
    }
    this.policies[index] = { ...this.policies[index], ...updateData }
    return { ...this.policies[index] }
  }

  async delete(id) {
    await this.delay()
    const index = this.policies.findIndex(p => p.id === id)
    if (index === -1) {
      throw new Error('Policy not found')
    }
    this.policies.splice(index, 1)
    return true
  }
}

export const policyService = new PolicyService()