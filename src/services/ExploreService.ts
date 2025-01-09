import { apiClient } from "./utils/axiosIterceptor"

export const GetAllExploreItems = async () => {
    return await apiClient.get(`explore`)
}