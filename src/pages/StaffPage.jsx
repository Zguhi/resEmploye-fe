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
        hireDate: '',
        salary: '',
        status: 'active'
    });
    const [editStaff, setEditStaff] = useState(null);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const positions = ['Quản lý', 'Đầu bếp', 'Phục vụ', 'Thu ngân', 'Tiếp tân', 'Giao hàng', 'Khác'];
    const statusOptions = ['active', 'inactive', 'on_leave'];

    useEffect(() => {
        fetchStaff();
    }, [page]);

    // Lấy danh sách nhân viên
    const fetchStaff = async () => {
        try {
            const response = await StaffService.getAll(page, 10, 'id', 'asc');
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
                hireDate: '',
                salary: '',
                status: 'active'
            });
            fetchStaff();
            setIsModalOpen(false);
        } catch (err) {
            console.error('Lỗi khi thêm nhân viên:', err);
        }
    };

    // Cập nhật nhân viên
    const handleUpdate = async () => {
        if (!editStaff.name.trim() || !editStaff.phone.trim()) return;

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

    // Lấy trạng thái hiển thị
    const getStatusDisplay = (status) => {
        switch(status) {
            case 'active': return 'Đang làm việc';
            case 'inactive': return 'Đã nghỉ việc';
            case 'on_leave': return 'Tạm nghỉ';
            default: return status;
        }
    };

    // Lấy màu hiển thị trạng thái
    const getStatusColor = (status) => {
        switch(status) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'inactive': return 'bg-red-100 text-red-800';
            case 'on_leave': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    // Định dạng tiền lương
    const formatSalary = (salary) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(salary);
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
                                <label className="block text-sm font-medium text-gray-700">Chức vụ</label>
                                <select
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    value={newStaff.position}
                                    onChange={(e) => setNewStaff({ ...newStaff, position: e.target.value })}
                                >
                                    <option value="">-- Chọn chức vụ --</option>
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
                                <label className="block text-sm font-medium text-gray-700">Ngày vào làm</label>
                                <input
                                    type="date"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    value={newStaff.hireDate}
                                    onChange={(e) => setNewStaff({ ...newStaff, hireDate: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Lương</label>
                                <input
                                    type="number"
                                    placeholder="Lương (VNĐ)"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    value={newStaff.salary}
                                    onChange={(e) => setNewStaff({ ...newStaff, salary: e.target.value })}
                                />
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
                        <th className="border px-4 py-2">Chức vụ</th>
                        <th className="border px-4 py-2">SĐT</th>
                        <th className="border px-4 py-2">Email</th>
                        <th className="border px-4 py-2">Ngày vào làm</th>
                        <th className="border px-4 py-2">Lương</th>
                        <th className="border px-4 py-2">Trạng thái</th>
                        <th className="border px-4 py-2">Hành động</th>
                    </tr>
                    </thead>
                    <tbody>
                    {staffList.map((staff) => (
                        <tr key={staff.id}>
                            <td className="border px-4 py-2">{staff.id}</td>
                            <td className="border px-4 py-2">
                                {editStaff?.id === staff.id ? (
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
                                {editStaff?.id === staff.id ? (
                                    <select
                                        value={editStaff.position}
                                        onChange={(e) => setEditStaff({ ...editStaff, position: e.target.value })}
                                        className="border p-1 rounded w-full"
                                    >
                                        <option value="">-- Chọn chức vụ --</option>
                                        {positions.map((pos) => (
                                            <option key={pos} value={pos}>{pos}</option>
                                        ))}
                                    </select>
                                ) : (
                                    staff.position
                                )}
                            </td>
                            <td className="border px-4 py-2">
                                {editStaff?.id === staff.id ? (
                                    <input
                                        value={editStaff.phone}
                                        onChange={(e) => setEditStaff({ ...editStaff, phone: e.target.value })}
                                        className="border p-1 rounded w-full"
                                    />
                                ) : (
                                    staff.phone
                                )}
                            </td>
                            <td className="border px-4 py-2">
                                {editStaff?.id === staff.id ? (
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
                                {editStaff?.id === staff.id ? (
                                    <input
                                        type="date"
                                        value={editStaff.hireDate}
                                        onChange={(e) => setEditStaff({ ...editStaff, hireDate: e.target.value })}
                                        className="border p-1 rounded w-full"
                                    />
                                ) : (
                                    formatDate(staff.hireDate)
                                )}
                            </td>
                            <td className="border px-4 py-2">
                                {editStaff?.id === staff.id ? (
                                    <input
                                        type="number"
                                        value={editStaff.salary}
                                        onChange={(e) => setEditStaff({ ...editStaff, salary: e.target.value })}
                                        className="border p-1 rounded w-full"
                                    />
                                ) : (
                                    formatSalary(staff.salary)
                                )}
                            </td>
                            <td className="border px-4 py-2">
                                {editStaff?.id === staff.id ? (
                                    <select
                                        value={editStaff.status}
                                        onChange={(e) => setEditStaff({ ...editStaff, status: e.target.value })}
                                        className="border p-1 rounded w-full"
                                    >
                                        {statusOptions.map(status => (
                                            <option key={status} value={status}>{getStatusDisplay(status)}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(staff.status)}`}>
                      {getStatusDisplay(staff.status)}
                    </span>
                                )}
                            </td>
                            <td className="border px-4 py-2">
                                {editStaff?.id === staff.id ? (
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
                                            onClick={() => handleDelete(staff.id)}
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