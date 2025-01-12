import { DropDownDto } from "./DropDownDto"

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
    created_by: DropDownDto,
    updated_by: DropDownDto
}

export type CreateOrEditCustomerDto = {
    name: string,
    address: string,
    gst: string,
    pincode: number,
    email: string,
    mobile: string,
}

