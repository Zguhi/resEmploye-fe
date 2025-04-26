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
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const positions = ['Quản lý', 'Đầu bếp', 'Phục vụ', 'Thu ngân', 'Tiếp tân', 'Giao hàng', 'Khác'];
    const roleOptions = ['Customer', 'Restaurant', 'Admin', 'Delivery'];

    useEffect(() => {
        fetchStaff();
    }, [page]);

    // Lấy danh sách nhân viên
    const fetchStaff = async () => {
        setIsLoading(true);
        setError('');
        try {
            // Kiểm tra token trước khi gọi API
            const token = localStorage.getItem('authToken');
            if (!token) {
                setError('Không tìm thấy token xác thực. Vui lòng đăng nhập lại.');
                setIsLoading(false);
                return;
            }

            const response = await StaffService.getAll(page, 10, 'user_id', 'asc');

            // Kiểm tra dữ liệu trả về
            if (response && response.data) {
                // Điều chỉnh theo cấu trúc phản hồi API thực tế
                if (response.data.data) {
                    // Nếu API trả về dạng {data: {content: [...], totalPages: X}}
                    setStaffList(response.data.data.content || []);
                    setTotalPages(response.data.data.totalPages || 1);
                } else if (Array.isArray(response.data)) {
                    // Nếu API trả về trực tiếp một mảng
                    setStaffList(response.data);
                    setTotalPages(Math.ceil(response.data.length / 10));
                } else {
                    // Trường hợp khác
                    console.log('Cấu trúc dữ liệu phản hồi:', response.data);
                    setStaffList([]);
                    setError('Cấu trúc dữ liệu không như mong đợi');
                }
            } else {
                setStaffList([]);
            }
        } catch (error) {
            console.error('Lỗi khi lấy danh sách nhân viên:', error);
            setError('Không thể tải dữ liệu nhân viên. Vui lòng kiểm tra kết nối mạng và API.');

            // Kiểm tra lỗi cụ thể
            if (error.response) {
                // Lỗi từ server
                if (error.response.status === 401) {
                    setError('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
                } else if (error.response.status === 404) {
                    setError('Không tìm thấy API. Vui lòng kiểm tra cấu hình.');
                }
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Thêm nhân viên mới
    const handleAddStaff = async () => {
        if (newStaff.name.trim() === '' || newStaff.phone.trim() === '') {
            alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
            return;
        }

        try {
            setIsLoading(true);
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
            alert('Không thể thêm nhân viên. ' + (err.response?.data?.message || 'Lỗi không xác định'));
        } finally {
            setIsLoading(false);
        }
    };

    // Cập nhật nhân viên
    const handleUpdate = async () => {
        if (!editStaff?.name?.trim() || !editStaff?.phone_number?.trim()) {
            alert('Tên và số điện thoại không được để trống');
            return;
        }

        try {
            setIsLoading(true);
            const response = await StaffService.update(editStaff);

            if (response.status === 200) {
                console.log('Cập nhật thành công:', response.data);
                setEditStaff(null);
                fetchStaff();
            } else {
                console.error('Cập nhật không thành công:', response);
                alert('Cập nhật không thành công');
            }
        } catch (err) {
            console.error('Lỗi khi cập nhật nhân viên:', err);
            alert('Không thể cập nhật nhân viên. ' + (err.response?.data?.message || 'Lỗi không xác định'));
        } finally {
            setIsLoading(false);
        }
    };

    // Xóa nhân viên
    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) {
            try {
                setIsLoading(true);
                await StaffService.delete(id);
                fetchStaff();
            } catch (err) {
                console.error('Lỗi khi xóa nhân viên:', err);
                alert('Không thể xóa nhân viên. ' + (err.response?.data?.message || 'Lỗi không xác định'));
            } finally {
                setIsLoading(false);
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

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    <p>{error}</p>
                    <button
                        className="ml-2 underline"
                        onClick={fetchStaff}
                    >
                        Thử lại
                    </button>
                </div>
            )}

            {/* Nút thêm nhân viên, mở Modal */}
            <button
                className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700 disabled:opacity-50"
                onClick={() => setIsModalOpen(true)}
                disabled={isLoading}
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
                                className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700 disabled:opacity-50"
                                onClick={handleAddStaff}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Đang xử lý...' : 'Thêm'}
                            </button>
                            <button
                                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                                onClick={() => setIsModalOpen(false)}
                                disabled={isLoading}
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Bảng danh sách nhân viên */}
            <div className="mt-6 overflow-x-auto">
                {isLoading ? (
                    <div className="text-center py-4">
                        <p>Đang tải dữ liệu...</p>
                    </div>
                ) : staffList.length > 0 ? (
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
                                            value={editStaff.email || ''}
                                            onChange={(e) => setEditStaff({ ...editStaff, email: e.target.value })}
                                            className="border p-1 rounded w-full"
                                        />
                                    ) : (
                                        staff.email || '-'
                                    )}
                                </td>
                                <td className="border px-4 py-2">
                                    {editStaff?.user_id === staff.user_id ? (
                                        <input
                                            value={editStaff.phone_number || ''}
                                            onChange={(e) => setEditStaff({ ...editStaff, phone_number: e.target.value })}
                                            className="border p-1 rounded w-full"
                                        />
                                    ) : (
                                        staff.phone_number || '-'
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
                                            value={editStaff.role || 'Restaurant'}
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
                                                className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 disabled:opacity-50"
                                                disabled={isLoading}
                                            >
                                                {isLoading ? '...' : 'Lưu'}
                                            </button>
                                            <button
                                                onClick={() => setEditStaff(null)}
                                                className="bg-gray-400 text-white px-2 py-1 rounded hover:bg-gray-500"
                                                disabled={isLoading}
                                            >
                                                Hủy
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(staff)}
                                                className="bg-amber-500 text-white px-2 py-1 rounded hover:bg-amber-600"
                                                disabled={isLoading}
                                            >
                                                Sửa
                                            </button>
                                            <button
                                                onClick={() => handleDelete(staff.user_id)}
                                                className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 disabled:opacity-50"
                                                disabled={isLoading}
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
                ) : !error ? (
                    <div className="text-center py-4">
                        <p>Không có dữ liệu nhân viên</p>
                    </div>
                ) : null}
            </div>

            {/* Phân trang */}
            {totalPages > 1 && staffList.length > 0 && (
                <div className="flex justify-center mt-4 gap-2">
                    <button
                        onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                        disabled={page === 0 || isLoading}
                        className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
                    >
                        Trước
                    </button>
                    <span className="px-3 py-1">
                        {page + 1} / {totalPages}
                    </span>
                    <button
                        onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
                        disabled={page + 1 >= totalPages || isLoading}
                        className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
                    >
                        Sau
                    </button>
                </div>
            )}
        </Layout>
    );
};

export default StaffPage;