import axios from "axios";

export const api = axios.create({
    baseURL: 'https://raw.githubusercontent.com/nitaicharan/Rocketseat-E5TRJSFE1/master/server.json'
});

