import axios from "axios";

console.log("API URL:", process.env.REACT_APP_API_URL); // Adicione este log

const servidor = axios.create({ baseURL: process.env.REACT_APP_API_URL });

servidor.interceptors.request.use((request) => {
  console.log("Requisição enviada:", request); // Adicione este log
  return request;
});

servidor.interceptors.response.use(
  (response) => {
    console.log("Resposta recebida:", response); // Adicione este log
    return response;
  },
  (error) => {
    console.error("Erro na resposta:", error.response); // Adicione este log
    return Promise.reject(error);
  }
);

export default servidor;
