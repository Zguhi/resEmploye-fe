import React, { useState, useEffect } from 'react';
import Layout from '../layouts/layout.jsx';
import ReservationService from '../api/ReservationService.js';

const ReservationPage = () => {
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    fetchReservations();

    // Thiết lập kiểm tra định kỳ cho các đặt bàn mới
    const checkInterval = setInterval(() => {
      checkNewReservations();
    }, 30000); // Kiểm tra mỗi 30 giây

    return () => clearInterval(checkInterval);
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

      // Đếm số đặt bàn đang chờ xác nhận
      const pendingReservations = reservationList.filter(
          reservation => reservation.status === 'Pending'
      );
      setPendingCount(pendingReservations.length);

      // Hiển thị thông báo nếu có đặt bàn chờ xác nhận
      if (pendingReservations.length > 0) {
        setShowNotification(true);
      }

      setError(null);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách đặt bàn:', error);
      setError(error.message || 'Không thể tải danh sách đặt bàn');
      setReservations([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Kiểm tra đặt bàn mới
  const checkNewReservations = async () => {
    try {
      const response = await ReservationService.getAll();

      // Xử lý dữ liệu
      const data = response.data;
      const reservationList = Array.isArray(data) ? data :
          (data.content || data.data || []);

      // Đếm số đặt bàn đang chờ xác nhận
      const pendingReservations = reservationList.filter(
          reservation => reservation.status === 'Pending'
      );

      // Kiểm tra nếu có đặt bàn mới chờ xác nhận
      if (pendingReservations.length > pendingCount) {
        setPendingCount(pendingReservations.length);
        setShowNotification(true);
      }
    } catch (error) {
      console.error('Lỗi khi kiểm tra đặt bàn mới:', error);
    }
  };

  // Xác nhận đặt bàn
  const handleConfirmReservation = async (id) => {
    try {
      setIsLoading(true);
      await ReservationService.confirmReservation(id);
      fetchReservations(); // Tải lại danh sách sau khi xác nhận
    } catch (error) {
      console.error('Lỗi khi xác nhận đặt bàn:', error);
      alert('Không thể xác nhận đặt bàn. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  // Hủy đặt bàn
  const handleCancelReservation = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy đặt bàn này?')) {
      return;
    }

    try {
      setIsLoading(true);
      await ReservationService.cancelReservation(id);
      fetchReservations(); // Tải lại danh sách sau khi hủy
    } catch (error) {
      console.error('Lỗi khi hủy đặt bàn:', error);
      alert('Không thể hủy đặt bàn. Vui lòng thử lại sau.');
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

  // Lấy class màu dựa trên trạng thái
  const getStatusClass = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Hiển thị trạng thái bằng tiếng Việt
  const getStatusDisplay = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'Đã xác nhận';
      case 'Pending':
        return 'Chờ xác nhận';
      case 'Cancelled':
        return 'Đã hủy';
      default:
        return status || 'Chưa xác định';
    }
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
            <div className="overflow-x-auto mt-4">
              <table className="w-full table-auto border-collapse">
                <thead>
                <tr className="bg-amber-50 text-left">
                  <th className="border px-4 py-2">ID</th>
                  <th className="border px-4 py-2">Tên khách hàng</th>
                  <th className="border px-4 py-2">Số điện thoại</th>
                  <th className="border px-4 py-2">Email</th>
                  <th className="border px-4 py-2">Thời gian</th>
                  <th className="border px-4 py-2">Số người</th>
                  <th className="border px-4 py-2">Ghi chú</th>
                  <th className="border px-4 py-2">Trạng thái</th>
                  <th className="border px-4 py-2">Hành động</th>
                </tr>
                </thead>
                <tbody>
                {reservations.length > 0 ? (
                    reservations.map((reservation) => (
                        <tr key={reservation.id || reservation.reservationId}>
                          <td className="border px-4 py-2">{reservation.id || reservation.reservationId}</td>
                          <td className="border px-4 py-2">{reservation.guestName || reservation.customerName}</td>
                          <td className="border px-4 py-2">{reservation.guestPhone}</td>
                          <td className="border px-4 py-2">{reservation.guestEmail || '-'}</td>
                          <td className="border px-4 py-2">{formatDate(reservation.startTime)}</td>
                          <td className="border px-4 py-2">{reservation.numberOfPeople}</td>
                          <td className="border px-4 py-2">{reservation.notes || '-'}</td>
                          <td className="border px-4 py-2">
                            <span className={`px-2 py-1 rounded-full text-xs ${getStatusClass(reservation.status)}`}>
                              {getStatusDisplay(reservation.status)}
                            </span>
                          </td>
                          <td className="border px-4 py-2">
                            <div className="flex gap-2 flex-wrap">
                              {reservation.status === 'Pending' && (
                                  <>
                                    <button
                                        onClick={() => handleConfirmReservation(reservation.id || reservation.reservationId)}
                                        className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                                    >
                                      Xác nhận
                                    </button>
                                    <button
                                        onClick={() => handleCancelReservation(reservation.id || reservation.reservationId)}
                                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                    >
                                      Hủy
                                    </button>
                                  </>
                              )}
                              {reservation.status === 'Confirmed' && (
                                  <button
                                      onClick={() => handleCancelReservation(reservation.id || reservation.reservationId)}
                                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                  >
                                    Hủy
                                  </button>
                              )}
                              {reservation.status === 'Cancelled' && (
                                  <span className="text-gray-500 text-sm">Không khả dụng</span>
                              )}
                            </div>
                          </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                      <td colSpan="9" className="text-center py-4 border">
                        Không có đặt bàn nào
                      </td>
                    </tr>
                )}
                </tbody>
              </table>
            </div>
        )}

        {/* Dialog thông báo đặt bàn mới */}
        {showNotification && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg w-96 shadow-xl">
                <h3 className="text-xl font-semibold text-amber-700 mb-3">Thông báo đặt bàn mới</h3>
                <p className="mb-5">Có {pendingCount} đặt bàn đang chờ xác nhận!</p>
                <div className="flex justify-end gap-3">
                  <button
                      onClick={() => setShowNotification(false)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                  >
                    Để sau
                  </button>
                  <button
                      onClick={() => {
                        setShowNotification(false);
                        // Không cần navigate vì đang ở trang đặt bàn rồi
                      }}
                      className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700"
                  >
                    Xem ngay
                  </button>
                </div>
              </div>
            </div>
        )}
      </Layout>
  );
};

export default ReservationPage;