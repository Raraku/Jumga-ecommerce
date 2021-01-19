import axios from "axios";
import { endpoint } from "./constants";

export const authAxios = axios.create({
  baseURL: endpoint,
});
if (localStorage.getItem("token") !== null) {
  authAxios.defaults.headers.common["Authorization"] =
    "Token " + localStorage.getItem("token");
}
