import { GetServiceRequestForEditDto } from "../dto/service-request.dto";
import { apiClient } from "./utils/axiosIterceptor";


export const CreateOrEditServiceRequest = async ({ id, body }: { id?: string, body: GetServiceRequestForEditDto }) => {
    if (id)
        return await apiClient.put(`requests/${id}`, body);
    return await apiClient.post("requests", body);
};



export const GetAllServiceRequests = async ({ hidden }: { hidden: boolean }) => {
    return await apiClient.get(`requests/?hidden=${hidden}`)
}


export const GetServiceRequestForEdit = async (id: string) => {
    return await apiClient.get(`requests/${id}`)
}


// block user
export const DeleteServiceRequest = async (id: string) => {
    return await apiClient.delete(`requests/${id}`)
}