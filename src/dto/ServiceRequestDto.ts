    import { DropDownDto } from "./DropDownDto"
import { GetRegisteredProductDto } from "./RegisteredProducDto"

    export type GetProblemDto = {
        _id: string,
        problem: string,
        product:GetRegisteredProductDto
        service:GetServiceRequestDto
        videos: string[],
        photos: string[]
        created_at: string,
        updated_at: string,
        created_by: DropDownDto,
        updated_by: DropDownDto
    }

    export type GetSolutionDto = {
        _id: string,
        product:GetRegisteredProductDto
        service:GetServiceRequestDto
        solution: string,
        videos: string[],
        photos: string[]
        created_at: string,
        updated_at: string,
        created_by: DropDownDto,
        updated_by: DropDownDto
    }

    export type CreateOrEditSolutionDto = {
        request?: string,
        product: string
        solution: string,
        videos?: string[],
        photos?: string[]
    }
    export type CloseServiceRequestDto={
        code:string,
        paymentMode: string,
        paymentDate: Date,
        payable_amount: number,
        paid_amount: number

    }
    export type CreateOrEditProblemDto = {
        request?: string,
        product: string
        problem: string,
        videos?: string[],
        photos?: string[]
    }



    export type GetServiceRequestDto = {
        _id: string,
        request_id: string,
        product: DropDownDto,
        paymentMode: string,
        paymentDate: string,
        payable_amount: number,
        paid_amount: number,
        isApproved: boolean,
        approvedBy: DropDownDto,
        assigned_engineer: DropDownDto,
        closed_by: DropDownDto,
        closed_on: string,
        happy_code: string,
        approved_on: string,
        created_at: string,
        updated_at: string,
        created_by: DropDownDto,
        updated_by: DropDownDto
    }



