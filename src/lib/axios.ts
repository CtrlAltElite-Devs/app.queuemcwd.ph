import Axios from "axios";

export const api = Axios.create({
  baseURL: "https://niggalicious.com",
  withCredentials: true,
});
