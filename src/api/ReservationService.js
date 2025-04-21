import axios from 'axios';

const API_URL = 'http://192.168.1.179:8088/api/reservations';

// Hàm lấy token từ localStorage (hoặc sessionStorage, hoặc state)
const getAuthToken = () => {
  return localStorage.getItem('authToken');  // Hoặc bạn có thể thay đổi nơi lưu trữ token của bạn
};

const getAll = (page = 0, limit = 10, sortBy = 'id', order = 'asc') => {
  const token = getAuthToken();  // Lấy token từ nơi lưu trữ

  return axios.get(API_URL, {
    params: {
      page,
      limit,
      sortBy,
      order
    },
    headers: {
      Authorization: `Bearer ${token}`  // Thêm token vào header
    }
  });
};

const getById = (id) => {
  const token = getAuthToken();

  return axios.get(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

const add = (reservation) => {
  const token = getAuthToken();  // Lấy token từ nơi lưu trữ

  return axios.post(API_URL, reservation, {
    headers: {
      Authorization: `Bearer ${token}`  // Thêm token vào header
    }
  });
};

const update = (reservation) => {
  const token = getAuthToken();  // Lấy token từ nơi lưu trữ

  return axios.put(`${API_URL}/${reservation.id}`, reservation, {
    headers: {
      Authorization: `Bearer ${token}`  // Thêm token vào header
    }
  });
};

const deleteReservation = (id) => {
  const token = getAuthToken();  // Lấy token từ nơi lưu trữ

  return axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`  // Thêm token vào header
    }
  });
};

// Lấy đặt bàn theo ngày
const getByDate = (date) => {
  const token = getAuthToken();

  return axios.get(`${API_URL}/date/${date}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

// Xác nhận đặt bàn
const confirmReservation = (id) => {
  const token = getAuthToken();

  return axios.put(`${API_URL}/${id}/confirm`, {}, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

// Hủy đặt bàn
const cancelReservation = (id) => {
  const token = getAuthToken();

  return axios.put(`${API_URL}/${id}/cancel`, {}, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export default {
  getAll,
  getById,
  add,
  update,
  delete: deleteReservation,
  getByDate,
  confirmReservation,
  cancelReservation
};