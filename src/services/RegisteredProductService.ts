import { GetRegisteredProductForEditDto } from "../dto/registered.product.dto";
import { apiClient } from "./utils/axiosIterceptor";



export const CreateOrEditRegisteredProduct = async ({ id, body }: { id?: string, body: GetRegisteredProductForEditDto }) => {
    if (id)
        return await apiClient.put(`products/${id}`, body);
    return await apiClient.post("products", body);
};



export const GetAllRegisteredProducts = async ({ hidden }: { hidden: boolean }) => {
    return await apiClient.get(`products/?hidden=${hidden}`)
}

export const GetRegisteredProductsForDropdown = async ({ hidden }: { hidden: boolean }) => {
    return await apiClient.get(`dropdown/products/?hidden=${hidden}`)
}


export const GetRegisteredProductForEdit = async (id: string) => {
    return await apiClient.get(`products/${id}`)
}


// block user
export const ToogleBlockRegisteredProduct = async (id: string) => {
    return await apiClient.patch(`toogle-block-product/${id}`)
}



export const CreateRegisteredProductFromExcel = async (body: FormData) => {
    return await apiClient.post("create-from-excel/products", body);
};

export const DownloadExcelTemplateForCreateRegisteredProducts = async () => {
    return await apiClient.get("download/template/products");
};