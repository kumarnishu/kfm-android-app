export type RegisterAsCustomerDto = {
    name: string,
    mobile: string,
    email: string,
    gst: string,
    pincode: number,
    address: string,
}

export type CreateStaffDto = {
    customer:string,
    username:string,
    mobile: string,
    email?: string
}

export type GetCustomerDto = {
    _id: string,
    name: string,
    address: string,
    gst: string,
    pincode: number,
    email: string,
    mobile: string,
    users: number,
    is_active: boolean,
    created_at: string,
    updated_at: string,
    created_by: string,
    updated_by: string
}


export type GetUserDto = {
    _id: string,
    username:string,
    mobile: string,
    email: string,
    dp: string,
    is_active:boolean,
    customer: string,
    role: string,//admin,engineer,owner,staff
    mobile_verified: boolean,
    email_verified: boolean,
    created_at: string,
    updated_at: string,
    created_by: string,
    updated_by: string
}



export type LoginDto = {
    mobile: string,
}

export type SendOrVerifyEmailDto = {
    email: string
}
