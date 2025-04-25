import axios from 'axios';

const API_URL = 'http://192.168.1.81:8080/api/dishes';

// Hàm lấy token từ localStorage (hoặc sessionStorage, hoặc state)
const getAuthToken = () => {
    return localStorage.getItem('authToken');  // Hoặc bạn có thể thay đổi nơi lưu trữ token của bạn
};

const getAll = () => {
    const token = getAuthToken();  // Lấy token từ nơi lưu trữ

    return axios.get(API_URL, {

        headers: {
            Authorization: `Bearer ${token}`  // Thêm token vào header
        }
    });
};

const getCategories = () => {
    const token = getAuthToken();
    return axios.get(`http://192.168.1.81:8080/api/categories`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

const add = (dish) => {
    const token = getAuthToken();
    console.log(dish);
    // Đảm bảo format của dữ liệu phù hợp với API
    const dishData = {
        name: dish.name,
        description: dish.description,
        price: parseFloat(dish.price),
        category_id: dish.category_id || null,
        restaurant_id: dish.restaurant_id || null,
        image_url: dish.image_url || null
    };

    return axios.post(API_URL, dishData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

const update = (dish) => {
    const token = getAuthToken();

    // Đảm bảo format của dữ liệu phù hợp với API
    const dishData = {
        dish_id: dish.dish_id || dish.id,
        name: dish.name,
        description: dish.description,
        price: parseFloat(dish.price),
        category_id: dish.category_id,
        restaurant_id: dish.restaurant_id,
        image_url: dish.image_url
    };

    return axios.put(`${API_URL}/${dishData.dish_id}`, dishData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

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
