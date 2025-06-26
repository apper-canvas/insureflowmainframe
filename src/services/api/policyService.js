import { policyData } from "@/services/mockData/policies.json";
import React from "react";

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

  // Analytics methods for dashboard charts
  async getPremiumTrends() {
    await this.delay()
    const premiumsByMonth = {}
    
    this.policies.forEach(policy => {
      const date = new Date(policy.startDate)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      
      if (!premiumsByMonth[monthKey]) {
        premiumsByMonth[monthKey] = 0
      }
      premiumsByMonth[monthKey] += policy.premium
    })
    
    const sortedMonths = Object.keys(premiumsByMonth).sort()
    const trends = sortedMonths.map(month => ({
      month,
      total: premiumsByMonth[month],
      policies: this.policies.filter(p => {
        const date = new Date(p.startDate)
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        return monthKey === month
      }).length
    }))
    
    return trends
  }

  async getPolicyDurations() {
    await this.delay()
    const durationsByType = {}
    
    this.policies.forEach(policy => {
      const startDate = new Date(policy.startDate)
      const endDate = new Date(policy.endDate)
      const durationMonths = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24 * 30))
      
      if (!durationsByType[policy.type]) {
        durationsByType[policy.type] = []
      }
      durationsByType[policy.type].push(durationMonths)
    })
    
const avgDurations = Object.keys(durationsByType).map(type => ({
      type,
      avgDuration: Math.round(durationsByType[type].reduce((a, b) => a + b, 0) / durationsByType[type].length),
    }))
    
    return avgDurations.sort((a, b) => b.avgDuration - a.avgDuration)
  }
}

// Export an instance of PolicyService
export const policyService = new PolicyService()
export default policyService