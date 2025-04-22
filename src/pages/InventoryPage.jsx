import React, { useState, useEffect } from 'react';
import Layout from '../layouts/layout.jsx';
import InventoryService from '../api/InventoryService.js';

const InventoryPage = () => {
    const [inventory, setInventory] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [itemLogs, setItemLogs] = useState([]);
    const [newItem, setNewItem] = useState({
        name: '',
        quantity: '',
        unit: '',
    });
    const [editItem, setEditItem] = useState(null);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLogModalOpen, setIsLogModalOpen] = useState(false);
    const [adjustQuantity, setAdjustQuantity] = useState({
        id: null,
        quantity: '',
        reason: '',
    });
    const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);

    const units = ['kg', 'g', 'l', 'ml', 'cái', 'thùng', 'bao', 'chai', 'lon'];

    useEffect(() => {
        fetchInventory();
    }, [page]);

    // Lấy danh sách nguyên liệu
    const fetchInventory = async () => {
        try {
            const response = await InventoryService.getAll(page, 10, 'ingredient_id', 'asc');
            const data = response.data.data;
            setInventory(data.content);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách nguyên liệu:', error);
        }
    };

    // Lấy lịch sử biến động nguyên liệu
    const fetchItemLogs = async (id) => {
        try {
            const response = await InventoryService.getIngredientLogs(id);
            setItemLogs(response.data.data);
        } catch (error) {
            console.error('Lỗi khi lấy lịch sử nguyên liệu:', error);
        }
    };

    // Xem lịch sử nguyên liệu
    const handleViewLogs = async (item) => {
        setSelectedItem(item);
        await fetchItemLogs(item.ingredient_id);
        setIsLogModalOpen(true);
    };

    // Thêm nguyên liệu mới
    const handleAddItem = async () => {
        if (newItem.name.trim() === '' || !newItem.quantity || !newItem.unit) {
            alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
            return;
        }

        try {
            const user = JSON.parse(localStorage.getItem('user'));
            await InventoryService.add({
                ...newItem,
                restaurant_id: user.user_id
            });
            setNewItem({
                name: '',
                quantity: '',
                unit: '',
            });
            fetchInventory();
            setIsModalOpen(false);
        } catch (err) {
            console.error('Lỗi khi thêm nguyên liệu:', err);
        }
    };

    // Cập nhật nguyên liệu
    const handleUpdate = async () => {
        if (!editItem.name.trim() || editItem.quantity === '' || !editItem.unit) {
            alert('Vui lòng điền đầy đủ thông tin!');
            return;
        }

        try {
            const response = await InventoryService.update(editItem);

            if (response.status === 200) {
                console.log('Cập nhật thành công:', response.data);
                setEditItem(null);
                fetchInventory();
            } else {
                console.error('Cập nhật không thành công:', response);
            }
        } catch (err) {
            console.error('Lỗi khi cập nhật nguyên liệu:', err);
        }
    };

    // Xóa nguyên liệu
    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa nguyên liệu này?')) {
            try {
                await InventoryService.delete(id);
                fetchInventory();
            } catch (err) {
                console.error('Lỗi khi xóa nguyên liệu:', err);
            }
        }
    };

    // Mở modal điều chỉnh số lượng
    const handleOpenAdjustModal = (item) => {
        setAdjustQuantity({
            id: item.ingredient_id,
            quantity: '',
            reason: '',
        });
        setIsAdjustModalOpen(true);
    };

    // Điều chỉnh số lượng nguyên liệu
    const handleAdjustQuantity = async () => {
        if (adjustQuantity.quantity === '' || !adjustQuantity.reason.trim()) {
            alert('Vui lòng điền đầy đủ thông tin!');
            return;
        }

        try {
            await InventoryService.adjustQuantity(
                adjustQuantity.id,
                parseFloat(adjustQuantity.quantity),
                adjustQuantity.reason
            );
            setIsAdjustModalOpen(false);
            fetchInventory();
        } catch (err) {
            console.error('Lỗi khi điều chỉnh số lượng:', err);
        }
    };

    // Chỉnh sửa nguyên liệu
    const handleEdit = (item) => {
        setEditItem({ ...item });
    };

    // Định dạng ngày tháng
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('vi-VN', options);
    };

    return (
        <Layout>
            <h2 className="text-2xl font-bold mb-4 text-amber-700">Quản lý Kho Nguyên liệu</h2>

            {/* Nút thêm nguyên liệu, mở Modal */}
            <button
                className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700"
                onClick={() => setIsModalOpen(true)}
            >
                Thêm Nguyên liệu
            </button>

            {/* Modal Thêm Nguyên liệu */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h3 className="text-xl font-semibold mb-4 text-amber-700">Thêm Nguyên liệu mới</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Tên nguyên liệu <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    placeholder="Tên nguyên liệu"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    value={newItem.name}
                                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Số lượng <span className="text-red-500">*</span></label>
                                <input
                                    type="number"
                                    placeholder="Số lượng"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    value={newItem.quantity}
                                    onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Đơn vị <span className="text-red-500">*</span></label>
                                <select
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    value={newItem.unit}
                                    onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                                >
                                    <option value="">-- Chọn đơn vị --</option>
                                    {units.map((unit) => (
                                        <option key={unit} value={unit}>{unit}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-2 justify-end mt-4">
                            <button
                                className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700"
                                onClick={handleAddItem}
                            >
                                Thêm
                            </button>
                            <button
                                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Bảng danh sách nguyên liệu */}
            <div className="mt-6 overflow-x-auto">
                <table className="w-full table-auto border-collapse">
                    <thead>
                    <tr className="bg-amber-50 text-left">
                        <th className="border px-4 py-2">ID</th>
                        <th className="border px-4 py-2">Tên nguyên liệu</th>
                        <th className="border px-4 py-2">Số lượng</th>
                        <th className="border px-4 py-2">Đơn vị</th>
                        <th className="border px-4 py-2">Cập nhật lần cuối</th>
                        <th className="border px-4 py-2">Hành động</th>
                    </tr>
                    </thead>
                    <tbody>
                    {inventory.map((item) => (
                        <tr key={item.ingredient_id}>
                            <td className="border px-4 py-2">{item.ingredient_id}</td>
                            <td className="border px-4 py-2">
                                {editItem?.ingredient_id === item.ingredient_id ? (
                                    <input
                                        value={editItem.name}
                                        onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
                                        className="border p-1 rounded w-full"
                                    />
                                ) : (
                                    item.name
                                )}
                            </td>
                            <td className="border px-4 py-2">
                                {editItem?.ingredient_id === item.ingredient_id ? (
                                    <input
                                        type="number"
                                        value={editItem.quantity}
                                        onChange={(e) => setEditItem({ ...editItem, quantity: e.target.value })}
                                        className="border p-1 rounded w-full"
                                    />
                                ) : (
                                    item.quantity
                                )}
                            </td>
                            <td className="border px-4 py-2">
                                {editItem?.ingredient_id === item.ingredient_id ? (
                                    <select
                                        value={editItem.unit}
                                        onChange={(e) => setEditItem({ ...editItem, unit: e.target.value })}
                                        className="border p-1 rounded w-full"
                                    >
                                        {units.map(unit => (
                                            <option key={unit} value={unit}>{unit}</option>
                                        ))}
                                    </select>
                                ) : (
                                    item.unit
                                )}
                            </td>
                            <td className="border px-4 py-2">
                                {formatDate(item.updated_at)}
                            </td>
                            <td className="border px-4 py-2">
                                {editItem?.ingredient_id === item.ingredient_id ? (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleUpdate}
                                            className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                                        >
                                            Lưu
                                        </button>
                                        <button
                                            onClick={() => setEditItem(null)}
                                            className="bg-gray-400 text-white px-2 py-1 rounded hover:bg-gray-500"
                                        >
                                            Hủy
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex gap-2 flex-wrap">
                                        <button
                                            onClick={() => handleEdit(item)}
                                            className="bg-amber-500 text-white px-2 py-1 rounded hover:bg-amber-600"
                                        >
                                            Sửa
                                        </button>
                                        <button
                                            onClick={() => handleOpenAdjustModal(item)}
                                            className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                                        >
                                            Điều chỉnh
                                        </button>
                                        <button
                                            onClick={() => handleViewLogs(item)}
                                            className="bg-purple-500 text-white px-2 py-1 rounded hover:bg-purple-600"
                                        >
                                            Lịch sử
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.ingredient_id)}
                                            className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                                        >
                                            Xóa
                                        </button>
                                    </div>
                                )}
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

            {/* Modal Điều chỉnh số lượng */}
            {isAdjustModalOpen && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h3 className="text-xl font-semibold mb-4 text-amber-700">Điều chỉnh Số lượng</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Số lượng thay đổi <span className="text-red-500">*</span></label>
                                <input
                                    type="number"
                                    placeholder="Nhập số dương để thêm, số âm để giảm"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    value={adjustQuantity.quantity}
                                    onChange={(e) => setAdjustQuantity({ ...adjustQuantity, quantity: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Lý do <span className="text-red-500">*</span></label>
                                <textarea
                                    placeholder="Lý do thay đổi"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    value={adjustQuantity.reason}
                                    onChange={(e) => setAdjustQuantity({ ...adjustQuantity, reason: e.target.value })}
                                    rows="3"
                                />
                            </div>
                        </div>

                        <div className="flex gap-2 justify-end mt-4">
                            <button
                                className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700"
                                onClick={handleAdjustQuantity}
                            >
                                Lưu
                            </button>
                            <button
                                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                                onClick={() => setIsAdjustModalOpen(false)}
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Lịch sử nguyên liệu */}
            {isLogModalOpen && selectedItem && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold text-amber-700">Lịch sử biến động: {selectedItem.name}</h3>
                            <button
                                onClick={() => setIsLogModalOpen(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>

                        <table className="w-full table-auto border-collapse">
                            <thead>
                            <tr className="bg-gray-50 text-left">
                                <th className="border px-4 py-2">ID</th>
                                <th className="border px-4 py-2">Số lượng thay đổi</th>
                                <th className="border px-4 py-2">Loại</th>
                                <th className="border px-4 py-2">Mô tả</th>
                                <th className="border px-4 py-2">Thời gian</th>
                            </tr>
                            </thead>
                            <tbody>
                            {itemLogs.map((log) => (
                                <tr key={log.log_id}>
                                    <td className="border px-4 py-2">{log.log_id}</td>
                                    <td className="border px-4 py-2">{log.change_amount}</td>
                                    <td className="border px-4 py-2">
                                            <span className={`px-2 py-1 rounded-full text-xs ${log.log_type === 'Import' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {log.log_type === 'Import' ? 'Nhập kho' : 'Xuất kho'}
                                            </span>
                                    </td>
                                    <td className="border px-4 py-2">{log.description}</td>
                                    <td className="border px-4 py-2">{formatDate(log.created_at)}</td>
                                </tr>
                            ))}
                            {itemLogs.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="border px-4 py-2 text-center">Không có dữ liệu</td>
                                </tr>
                            )}
                            </tbody>
                        </table>

                        <div className="flex justify-end mt-6">
                            <button
                                onClick={() => setIsLogModalOpen(false)}
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

export default InventoryPage;