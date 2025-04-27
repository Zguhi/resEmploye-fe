import axios from 'axios';
//import {API_BASE_URL} from "./axiosConfig.js";

const API_URL = `https://included-sturgeon-cool.ngrok-free.app/api/dishes`;
const CATEGORY_URL = 'https://included-sturgeon-cool.ngrok-free.app/api/categories';

// Hàm lấy token từ localStorage
const getAuthToken = () => {
    return localStorage.getItem('authToken');
};

// Lấy tất cả các món ăn
const getAll = (page = 0, size = 10, sortBy = 'dishId', sortDir = 'asc') => {
    // const token = getAuthToken();

    return axios.get(API_URL, {
        params: { page, size, sortBy, sortDir },
        // headers: {
        //     Authorization: `Bearer ${token}`
        // }
    });
};

// Lấy tất cả danh mục
const getCategories = () => {
    const token = getAuthToken();

    return axios.get(CATEGORY_URL, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

// Thêm món ăn mới
const add = (dish) => {
    const token = getAuthToken();

    // Cấu trúc dữ liệu phù hợp với DishRequest trong backend
    const dishData = {
        name: dish.name,
        description: dish.description || '',
        price: parseFloat(dish.price),
        imageUrl: dish.image_url || dish.imageUrl || '',
        categoryId: dish.category_id || dish.categoryId
    };

    return axios.post(API_URL, dishData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

// Cập nhật món ăn
const update = (dish) => {
    const token = getAuthToken();

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
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

// Xóa món ăn
const deleteDish = (id) => {
    const token = getAuthToken();

    return axios.delete(`${API_URL}/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
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