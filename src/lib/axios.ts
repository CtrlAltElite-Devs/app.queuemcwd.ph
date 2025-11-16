import Axios from "axios";
import { ZustandCookieParser } from "./zustand-cookie-parser";

export const api = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const accessToken = ZustandCookieParser.parseFromBrowser();
  // console.log("token from axios: ", accessToken);

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});
