import axios from "axios";

const api2 = axios.create({
  baseURL: "http://192.168.7.65:5000/api/division",
});

export default api2;
