import { toast } from 'react-toastify'

class ClaimService {
  constructor() {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
    this.tableName = 'claim'
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
          { field: { Name: "policy_id" } },
          { field: { Name: "client_id" } },
          { field: { Name: "date_submitted" } },
          { field: { Name: "amount" } },
          { field: { Name: "status" } },
          { field: { Name: "description" } },
          { field: { Name: "priority" } }
        ],
        orderBy: [
          {
            fieldName: "date_submitted",
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
      console.error("Error fetching claims:", error)
      toast.error("Failed to load claims")
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
          { field: { Name: "policy_id" } },
          { field: { Name: "client_id" } },
          { field: { Name: "date_submitted" } },
          { field: { Name: "amount" } },
          { field: { Name: "status" } },
          { field: { Name: "description" } },
          { field: { Name: "priority" } }
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
      console.error(`Error fetching claim with ID ${id}:`, error)
      toast.error("Failed to load claim details")
      return null
    }
  }

  async create(claimData) {
    try {
      // Only include Updateable fields
      const updateableData = {
        Name: claimData.Name,
        Tags: claimData.Tags || "",
        Owner: claimData.Owner,
        policy_id: parseInt(claimData.policy_id),
        client_id: parseInt(claimData.client_id),
        date_submitted: claimData.date_submitted || new Date().toISOString(),
        amount: parseFloat(claimData.amount),
        status: claimData.status || "Pending",
        description: claimData.description,
        priority: claimData.priority || "Medium"
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
          toast.success("Claim created successfully")
          return successfulRecords[0].data
        }
      }
      
      return null
    } catch (error) {
      console.error("Error creating claim:", error)
      toast.error("Failed to create claim")
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
        policy_id: parseInt(updateData.policy_id),
        client_id: parseInt(updateData.client_id),
        date_submitted: updateData.date_submitted,
        amount: parseFloat(updateData.amount),
        status: updateData.status,
        description: updateData.description,
        priority: updateData.priority
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
          toast.success("Claim updated successfully")
          return successfulUpdates[0].data
        }
      }
      
      return null
    } catch (error) {
      console.error("Error updating claim:", error)
      toast.error("Failed to update claim")
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
          toast.success("Claim deleted successfully")
          return true
        }
      }
      
      return false
    } catch (error) {
      console.error("Error deleting claim:", error)
      toast.error("Failed to delete claim")
      return false
    }
  }
}

export const claimService = new ClaimService()