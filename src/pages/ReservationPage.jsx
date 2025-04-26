import React, { useState, useEffect } from 'react';
import Layout from '../layouts/layout.jsx';
import ReservationService from '../api/ReservationService.js';

const ReservationPage = () => {
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      setIsLoading(true);
      const response = await ReservationService.getAll();

      // Log toàn bộ response để kiểm tra
      console.log('Full response:', response);

      // Kiểm tra và xử lý dữ liệu
      const data = response.data;
      console.log('Response data:', data);

      // Điều chỉnh để phù hợp với cấu trúc dữ liệu thực tế
      const reservationList = Array.isArray(data) ? data :
          (data.content || data.data || []);

      console.log('Reservation list:', reservationList);

      setReservations(reservationList);
      setError(null);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách đặt bàn:', error);
      setError(error.message || 'Không thể tải danh sách đặt bàn');
      setReservations([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Định dạng ngày tháng
  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa xác định';
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Render giao diện
  return (
      <Layout>
        <h2 className="text-2xl font-bold mb-4 text-amber-700">Quản lý Đặt bàn</h2>

        {/* Trạng thái tải */}
        {isLoading && (
            <div className="text-center py-4">
              <p>Đang tải danh sách đặt bàn...</p>
            </div>
        )}

        {/* Thông báo lỗi */}
        {error && (
            <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
              <p>{error}</p>
            </div>
        )}

        {/* Bảng đặt bàn */}
        {!isLoading && !error && (
            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse">
                <thead>
                <tr className="bg-amber-50 text-left">
                  <th className="border px-4 py-2">ID</th>
                  <th className="border px-4 py-2">Tên khách hàng</th>
                  <th className="border px-4 py-2">Số điện thoại</th>
                  <th className="border px-4 py-2">Thời gian</th>
                  <th className="border px-4 py-2">Số người</th>
                  <th className="border px-4 py-2">Ghi chú</th>
                  <th className="border px-4 py-2">Trạng thái</th>
                </tr>
                </thead>
                <tbody>
                {reservations.length > 0 ? (
                    reservations.map((reservation) => (
                        <tr key={reservation.id || reservation.reservationId}>
                          <td className="border px-4 py-2">{reservation.id || reservation.reservationId}</td>
                          <td className="border px-4 py-2">{reservation.guestName || reservation.customerName}</td>
                          <td className="border px-4 py-2">{reservation.guestPhone}</td>
                          <td className="border px-4 py-2">{formatDate(reservation.startTime)}</td>
                          <td className="border px-4 py-2">{reservation.numberOfPeople}</td>
                          <td className="border px-4 py-2">{reservation.notes || '-'}</td>
                          <td className="border px-4 py-2">{reservation.status || 'Chưa xác định'}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-4">
                        Không có đặt bàn nào
                      </td>
                    </tr>
                )}
                </tbody>
              </table>
            </div>
        )}
      </Layout>
  );
};

export default ReservationPage;