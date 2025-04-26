import React, { useState, useEffect } from 'react';
import Layout from '../layouts/layout.jsx';
import BillsService from '../api/BillsService.js';

const BillsPage = () => {
    const [bills, setBills] = useState([]);
    const [selectedBill, setSelectedBill] = useState(null);
    const [billDetails, setBillDetails] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [revenueData, setRevenueData] = useState(null);

    const statusOptions = ['Pending', 'Preparing', 'Delivering', 'Completed', 'Cancelled'];

    useEffect(() => {
        fetchBills();
    }, [page]);

    // Lấy danh sách hóa đơn
    const fetchBills = async () => {
        try {
            const response = await BillsService.getAll(page, 10, 'order_id', 'desc');
            const data = response.data.data;
            setBills(data.content);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách hóa đơn:', error);
        }
    };

    // Lấy chi tiết hóa đơn
    const fetchBillDetails = async (id) => {
        try {
            const response = await BillsService.getBillDetails(id);
            setBillDetails(response.data.data);
        } catch (error) {
            console.error('Lỗi khi lấy chi tiết hóa đơn:', error);
        }
    };

    // Xem chi tiết hóa đơn
    const handleViewDetails = async (bill) => {
        setSelectedBill(bill);
        await fetchBillDetails(bill.order_id);
        setIsModalOpen(true);
    };

    // Cập nhật trạng thái hóa đơn
    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            await BillsService.updateStatus(orderId, newStatus);
            // Cập nhật danh sách hóa đơn sau khi thay đổi trạng thái
            fetchBills();
        } catch (error) {
            console.error('Lỗi khi cập nhật trạng thái hóa đơn:', error);
        }
    };

    // Lấy doanh thu theo khoảng thời gian
    const handleGetRevenue = async () => {
        if (!startDate || !endDate) {
            alert('Vui lòng chọn khoảng thời gian!');
            return;
        }

        try {
            const response = await BillsService.getRevenue(startDate, endDate);
            setRevenueData(response.data.data);
        } catch (error) {
            console.error('Lỗi khi lấy doanh thu:', error);
        }
    };

    // Định dạng ngày tháng
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('vi-VN', options);
    };

    // Định dạng tiền
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    // Lấy trạng thái hiển thị
    const getStatusDisplay = (status) => {
        switch(status) {
            case 'Completed': return 'Hoàn thành';
            case 'Pending': return 'Chờ thanh toán';
            case 'Preparing': return 'Đang chuẩn bị';
            case 'Delivering': return 'Đang giao hàng';
            case 'Cancelled': return 'Đã hủy';
            default: return status;
        }
    };

    // Lấy màu hiển thị trạng thái
    const getStatusColor = (status) => {
        switch(status) {
            case 'Completed': return 'bg-green-100 text-green-800';
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'Preparing': return 'bg-blue-100 text-blue-800';
            case 'Delivering': return 'bg-indigo-100 text-indigo-800';
            case 'Cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    // Lấy thông tin khách hàng
    const getCustomerInfo = (userId) => {
        // Trong thực tế, bạn có thể cần gọi API để lấy thông tin khách hàng
        // Hoặc cải thiện API để trả về thông tin khách hàng cùng với thông tin đơn hàng
        return (userId);
    };

    return (
        <Layout>
            <h2 className="text-2xl font-bold mb-4 text-amber-700">Quản lý Hóa đơn</h2>

            {/* Thống kê doanh thu */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                <h3 className="text-lg font-semibold mb-3">Thống kê doanh thu</h3>
                <div className="flex flex-wrap gap-4 items-end">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Từ ngày</label>
                        <input
                            type="date"
                            className="mt-1 block border border-gray-300 rounded-md shadow-sm p-2"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Đến ngày</label>
                        <input
                            type="date"
                            className="mt-1 block border border-gray-300 rounded-md shadow-sm p-2"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                    <button
                        className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700"
                        onClick={handleGetRevenue}
                    >
                        Xem doanh thu
                    </button>
                </div>

                {revenueData && (
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                            <p className="text-sm text-blue-700">Tổng doanh thu</p>
                            <p className="text-2xl font-bold text-blue-800">{formatCurrency(revenueData.totalRevenue)}</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                            <p className="text-sm text-green-700">Số hóa đơn</p>
                            <p className="text-2xl font-bold text-green-800">{revenueData.totalBills}</p>
                        </div>
                        <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                            <p className="text-sm text-amber-700">Trung bình mỗi hóa đơn</p>
                            <p className="text-2xl font-bold text-amber-800">{formatCurrency(revenueData.averageBill)}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Bảng danh sách hóa đơn */}
            <div className="overflow-x-auto">
                <table className="w-full table-auto border-collapse">
                    <thead>
                    <tr className="bg-amber-50 text-left">
                        <th className="border px-4 py-2">ID</th>
                        <th className="border px-4 py-2">Ngày giờ</th>
                        <th className="border px-4 py-2">Khách hàng</th>
                        <th className="border px-4 py-2">Địa chỉ giao hàng</th>
                        <th className="border px-4 py-2">Tổng tiền</th>
                        <th className="border px-4 py-2">Trạng thái</th>
                        <th className="border px-4 py-2">Hành động</th>
                    </tr>
                    </thead>
                    <tbody>
                    {bills.map((bill) => (
                        <tr key={bill.order_id}>
                            <td className="border px-4 py-2">{bill.order_id}</td>
                            <td className="border px-4 py-2">{formatDate(bill.created_at)}</td>
                            <td className="border px-4 py-2">{getCustomerInfo(bill.user_id)}</td>
                            <td className="border px-4 py-2">{bill.delivery_address || '-'}</td>
                            <td className="border px-4 py-2 font-semibold">{formatCurrency(bill.total_price)}</td>
                            <td className="border px-4 py-2">
                              <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(bill.order_status)}`}>
                                {getStatusDisplay(bill.order_status)}
                              </span>
                            </td>
                            <td className="border px-4 py-2">
                                <div className="flex gap-2 flex-wrap">
                                    <button
                                        onClick={() => handleViewDetails(bill)}
                                        className="bg-amber-500 text-white px-2 py-1 rounded hover:bg-amber-600"
                                    >
                                        Chi tiết
                                    </button>

                                    <select
                                        className="border border-gray-300 rounded px-2 py-1 text-sm"
                                        value={bill.order_status}
                                        onChange={(e) => handleUpdateStatus(bill.order_id, e.target.value)}
                                    >
                                        {statusOptions.map(status => (
                                            <option key={status} value={status}>
                                                {getStatusDisplay(status)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Phân trang */}
            <div className="flex justify-center mt-4 gap-2">
                <button
                    onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                    disabled={page === 0}
                    className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
                >
                    Trước
                </button>
                <span className="px-3 py-1">
                  {page + 1} / {totalPages}
                </span>
                <button
                    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
                    disabled={page + 1 >= totalPages}
                    className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
                >
                    Sau
                </button>
            </div>

            {/* Modal Chi tiết hóa đơn */}
            {isModalOpen && selectedBill && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold text-amber-700">Chi tiết hóa đơn #{selectedBill.order_id}</h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div>
                                <p className="text-sm text-gray-600">Khách hàng:</p>
                                <p className="font-medium">{getCustomerInfo(selectedBill.user_id)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Ngày giờ:</p>
                                <p className="font-medium">{formatDate(selectedBill.created_at)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Trạng thái:</p>
                                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(selectedBill.order_status)}`}>
                                  {getStatusDisplay(selectedBill.order_status)}
                                </span>
                            </div>
                            {selectedBill.delivery_address && (
                                <div>
                                    <p className="text-sm text-gray-600">Địa chỉ giao hàng:</p>
                                    <p className="font-medium">{selectedBill.delivery_address}</p>
                                </div>
                            )}
                        </div>

                        <h4 className="font-semibold mb-2">Danh sách món ăn</h4>
                        <table className="w-full table-auto border-collapse mb-4">
                            <thead>
                            <tr className="bg-gray-50 text-left">
                                <th className="border px-4 py-2">STT</th>
                                <th className="border px-4 py-2">Tên món</th>
                                <th className="border px-4 py-2">Số lượng</th>
                                <th className="border px-4 py-2">Đơn giá</th>
                                <th className="border px-4 py-2">Thành tiền</th>
                            </tr>
                            </thead>
                            <tbody>
                            {billDetails.map((item, index) => (
                                <tr key={item.order_item_id}>
                                    <td className="border px-4 py-2">{index + 1}</td>
                                    <td className="border px-4 py-2">{item.dish_name || `Món #${item.dish_id}`}</td>
                                    <td className="border px-4 py-2">{item.quantity}</td>
                                    <td className="border px-4 py-2">{formatCurrency(item.price)}</td>
                                    <td className="border px-4 py-2">{formatCurrency(item.quantity * item.price)}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>

                        <div className="flex justify-end">
                            <div className="w-48">
                                <div className="flex justify-between py-2 border-t font-bold">
                                    <span>Tổng cộng:</span>
                                    <span>{formatCurrency(selectedBill.total_price)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end mt-6">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
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

export default BillsPage;