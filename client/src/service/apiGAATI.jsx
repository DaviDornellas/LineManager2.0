import axios from "axios";

const apiPrimavera = axios.create({
  baseURL: "http://192.168.7.65:5000/api/primavera",
});

const apiCredencial = axios.create({
  baseURL: "http://192.168.7.65:5000/api/credencial",
});

const apiCompor90 = axios.create({
  baseURL: "http://192.168.7.65:5000/api/compor90",
});

export { apiPrimavera, apiCredencial, apiCompor90 };
