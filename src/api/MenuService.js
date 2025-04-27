import axios from 'axios';
import {API_BASE_URL} from "./axiosConfig.js";

const API_URL = `${API_BASE_URL}/api/dishes`;
const CATEGORY_URL = `${API_BASE_URL}/api/categories`;

// Hàm lấy token từ localStorage
// const getAuthToken = () => {
//     return localStorage.getItem('authToken');
// };

// Lấy tất cả các món ăn
const getAll = () => {
    // const token = getAuthToken();

    return axios.get(API_URL, {
        withCredentials: true,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
};

// Lấy tất cả danh mục
const getCategories = () => {
    //const token = getAuthToken();

    return axios.get(CATEGORY_URL, {
        withCredentials: true,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
};

// Thêm món ăn mới
const add = (dish) => {
    //const token = getAuthToken();

    // Cấu trúc dữ liệu phù hợp với DishRequest trong backend
    const dishData = {
        name: dish.name,
        description: dish.description || '',
        price: parseFloat(dish.price),
        imageUrl: dish.image_url || dish.imageUrl || '',
        categoryId: dish.category_id || dish.categoryId
    };

    return axios.post(API_URL, dishData, {
        withCredentials: true,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
};

// Cập nhật món ăn
const update = (dish) => {
    //const token = getAuthToken();

    // Cấu trúc dữ liệu phù hợp với backend
    const dishData = {
        dishId: dish.dish_id || dish.dishId,
        name: dish.name,
        description: dish.description || '',
        price: parseFloat(dish.price),
        imageUrl: dish.image_url || dish.imageUrl || '',
        categoryId: dish.category_id || dish.categoryId
    };

    return axios.put(`${API_URL}/${dishData.dishId}`, dishData, {
        withCredentials: true,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
};

// Xóa món ăn
const deleteDish = (id) => {
    //const token = getAuthToken();

    return axios.delete(`${API_URL}/${id}`, {
        withCredentials: true,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
};

export default {
    getAll,
    getCategories,
    add,
    update,
    delete: deleteDish
};