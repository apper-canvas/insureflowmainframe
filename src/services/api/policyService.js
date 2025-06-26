import { toast } from 'react-toastify'

class PolicyService {
  constructor() {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
    this.tableName = 'policy'
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } },
          { field: { Name: "client_id" } },
          { field: { Name: "type" } },
          { field: { Name: "policy_number" } },
          { field: { Name: "premium" } },
          { field: { Name: "start_date" } },
          { field: { Name: "end_date" } },
          { field: { Name: "status" } },
          { field: { Name: "coverage" } }
        ],
        orderBy: [
          {
            fieldName: "start_date",
            sorttype: "DESC"
          }
        ]
      }
      
      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }
      
      return response.data || []
    } catch (error) {
      console.error("Error fetching policies:", error)
      toast.error("Failed to load policies")
      return []
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } },
          { field: { Name: "client_id" } },
          { field: { Name: "type" } },
          { field: { Name: "policy_number" } },
          { field: { Name: "premium" } },
          { field: { Name: "start_date" } },
          { field: { Name: "end_date" } },
          { field: { Name: "status" } },
          { field: { Name: "coverage" } }
        ]
      }
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }
      
      return response.data
    } catch (error) {
      console.error(`Error fetching policy with ID ${id}:`, error)
      toast.error("Failed to load policy details")
      return null
    }
  }

  async create(policyData) {
    try {
      // Only include Updateable fields
      const updateableData = {
        Name: policyData.Name,
        Tags: policyData.Tags || "",
        Owner: policyData.Owner,
        client_id: parseInt(policyData.client_id),
        type: policyData.type,
        policy_number: policyData.policy_number,
        premium: parseFloat(policyData.premium),
        start_date: policyData.start_date,
        end_date: policyData.end_date,
        status: policyData.status || "Active",
        coverage: parseFloat(policyData.coverage)
      }
      
      const params = {
        records: [updateableData]
      }
      
      const response = await this.apperClient.createRecord(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`)
            })
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successfulRecords.length > 0) {
          toast.success("Policy created successfully")
          return successfulRecords[0].data
        }
      }
      
      return null
    } catch (error) {
      console.error("Error creating policy:", error)
      toast.error("Failed to create policy")
      return null
    }
  }

  async update(id, updateData) {
    try {
      // Only include Updateable fields
      const updateableFields = {
        Id: parseInt(id),
        Name: updateData.Name,
        Tags: updateData.Tags,
        Owner: updateData.Owner,
        client_id: parseInt(updateData.client_id),
        type: updateData.type,
        policy_number: updateData.policy_number,
        premium: parseFloat(updateData.premium),
        start_date: updateData.start_date,
        end_date: updateData.end_date,
        status: updateData.status,
        coverage: parseFloat(updateData.coverage)
      }
      
      const params = {
        records: [updateableFields]
      }
      
      const response = await this.apperClient.updateRecord(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success)
        const failedUpdates = response.results.filter(result => !result.success)
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`)
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`)
            })
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successfulUpdates.length > 0) {
          toast.success("Policy updated successfully")
          return successfulUpdates[0].data
        }
      }
      
      return null
    } catch (error) {
      console.error("Error updating policy:", error)
      toast.error("Failed to update policy")
      return null
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      }
      
      const response = await this.apperClient.deleteRecord(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return false
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success)
        const failedDeletions = response.results.filter(result => !result.success)
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`)
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successfulDeletions.length > 0) {
          toast.success("Policy deleted successfully")
          return true
        }
      }
      
      return false
    } catch (error) {
      console.error("Error deleting policy:", error)
      toast.error("Failed to delete policy")
      return false
    }
  }

  // Analytics methods for dashboard charts
  async getPremiumTrends() {
    try {
      const policies = await this.getAll()
      const premiumsByMonth = {}
      
      policies.forEach(policy => {
        const date = new Date(policy.start_date)
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
        policies: policies.filter(p => {
          const date = new Date(p.start_date)
          const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
          return monthKey === month
        }).length
      }))
      
      return trends
    } catch (error) {
      console.error("Error getting premium trends:", error)
      return []
    }
  }

  async getPolicyDurations() {
    try {
      const policies = await this.getAll()
      const durationsByType = {}
      
      policies.forEach(policy => {
        const startDate = new Date(policy.start_date)
        const endDate = new Date(policy.end_date)
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
    } catch (error) {
      console.error("Error getting policy durations:", error)
      return []
    }
  }
}

// Export an instance of PolicyService
export const policyService = new PolicyService()
export default policyService