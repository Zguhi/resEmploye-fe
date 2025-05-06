import React, { useState, useEffect } from 'react';
import Layout from '../layouts/layout.jsx';
import BillsService from '../api/BillsService.js';

const BillsPage = () => {
    const [bills, setBills] = useState([]);
    const [selectedBill, setSelectedBill] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [revenueData, setRevenueData] = useState(null);

    useEffect(() => {
        fetchBills();
    }, []);

    // Lấy danh sách hóa đơn
    const fetchBills = async () => {
        try {
            const response = await BillsService.getAll();
            if (Array.isArray(response.data)) {
                setBills(response.data);
            } else {
                console.error('Dữ liệu trả về không phải là mảng:', response.data);
                setBills([]);
            }
        } catch (error) {
            console.error('Lỗi khi lấy danh sách hóa đơn:', error);
            setBills([]);
        }
    };

    // Xem chi tiết hóa đơn
    const handleViewDetails = (bill) => {
        setSelectedBill(bill);
        setIsModalOpen(true);
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
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString('vi-VN', options);
    };

    // Định dạng tiền
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    // Lấy trạng thái hiển thị
    const getStatusDisplay = (status) => {
        switch (status) {
            case 'Completed':
                return 'Hoàn thành';
            default:
                return status;
        }
    };

    // Lấy màu hiển thị trạng thái
    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
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
                            <p className="text-2xl font-bold text-blue-800">
                                {formatCurrency(revenueData.totalRevenue)}
                            </p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                            <p className="text-sm text-green-700">Số hóa đơn</p>
                            <p className="text-2xl font-bold text-green-800">
                                {revenueData.totalBills}
                            </p>
                        </div>
                        <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                            <p className="text-sm text-amber-700">Trung bình mỗi hóa đơn</p>
                            <p className="text-2xl font-bold text-amber-800">
                                {formatCurrency(revenueData.averageBill)}
                            </p>
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
                        <th className="border px-4 py-2">Tổng tiền</th>
                        <th className="border px-4 py-2">Ghi chú</th>
                        <th className="border px-4 py-2 w-32">Trạng thái</th>
                        <th className="border px-4 py-2">Phương thức thanh toán</th>
                        <th className="border px-4 py-2">Ngày tạo</th>
                        <th className="border px-4 py-2">Ngày thanh toán</th>
                        <th className="border px-4 py-2">Hành động</th>
                    </tr>
                    </thead>
                    <tbody>
                    {bills.map((bill) => (
                        <tr key={bill.orderId}>
                            <td className="border px-4 py-2">{bill.orderId}</td>
                            <td className="border px-4 py-2 font-semibold">
                                {formatCurrency(bill.totalPrice)}
                            </td>
                            <td className="border px-4 py-2">{bill.note || '-'}</td>
                            <td className="border px-4 py-2">
                                    <span className={`px-2 py-1 rounded-full text-xs whitespace-nowrap ${getStatusColor(bill.orderStatus)}`}>
                                        {getStatusDisplay(bill.orderStatus)}
                                    </span>
                            </td>
                            <td className="border px-4 py-2">{bill.paymentMethod}</td>
                            <td className="border px-4 py-2">{formatDate(bill.createdAt)}</td>
                            <td className="border px-4 py-2">{formatDate(bill.paidAt)}</td>
                            <td className="border px-4 py-2">
                                <button
                                    onClick={() => handleViewDetails(bill)}
                                    className="bg-amber-500 text-white px-2 py-1 rounded hover:bg-amber-600"
                                >
                                    Chi tiết
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Modal Chi tiết hóa đơn */}
            {isModalOpen && selectedBill && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold text-amber-700">
                                Chi tiết hóa đơn #{selectedBill.orderId}
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div>
                                <p className="text-sm text-gray-600">Trạng thái:</p>
                                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(selectedBill.orderStatus)}`}>
                                    {getStatusDisplay(selectedBill.orderStatus)}
                                </span>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Phương thức thanh toán:</p>
                                <p className="font-medium">{selectedBill.paymentMethod}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Ngày tạo:</p>
                                <p className="font-medium">{formatDate(selectedBill.createdAt)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Ngày thanh toán:</p>
                                <p className="font-medium">{formatDate(selectedBill.paidAt)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Ghi chú:</p>
                                <p className="font-medium">{selectedBill.note || '-'}</p>
                            </div>
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
                            {selectedBill.items.map((item, index) => (
                                <tr key={index}>
                                    <td className="border px-4 py-2">{index + 1}</td>
                                    <td className="border px-4 py-2">{item.dishName}</td>
                                    <td className="border px-4 py-2">{item.quantity}</td>
                                    <td className="border px-4 py-2">
                                        {formatCurrency(item.price)}
                                    </td>
                                    <td className="border px-4 py-2">
                                        {formatCurrency(item.total)}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>

                        <div className="flex justify-end">
                            <div className="w-48">
                                <div className="flex justify-between py-2 border-t font-bold">
                                    <span>Tổng cộng:</span>
                                    <span>{formatCurrency(selectedBill.totalPrice)}</span>
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