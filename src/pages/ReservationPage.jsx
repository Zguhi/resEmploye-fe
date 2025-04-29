import React, { useState, useEffect } from 'react';
import Layout from '../layouts/layout.jsx';
import ReservationService from '../api/ReservationService.js';
import axios from 'axios';
import { API_BASE_URL } from '../api/axiosConfig.js';

const ReservationPage = () => {
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTableSelection, setShowTableSelection] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [tables, setTables] = useState([]);
  const [selectedTableId, setSelectedTableId] = useState(null);
  const [loadingTables, setLoadingTables] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [tableInfo, setTableInfo] = useState({});
  const [detailedError, setDetailedError] = useState(null);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      setIsLoading(true);
      const response = await ReservationService.getAll();
      const data = response.data;
      const reservationList = Array.isArray(data) ? data :
          (data.content || data.data || []);

      console.log('Danh sách đặt bàn:', reservationList);

      // Tạo một mảng các ID đặt bàn đã xác nhận để lấy thông tin bàn
      const confirmedReservations = reservationList.filter(res => res.status === 'Confirmed');
      const reservationIds = confirmedReservations.map(res => res.id || res.reservationId);

      if (reservationIds.length > 0) {
        await fetchTablesForReservations(reservationIds);
      }

      setReservations(reservationList);
      setError(null);
      setDetailedError(null);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách đặt bàn:', error);
      setError(error.message || 'Không thể tải danh sách đặt bàn');
      setDetailedError(error.response ? JSON.stringify(error.response.data, null, 2) : null);
      setReservations([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTablesForReservations = async (reservationIds) => {
    try {
      const tableInfoMap = {};

      for (const reservationId of reservationIds) {
        try {
          const response = await axios.get(`${API_BASE_URL}/api/reservations/${reservationId}/table`, {
            withCredentials: true,
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          });

          console.log(`Thông tin bàn cho đặt bàn ${reservationId}:`, response.data);

          if (response.data) {
            tableInfoMap[reservationId] = response.data;
          }
        } catch (err) {
          console.error(`Chi tiết lỗi cho đặt bàn ${reservationId}:`,
              err.response ? JSON.stringify(err.response.data, null, 2) : err.message
          );
        }
      }

      setTableInfo(tableInfoMap);
      console.log('Bảng thông tin bàn:', tableInfoMap);
    } catch (error) {
      console.error('Lỗi khi lấy thông tin bàn:', error);
    }
  };

  const fetchAvailableTables = async (reservationTime, numberOfGuests) => {
    try {
      setLoadingTables(true);
      const startTime = new Date(reservationTime).toISOString();
      const response = await axios.get(`${API_BASE_URL}/api/tables/status/available`, {
        params: {
          startTime,
          guestCount: numberOfGuests
        },
        withCredentials: true,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      const data = response.data;
      const tableList = Array.isArray(data) ? data :
          (data.content || data.data || []);
      setTables(tableList);
      console.log('Danh sách bàn khả dụng:', tableList);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách bàn khả dụng:', error);
      setTables([]);
      setDetailedError(error.response ? JSON.stringify(error.response.data, null, 2) : null);
      alert('Không thể lấy danh sách bàn khả dụng. Vui lòng thử lại sau.');
    } finally {
      setLoadingTables(false);
    }
  };

  const handleOpenTableSelection = (reservation) => {
    setSelectedReservation(reservation);
    setSelectedTableId(null);
    fetchAvailableTables(
        reservation.startTime,
        reservation.numberOfGuests
    );
    setShowTableSelection(true);
  };

  const handleConfirmReservation = async (reservation) => {
    if (!reservation.numberOfGuests || reservation.numberOfGuests <= 0) {
      setShowNotification(true);
      return;
    }
    handleOpenTableSelection(reservation);
  };

  const handleConfirmWithTable = async () => {
    if (!selectedTableId) {
      alert('Vui lòng chọn bàn trước khi xác nhận');
      return;
    }

    try {
      setIsLoading(true);
      const reservationId = selectedReservation.id || selectedReservation.reservationId;
      await axios.put(`${API_BASE_URL}/api/reservations/${reservationId}/confirm`, {
        tableId: selectedTableId
      }, {
        withCredentials: true,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      // Cập nhật thông tin bàn trong state
      const tableData = tables.find(t => (t.id || t.tableId) === selectedTableId);
      if (tableData) {
        setTableInfo(prev => ({
          ...prev,
          [reservationId]: tableData
        }));
      }

      setShowTableSelection(false);
      await fetchReservations();
    } catch (error) {
      console.error('Lỗi khi xác nhận đặt bàn:', error);
      setDetailedError(error.response ? JSON.stringify(error.response.data, null, 2) : null);
      alert('Không thể xác nhận đặt bàn. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelReservation = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy đặt bàn này?')) {
      return;
    }

    try {
      setIsLoading(true);
      await ReservationService.cancelReservation(id);
      // Xóa thông tin bàn khi hủy đặt bàn
      if (tableInfo[id]) {
        setTableInfo(prev => {
          const newTableInfo = {...prev};
          delete newTableInfo[id];
          return newTableInfo;
        });
      }
      fetchReservations();
    } catch (error) {
      console.error('Lỗi khi hủy đặt bàn:', error);
      setDetailedError(error.response ? JSON.stringify(error.response.data, null, 2) : null);
      alert('Không thể hủy đặt bàn. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

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

  // Lấy thông tin bàn dựa trên ID đặt bàn
  const getTableForReservation = (reservationId) => {
    return tableInfo[reservationId];
  };

  // Hàm trợ giúp render thông tin bàn
  const renderTableInfo = (reservation) => {
    if (!reservation) return 'Chưa có thông tin bàn';

    // Truy cập tableNumber từ đối tượng table của reservation
    const tableNumber = reservation.table?.tableNumber ||
        reservation.table?.table_number ||
        'Chưa xác định';

    return `Bàn ${tableNumber}`;
  };

  return (
      <Layout>
        <h2 className="text-2xl font-bold mb-4 text-amber-700">Quản lý Đặt bàn</h2>

        {/* Hiển thị lỗi chi tiết nếu có */}
        {detailedError && (
            <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
              <p>Lỗi chi tiết:</p>
              <pre className="text-xs overflow-x-auto">{detailedError}</pre>
            </div>
        )}

        {isLoading && (
            <div className="text-center py-4">
              <p>Đang tải danh sách đặt bàn...</p>
            </div>
        )}

        {error && (
            <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
              <p>{error}</p>
            </div>
        )}

        {!isLoading && !error && (
            <div className="overflow-x-auto mt-4">
              <table className="w-full table-auto border-collapse">
                <thead>
                <tr className="bg-amber-50 text-left">
                  <th className="border px-4 py-2">ID</th>
                  <th className="border px-4 py-2">Tên khách hàng</th>
                  <th className="border px-4 py-2">Số điện thoại</th>
                  <th className="border px-4 py-2">Thời gian</th>
                  <th className="border px-4 py-2">Số người</th>
                  <th className="border px-4 py-2">Bàn</th>
                  <th className="border px-4 py-2">Ghi chú</th>
                  <th className="border px-4 py-2">Trạng thái</th>
                  <th className="border px-4 py-2">Hành động</th>
                </tr>
                </thead>
                <tbody>
                {reservations.length > 0 ? (
                    reservations.map((reservation) => {
                      const reservationId = reservation.id || reservation.reservationId;
                      //const table = getTableForReservation(reservationId);

                      return (
                          <tr key={reservationId}>
                            <td className="border px-4 py-2">{reservationId}</td>
                            <td className="border px-4 py-2">{reservation.guestName || reservation.customerName}</td>
                            <td className="border px-4 py-2">{reservation.guestPhone}</td>
                            <td className="border px-4 py-2">{formatDate(reservation.startTime)}</td>
                            <td className="border px-4 py-2">{reservation.numberOfGuests || '-'}</td>
                            <td className="border px-4 py-2">
                              {reservation.status === 'Confirmed'
                                  ? renderTableInfo(reservation)
                                  : '-'}
                            </td>
                            <td className="border px-4 py-2">{reservation.notes || '-'}</td>
                            <td className="border px-4 py-2">
                              <span className={`px-2 py-1 rounded-full text-xs ${getStatusClass(reservation.status)}`}>
                                {getStatusDisplay(reservation.status)}
                              </span>
                            </td>
                            <td className="border px-4 py-2">
                              <div className="flex gap-2 justify-center">
                                {reservation.status === 'Pending' && (
                                    <>
                                      <button
                                          onClick={() => handleOpenTableSelection(reservation)}
                                          className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                                      >
                                        Xác nhận
                                      </button>
                                      <button
                                          onClick={() => handleCancelReservation(reservationId)}
                                          className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                                      >
                                        Hủy
                                      </button>
                                    </>
                                )}
                                {reservation.status === 'Confirmed' && (
                                    <button
                                        onClick={() => handleCancelReservation(reservationId)}
                                        className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                                    >
                                      Hủy
                                    </button>
                                )}
                              </div>
                            </td>
                          </tr>
                      );
                    })
                ) : (
                    <tr>
                      <td colSpan="10" className="text-center py-4 border">
                        Không có đặt bàn nào
                      </td>
                    </tr>
                )}
                </tbody>
              </table>
            </div>
        )}

        {/* Modal chọn bàn */}
        {showTableSelection && selectedReservation && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg w-4/5 max-w-4xl max-h-[90vh] overflow-y-auto">
                <h3 className="text-xl font-semibold text-amber-700 mb-3">Chọn bàn cho đặt chỗ</h3>
                <div className="mb-4">
                  <p><span className="font-semibold">Khách hàng:</span> {selectedReservation.guestName || selectedReservation.customerName}</p>
                  <p><span className="font-semibold">Thời gian:</span> {formatDate(selectedReservation.startTime)}</p>
                  <p><span className="font-semibold">Số người:</span> {selectedReservation.numberOfGuests}</p>
                </div>

                {loadingTables ? (
                    <div className="text-center py-4">
                      <p>Đang tải danh sách bàn...</p>
                    </div>
                ) : tables.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {tables.map((table) => (
                          <div
                              key={table.id || table.tableId}
                              className={`border p-4 rounded-lg cursor-pointer transition-colors 
                                            ${selectedTableId === (table.id || table.tableId)
                                  ? 'bg-amber-100 border-amber-500'
                                  : 'hover:bg-gray-100'}`}
                              onClick={() => setSelectedTableId(table.id || table.tableId)}
                          >
                            <h4 className="font-bold">Bàn số {table.table_number || table.tableNumber || table.id || table.tableId}</h4>
                            <p>Sức chứa: {table.capacity} người</p>
                            {table.location && <p>Vị trí: {table.location}</p>}
                          </div>
                      ))}
                    </div>
                ) : (
                    <div className="text-center py-4 text-red-500">
                      <p>Không có bàn khả dụng phù hợp với số lượng người.</p>
                    </div>
                )}

                <div className="flex justify-end gap-3 mt-6">
                  <button
                      onClick={() => setShowTableSelection(false)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                  >
                    Hủy
                  </button>
                  <button
                      onClick={handleConfirmWithTable}
                      disabled={!selectedTableId || loadingTables}
                      className={`px-4 py-2 rounded ${!selectedTableId || loadingTables
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-amber-600 text-white hover:bg-amber-700'}`}
                  >
                    Xác nhận đặt bàn
                  </button>
                </div>
              </div>
            </div>
        )}

        {/* Modal thông báo */}
        {showNotification && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
                <h3 className="text-xl font-semibold text-amber-700 mb-4">
                  Thông báo
                </h3>
                <p className="mb-6">Bàn chưa có số lượng khách</p>
                <div className="flex justify-end">
                  <button
                      onClick={() => setShowNotification(false)}
                      className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
        )}
      </Layout>
  );
};

export default ReservationPage;