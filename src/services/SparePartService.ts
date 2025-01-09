import { GetSparePartForEditDto } from "../dto/spare-part.dto";
import { apiClient } from "./utils/axiosIterceptor";


export const CreateOrEditSparePart = async ({ id, body }: { id?: string, body: GetSparePartForEditDto }) => {
    if (id)
        return await apiClient.put(`parts/${id}`, body);
    return await apiClient.post("parts", body);
};

export const AssignMachinesToSpareParts = async ({ body }: {
    body: {
        part_ids: string[],
        machine_ids: string[],
        flag: number
    }
}) => {
    return await apiClient.patch(`parts/machines/assign`, body)
}

export const GetAllSpareParts = async ({ hidden }: { hidden: boolean }) => {
    return await apiClient.get(`parts/?hidden=${hidden}`)
}

export const GetSparePartsForDropdown = async ({ hidden }: { hidden: boolean }) => {
    return await apiClient.get(`dropdown/parts/?hidden=${hidden}`)
}


export const GetSparePartForEdit = async (id: string) => {
    return await apiClient.get(`parts/${id}`)
}


// block user
export const ToogleBlockSparePart = async (id: string) => {
    return await apiClient.patch(`toogle-block-part/${id}`)
}



export const CreateSparePartFromExcel = async (body: FormData) => {
    return await apiClient.post("create-from-excel/parts", body);
};

export const DownloadExcelTemplateForCreateSpareParts = async () => {
    return await apiClient.get("download/template/parts");
};
export const UploadSparePartsPhoto = async ({ id, body }: { id: string, body: FormData }) => {
    return await apiClient.post(`upload/part-photos/${id}`, body);
};
