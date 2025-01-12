import { AssignOrRemoveMachineToSparePartsDto } from "../dto/SparePartDto";
import { apiClient, multipartHeaders } from "./utils/axiosIterceptor";

export const GetAllSpareParts = async () => {
    return await apiClient.get(`parts`)
}

export const CreateOrEditSparePart = async ({ id, body }: { id?: string, body: FormData }) => {
    if (id)
        return await apiClient.put(`parts/${id}`, body,multipartHeaders);
    return await apiClient.post("parts", body,multipartHeaders);
};

export const GetSparePartsForDropdown = async () => {
    return await apiClient.get(`dropdown/parts`)
}

export const AssignMachinesToSpareParts = async ({ body }: {
    body: AssignOrRemoveMachineToSparePartsDto
}) => {
    return await apiClient.patch(`parts/machines/assign`, body)
}

