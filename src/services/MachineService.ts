import { apiClient, multipartHeaders } from "./utils/axiosIterceptor";

export const CreateOrEditMachine = async ({ id, body }: { id?: string, body: FormData }) => {
    if (id)
        return await apiClient.put(`machines/${id}`, body,multipartHeaders);
    return await apiClient.post("machines", body,multipartHeaders);
};

export const GetAllMachines = async () => {
    return await apiClient.get(`machines`)
}

export const GetAllMachinesDropdown = async () => {
    return await apiClient.get(`dropdown/machines`)
}

