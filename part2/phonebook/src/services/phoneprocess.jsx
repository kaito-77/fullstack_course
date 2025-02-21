import axios from "axios";
const baseUrl = "http://localhost:3001/persons"

const gettAll = () => {
    const req = axios.get(baseUrl)
    return req.then(response => response.data)
}

const create = (Phone) => {
    const req = axios.post(baseUrl, Phone)
    return req
}

const update = (Phone) => {
    return axios.put(`${baseUrl}/${Phone.id}`, Phone)
}

const del = (id) => {
    return axios.delete(`${baseUrl}/${id}`)
}

export default {gettAll, create, update, del}