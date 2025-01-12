import { apiClient } from "./utils/axiosIterceptor";

export const SendOtp = async (
  body: {
    mobile: string
  }
) => {
  return await apiClient.post("sendotp", body);
};

export const CheckOtpAndLogin = async (
  body: {
    mobile: string, otp: number
  }
) => {
  return await apiClient.post("login", body);
};


export const Logout = async () => {
  return await apiClient.post("logout");
};


export const GetProfile = async () => {
  return await apiClient.get("profile");
};


