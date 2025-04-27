import axios from 'axios';

const API_URL = '${API_BASE_URL}/api/reservations';

// Hàm lấy token từ localStorage
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Lấy tất cả đặt bàn
const getAll = () => {
  const token = getAuthToken();
  return axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

// Lấy đặt bàn theo ID
const getById = (id) => {
  const token = getAuthToken();

  return axios.get(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

// Thêm đặt bàn mới
const add = (reservation) => {
  const token = getAuthToken();

  // Cấu trúc dữ liệu phù hợp với ReservationRequestDto
  const reservationData = {
    userId: reservation.userId, // ID người dùng (nếu có)
    guestName: reservation.customerName || reservation.guestName,
    guestPhone: reservation.phone || reservation.guestPhone,
    guestEmail: reservation.email || reservation.guestEmail,
    numberOfPeople: reservation.guestCount || reservation.numberOfPeople,
    startTime: reservation.startTime ||
        (reservation.date && reservation.time
            ? new Date(`${reservation.date}T${reservation.time}`).toISOString()
            : null),
    notes: reservation.notes || ''
  };

  return axios.post(API_URL, reservationData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

// Cập nhật đặt bàn
const update = (reservation) => {
  const token = getAuthToken();

  const reservationData = {
    id: reservation.id || reservation.reservationId,
    guestName: reservation.customerName || reservation.guestName,
    guestPhone: reservation.phone || reservation.guestPhone,
    guestEmail: reservation.email || reservation.guestEmail,
    numberOfPeople: reservation.guestCount || reservation.numberOfPeople,
    startTime: reservation.startTime ||
        (reservation.date && reservation.time
            ? new Date(`${reservation.date}T${reservation.time}`).toISOString()
            : null),
    status: reservation.status,
    notes: reservation.notes || ''
  };

  return axios.put(`${API_URL}/${reservationData.id}`, reservationData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

// Xóa đặt bàn
const deleteReservation = (id) => {
  const token = getAuthToken();

  return axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

// Xác nhận đặt bàn
const confirmReservation = (id) => {
  const token = getAuthToken();

  return axios.put(`${API_URL}/confirm/${id}`, {}, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

// Hủy đặt bàn
const cancelReservation = (id) => {
  const token = getAuthToken();

  return axios.patch(`${API_URL}/${id}/status`, { status: 'Cancelled' }, {
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
  confirmReservation,
  cancelReservation
};