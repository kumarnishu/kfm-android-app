export type GetSparePartForEditDto = {
    _id?: string,
    name: string,
    partno: string,
    price: number
}

export type AssignOrRemoveMachineToSparePartsDto = {
    machine_ids: string[],
    part_ids: string[],
    flag: number
}
export type CreateSparePartFromExcelDto = {
    name: string,
    partno: string,
    price: number,
    compatible_machines: string,
    status?: string
}

export type GetSparePartDto = {
    _id: string,
    name: string,
    partno: string,
    photo: string,
    price: number,
    compatible_machines: string,
    is_active: boolean,
    created_at: string,
    updated_at: string,
    created_by: string,
    updated_by: string
}



