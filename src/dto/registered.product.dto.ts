export type GetRegisteredProductForEditDto = {
    _id?: string,
    sl_no: string,
    machine: string,
    customer: string,
    warrantyUpto?: string,
    isInstalled: boolean,
    installationDate?: string,
}

export type CreateRegisteredProductFromExcelDto = {
    sl_no: string,
    machine: string,
    customer: string,
    warrantyUpto: string,
    isInstalled: string,
    installationDate: string,
    status?: string
}

export type GetRegisteredProductDto = {
    _id: string,
    sl_no: string,
    machine: string,
    machine_photo:string,
    customer: string,
    is_active: boolean,
    warrantyUpto: string,
    isInstalled: boolean,
    installationDate: string,
    created_at: string,
    updated_at: string,
    created_by: string,
    updated_by: string,
}



