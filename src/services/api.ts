import axios, { AxiosInstance } from 'axios';

const api: AxiosInstance = axios.create({
    baseURL: "https://deckofcardsapi.com/api/deck/",
});

export default api;