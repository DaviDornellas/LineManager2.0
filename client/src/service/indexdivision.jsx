import axios from "axios";

const api2 = axios.create({
  baseURL: "http://localhost:5000/api/division",
});

export default api2;
