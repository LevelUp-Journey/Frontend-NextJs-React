import env from "@/lib/env";
import axios from "axios";

export const http = axios.create({
    baseURL: env.API_BASE_URL,
});
