import { toast } from 'react-toastify'

class ClientService {
  constructor() {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
    this.tableName = 'client'
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
          { field: { Name: "email" } },
          { field: { Name: "phone" } },
          { field: { Name: "address" } },
          { field: { Name: "date_joined" } },
          { field: { Name: "risk_score" } },
          { field: { Name: "notes" } }
        ],
        orderBy: [
          {
            fieldName: "Name",
            sorttype: "ASC"
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
      console.error("Error fetching clients:", error)
      toast.error("Failed to load clients")
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
          { field: { Name: "email" } },
          { field: { Name: "phone" } },
          { field: { Name: "address" } },
          { field: { Name: "date_joined" } },
          { field: { Name: "risk_score" } },
          { field: { Name: "notes" } }
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
      console.error(`Error fetching client with ID ${id}:`, error)
      toast.error("Failed to load client details")
      return null
    }
  }

  async create(clientData) {
    try {
      // Only include Updateable fields
      const updateableData = {
        Name: clientData.Name,
        Tags: clientData.Tags || "",
        Owner: clientData.Owner,
        email: clientData.email,
        phone: clientData.phone,
        address: clientData.address,
        date_joined: clientData.date_joined || new Date().toISOString(),
        risk_score: clientData.risk_score || 1,
        notes: clientData.notes || ""
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
          toast.success("Client created successfully")
          return successfulRecords[0].data
        }
      }
      
      return null
    } catch (error) {
      console.error("Error creating client:", error)
      toast.error("Failed to create client")
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
        email: updateData.email,
        phone: updateData.phone,
        address: updateData.address,
        date_joined: updateData.date_joined,
        risk_score: updateData.risk_score,
        notes: updateData.notes
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
          toast.success("Client updated successfully")
          return successfulUpdates[0].data
        }
      }
      
      return null
    } catch (error) {
      console.error("Error updating client:", error)
      toast.error("Failed to update client")
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
          toast.success("Client deleted successfully")
          return true
        }
      }
      
      return false
    } catch (error) {
      console.error("Error deleting client:", error)
      toast.error("Failed to delete client")
      return false
    }
  }
}

export const clientService = new ClientService()