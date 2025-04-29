// import axios from 'axios';
// import {API_BASE_URL} from "./axiosConfig.js";
//
// const API_URL = `${API_BASE_URL}/api/ingredients`;
//
// // Hàm lấy token từ localStorage (hoặc sessionStorage, hoặc state)
// // const getAuthToken = () => {
// //     return localStorage.getItem('authToken');
// // };
//
// const getAll = () => {
//     //const token = getAuthToken();
//
//     return axios.get(API_URL, {
//         withCredentials: true,
//         headers: {
//             'Accept': 'application/json',
//             'Content-Type': 'application/json'
//         }
//     });
// };
//
// const getById = (id) => {
//     //const token = getAuthToken();
//
//     return axios.get(`${API_URL}/${id}`, {
//         withCredentials: true,
//         headers: {
//             'Accept': 'application/json',
//             'Content-Type': 'application/json'
//         }
//     });
// };
//
// const add = (item) => {
//     //const token = getAuthToken();
//
//     const ingredientData = {
//         name: item.name,
//         quantity: parseFloat(item.quantity),
//         unit: item.unit
//     };
//
//     return axios.post(API_URL, ingredientData, {
//         withCredentials: true,
//         headers: {
//             'Accept': 'application/json',
//             'Content-Type': 'application/json'
//         }
//     });
// };
//
// const update = (item) => {
//     //const token = getAuthToken();
//
//     const ingredientData = {
//         ingredient_id: item.ingredient_id,
//         name: item.name,
//         quantity: parseFloat(item.quantity),
//         unit: item.unit,
//         restaurant_id: item.restaurant_id
//     };
//
//     return axios.put(`${API_URL}/${item.ingredient_id}`, ingredientData, {
//         withCredentials: true,
//         headers: {
//             'Accept': 'application/json',
//             'Content-Type': 'application/json'
//         }
//     });
// };
//
// const deleteItem = (id) => {
//     //const token = getAuthToken();
//
//     return axios.delete(`${API_URL}/${id}`, {
//         withCredentials: true,
//         headers: {
//             'Accept': 'application/json',
//             'Content-Type': 'application/json'
//         }
//     });
// };
//
// // Điều chỉnh số lượng hàng tồn kho
// const adjustQuantity = (id, quantity, reason) => {
//     //const token = getAuthToken();
//
//     return axios.put(`${API_URL}/${id}/quantity`, { quantity, reason }, {
//         withCredentials: true,
//         headers: {
//             'Accept': 'application/json',
//             'Content-Type': 'application/json'
//         }
//     });
// };
//
// // Lấy lịch sử biến động nguyên liệu
// const getIngredientLogs = (ingredientId) => {
//     //const token = getAuthToken();
//
//     return axios.get(`${API_URL}/${ingredientId}/logs`, {
//         withCredentials: true,
//         headers: {
//             'Accept': 'application/json',
//             'Content-Type': 'application/json'
//         }
//     });
// };
//
// export default {
//     getAll,
//     getById,
//     add,
//     update,
//     delete: deleteItem,
//     adjustQuantity,
//     getIngredientLogs
// };