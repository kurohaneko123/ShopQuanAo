// shop1/src/api/ghnApi.js
import axios from "axios";

const ghnApi = axios.create({
  baseURL: "http://localhost:5000/api/ghn",
  timeout: 15000,
});

export default ghnApi;
