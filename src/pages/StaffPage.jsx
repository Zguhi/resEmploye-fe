import React, { useState, useEffect } from 'react';
import Layout from '../layouts/layout.jsx';
import StaffService from '../api/StaffService.js';

const StaffPage = () => {
    const [staffList, setStaffList] = useState([]);
    const [newStaff, setNewStaff] = useState({
        name: '',
        position: '',
        phone: '',
        email: '',
        address: '',
        role: 'Restaurant'
    });
    const [editStaff, setEditStaff] = useState(null);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const positions = ['Quản lý', 'Đầu bếp', 'Phục vụ', 'Thu ngân', 'Tiếp tân', 'Giao hàng', 'Khác'];
    const roleOptions = ['Customer', 'Restaurant', 'Admin', 'Delivery'];

    useEffect(() => {
        fetchStaff();
    }, [page]);

    // Lấy danh sách nhân viên
    const fetchStaff = async () => {
        try {
            const response = await StaffService.getAll(page, 10, 'user_id', 'asc');
            const data = response.data.data;
            setStaffList(data.content);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách nhân viên:', error);
        }
    };

    // Thêm nhân viên mới
    const handleAddStaff = async () => {
        if (newStaff.name.trim() === '' || newStaff.phone.trim() === '') {
            alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
            return;
        }

        try {
            await StaffService.add(newStaff);
            setNewStaff({
                name: '',
                position: '',
                phone: '',
                email: '',
                address: '',
                role: 'Restaurant'
            });
            fetchStaff();
            setIsModalOpen(false);
        } catch (err) {
            console.error('Lỗi khi thêm nhân viên:', err);
        }
    };

    // Cập nhật nhân viên
    const handleUpdate = async () => {
        if (!editStaff.name.trim() || !editStaff.phone_number.trim()) return;

        try {
            const response = await StaffService.update(editStaff);

            if (response.status === 200) {
                console.log('Cập nhật thành công:', response.data);
                setEditStaff(null);
                fetchStaff();
            } else {
                console.error('Cập nhật không thành công:', response);
            }
        } catch (err) {
            console.error('Lỗi khi cập nhật nhân viên:', err);
        }
    };

    // Xóa nhân viên
    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) {
            try {
                await StaffService.delete(id);
                fetchStaff();
            } catch (err) {
                console.error('Lỗi khi xóa nhân viên:', err);
            }
        }
    };

    // Chỉnh sửa nhân viên
    const handleEdit = (staff) => {
        setEditStaff({ ...staff });
    };

    // Định dạng ngày tháng
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString('vi-VN', options);
    };

    // Lấy tên vai trò hiển thị
    const getRoleDisplay = (role) => {
        switch(role) {
            case 'Customer': return 'Khách hàng';
            case 'Restaurant': return 'Nhân viên nhà hàng';
            case 'Admin': return 'Quản trị viên';
            case 'Delivery': return 'Người giao hàng';
            default: return role;
        }
    };

    return (
        <Layout>
            <h2 className="text-2xl font-bold mb-4 text-amber-700">Quản lý Nhân viên</h2>

            {/* Nút thêm nhân viên, mở Modal */}
            <button
                className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700"
                onClick={() => setIsModalOpen(true)}
            >
                Thêm Nhân viên
            </button>

            {/* Modal Thêm Nhân viên */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg w-96 max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-semibold mb-4 text-amber-700">Thêm Nhân viên mới</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Họ tên <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    placeholder="Họ tên nhân viên"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    value={newStaff.name}
                                    onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Vị trí</label>
                                <select
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    value={newStaff.position}
                                    onChange={(e) => setNewStaff({ ...newStaff, position: e.target.value })}
                                >
                                    <option value="">-- Chọn vị trí --</option>
                                    {positions.map((pos) => (
                                        <option key={pos} value={pos}>{pos}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Số điện thoại <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    placeholder="Số điện thoại"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    value={newStaff.phone}
                                    onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    value={newStaff.email}
                                    onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Địa chỉ</label>
                                <input
                                    type="text"
                                    placeholder="Địa chỉ"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    value={newStaff.address}
                                    onChange={(e) => setNewStaff({ ...newStaff, address: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Vai trò</label>
                                <select
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    value={newStaff.role}
                                    onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
                                >
                                    {roleOptions.map((role) => (
                                        <option key={role} value={role}>{getRoleDisplay(role)}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-2 justify-end mt-4">
                            <button
                                className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700"
                                onClick={handleAddStaff}
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

            {/* Bảng danh sách nhân viên */}
            <div className="mt-6 overflow-x-auto">
                <table className="w-full table-auto border-collapse">
                    <thead>
                    <tr className="bg-amber-50 text-left">
                        <th className="border px-4 py-2">ID</th>
                        <th className="border px-4 py-2">Họ tên</th>
                        <th className="border px-4 py-2">Email</th>
                        <th className="border px-4 py-2">SĐT</th>
                        <th className="border px-4 py-2">Địa chỉ</th>
                        <th className="border px-4 py-2">Vai trò</th>
                        <th className="border px-4 py-2">Ngày tạo</th>
                        <th className="border px-4 py-2">Hành động</th>
                    </tr>
                    </thead>
                    <tbody>
                    {staffList.map((staff) => (
                        <tr key={staff.user_id}>
                            <td className="border px-4 py-2">{staff.user_id}</td>
                            <td className="border px-4 py-2">
                                {editStaff?.user_id === staff.user_id ? (
                                    <input
                                        value={editStaff.name}
                                        onChange={(e) => setEditStaff({ ...editStaff, name: e.target.value })}
                                        className="border p-1 rounded w-full"
                                    />
                                ) : (
                                    staff.name
                                )}
                            </td>
                            <td className="border px-4 py-2">
                                {editStaff?.user_id === staff.user_id ? (
                                    <input
                                        type="email"
                                        value={editStaff.email}
                                        onChange={(e) => setEditStaff({ ...editStaff, email: e.target.value })}
                                        className="border p-1 rounded w-full"
                                    />
                                ) : (
                                    staff.email
                                )}
                            </td>
                            <td className="border px-4 py-2">
                                {editStaff?.user_id === staff.user_id ? (
                                    <input
                                        value={editStaff.phone_number}
                                        onChange={(e) => setEditStaff({ ...editStaff, phone_number: e.target.value })}
                                        className="border p-1 rounded w-full"
                                    />
                                ) : (
                                    staff.phone_number
                                )}
                            </td>
                            <td className="border px-4 py-2">
                                {editStaff?.user_id === staff.user_id ? (
                                    <input
                                        value={editStaff.address || ''}
                                        onChange={(e) => setEditStaff({ ...editStaff, address: e.target.value })}
                                        className="border p-1 rounded w-full"
                                    />
                                ) : (
                                    staff.address || '-'
                                )}
                            </td>
                            <td className="border px-4 py-2">
                                {editStaff?.user_id === staff.user_id ? (
                                    <select
                                        value={editStaff.role}
                                        onChange={(e) => setEditStaff({ ...editStaff, role: e.target.value })}
                                        className="border p-1 rounded w-full"
                                    >
                                        {roleOptions.map(role => (
                                            <option key={role} value={role}>{getRoleDisplay(role)}</option>
                                        ))}
                                    </select>
                                ) : (
                                    getRoleDisplay(staff.role)
                                )}
                            </td>
                            <td className="border px-4 py-2">
                                {formatDate(staff.created_at)}
                            </td>
                            <td className="border px-4 py-2">
                                {editStaff?.user_id === staff.user_id ? (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleUpdate}
                                            className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                                        >
                                            Lưu
                                        </button>
                                        <button
                                            onClick={() => setEditStaff(null)}
                                            className="bg-gray-400 text-white px-2 py-1 rounded hover:bg-gray-500"
                                        >
                                            Hủy
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(staff)}
                                            className="bg-amber-500 text-white px-2 py-1 rounded hover:bg-amber-600"
                                        >
                                            Sửa
                                        </button>
                                        <button
                                            onClick={() => handleDelete(staff.user_id)}
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
        </Layout>
    );
};

export default StaffPage;