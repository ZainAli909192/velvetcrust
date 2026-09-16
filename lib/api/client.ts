import axios from "axios";

export const api = axios.create({
  withCredentials: true,

  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },

  timeout: 15000,
});