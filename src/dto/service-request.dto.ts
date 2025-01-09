export type GetServiceRequestForEditDto = {
    _id?: string,
    request_id?: string,
    product: string,
    paymentMode: string,
    paymentDate: string,
    payable_amount: number,
    paid_amount: number,
    isApproved: boolean,
    approvedBy: string,
    assigned_engineer: string,
    closed_by: string,
    closed_on: string,
    happy_code: string,
    approved_on: string,
}


export type GetServiceRequestDto = {
    _id:string,
    request_id: string,
    product: string,
    paymentMode: string,
    paymentDate: string,
    payable_amount: number,
    paid_amount: number,
    isApproved: boolean,
    approvedBy: string,
    assigned_engineer: string,
    closed_by: string,
    closed_on:string,
    happy_code: string,
    approved_on: string,
    created_at: string,
    updated_at: string,
    created_by: string,
    updated_by: string
}



