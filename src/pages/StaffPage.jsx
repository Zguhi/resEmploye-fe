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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [apiMode, setApiMode] = useState('mock'); // 'mock' hoặc 'api'

    const positions = ['Quản lý', 'Đầu bếp', 'Phục vụ', 'Thu ngân', 'Tiếp tân', 'Giao hàng', 'Khác'];
    const roleOptions = ['Customer', 'Restaurant', 'Admin', 'Delivery'];

    useEffect(() => {
        fetchStaff();
    }, [apiMode]);

    // Lấy danh sách nhân viên
    const fetchStaff = async () => {
        setIsLoading(true);
        setError('');

        // Sử dụng dữ liệu mẫu
        if (apiMode === 'mock') {
            console.log('Sử dụng dữ liệu mẫu');
            setTimeout(() => {
                setStaffList(getMockData());
                setIsLoading(false);
            }, 500);
            return;
        }

        // Sử dụng API thực tế
        try {
            // Kiểm tra token
            const token = localStorage.getItem('authToken');
            if (!token) {
                setError('Không tìm thấy token xác thực. Vui lòng đăng nhập lại.');
                setIsLoading(false);
                return;
            }

            console.log('Đang gọi API...');
            const response = await StaffService.getAll();
            console.log('Phản hồi API:', response);

            if (response && response.data) {
                // Xác định cấu trúc dữ liệu và lấy danh sách nhân viên
                if (Array.isArray(response.data)) {
                    setStaffList(response.data);
                } else if (response.data.content && Array.isArray(response.data.content)) {
                    setStaffList(response.data.content);
                } else if (response.data.data && Array.isArray(response.data.data)) {
                    setStaffList(response.data.data);
                } else if (response.data.data && response.data.data.content && Array.isArray(response.data.data.content)) {
                    setStaffList(response.data.data.content);
                } else {
                    console.log('Không nhận dạng được cấu trúc dữ liệu:', response.data);
                    setError('Cấu trúc dữ liệu không như mong đợi');
                    setStaffList([]);
                }
            } else {
                setError('Không có dữ liệu');
                setStaffList([]);
            }
        } catch (error) {
            console.error('Lỗi khi lấy danh sách nhân viên:', error);
            if (error.response) {
                // Có phản hồi từ server nhưng là lỗi
                if (error.response.status === 401) {
                    setError('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
                } else if (error.response.status === 404) {
                    setError('Không tìm thấy API (404). Vui lòng kiểm tra cấu hình.');
                } else {
                    setError(`Lỗi server: ${error.response.status}`);
                }
            } else if (error.request) {
                // Không có phản hồi từ server
                setError('Không nhận được phản hồi từ server. Kiểm tra kết nối mạng.');
            } else {
                // Lỗi khác
                setError(`Lỗi: ${error.message}`);
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Tạo dữ liệu mẫu
    const getMockData = () => {
        return [
            {
                user_id: 1,
                name: 'Nguyễn Văn A',
                email: 'nguyenvana@example.com',
                phone_number: '0901234567',
                address: 'Hà Nội',
                role: 'Restaurant',
                created_at: '2023-01-15'
            },
            {
                user_id: 2,
                name: 'Trần Thị B',
                email: 'tranthib@example.com',
                phone_number: '0912345678',
                address: 'TP. Hồ Chí Minh',
                role: 'Admin',
                created_at: '2023-02-20'
            },
            {
                user_id: 3,
                name: 'Lê Văn C',
                email: 'levanc@example.com',
                phone_number: '0898765432',
                address: 'Đà Nẵng',
                role: 'Delivery',
                created_at: '2023-03-10'
            },
            {
                user_id: 4,
                name: 'Phạm Thị D',
                email: 'phamthid@example.com',
                phone_number: '0976543210',
                address: 'Cần Thơ',
                role: 'Restaurant',
                created_at: '2023-04-05'
            },
            {
                user_id: 5,
                name: 'Hoàng Văn E',
                email: 'hoangvane@example.com',
                phone_number: '0923456789',
                address: 'Nha Trang',
                role: 'Restaurant',
                created_at: '2023-05-15'
            }
        ];
    };

    // Thêm nhân viên mới
    const handleAddStaff = async () => {
        if (newStaff.name.trim() === '' || newStaff.phone.trim() === '') {
            alert('Vui lòng điền đầy đủ thông tin bắt buộc (tên và số điện thoại)!');
            return;
        }

        setIsLoading(true);

        if (apiMode === 'mock') {
            // Thêm vào dữ liệu mẫu
            setTimeout(() => {
                const newId = Math.max(...staffList.map(s => s.user_id)) + 1;
                const newStaffItem = {
                    user_id: newId,
                    name: newStaff.name,
                    email: newStaff.email,
                    phone_number: newStaff.phone,
                    address: newStaff.address,
                    role: newStaff.role,
                    created_at: new Date().toISOString().split('T')[0]
                };
                setStaffList([...staffList, newStaffItem]);
                setNewStaff({
                    name: '',
                    position: '',
                    phone: '',
                    email: '',
                    address: '',
                    role: 'Restaurant'
                });
                setIsModalOpen(false);
                setIsLoading(false);
            }, 500);
            return;
        }

        try {
            const response = await StaffService.add(newStaff);
            console.log('Thêm nhân viên thành công:', response);

            // Reset form và tải lại dữ liệu
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
            alert('Không thể thêm nhân viên. ' + (err.response?.data?.message || err.message));
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

        setIsLoading(true);

        if (apiMode === 'mock') {
            // Cập nhật trong dữ liệu mẫu
            setTimeout(() => {
                const updatedList = staffList.map(staff =>
                    staff.user_id === editStaff.user_id ? editStaff : staff);
                setStaffList(updatedList);
                setEditStaff(null);
                setIsLoading(false);
            }, 500);
            return;
        }

        try {
            const response = await StaffService.update(editStaff);
            console.log('Cập nhật thành công:', response);
            setEditStaff(null);
            fetchStaff();
        } catch (err) {
            console.error('Lỗi khi cập nhật nhân viên:', err);
            alert('Không thể cập nhật nhân viên. ' + (err.response?.data?.message || err.message));
        } finally {
            setIsLoading(false);
        }
    };

    // Xóa nhân viên
    const handleDelete = async (id) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) {
            return;
        }

        setIsLoading(true);

        if (apiMode === 'mock') {
            // Xóa trong dữ liệu mẫu
            setTimeout(() => {
                setStaffList(staffList.filter(staff => staff.user_id !== id));
                setIsLoading(false);
            }, 500);
            return;
        }

        try {
            await StaffService.delete(id);
            fetchStaff();
        } catch (err) {
            console.error('Lỗi khi xóa nhân viên:', err);
            alert('Không thể xóa nhân viên. ' + (err.response?.data?.message || err.message));
        } finally {
            setIsLoading(false);
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

    // Chuyển đổi chế độ API/Mock
    const toggleApiMode = () => {
        setApiMode(apiMode === 'mock' ? 'api' : 'mock');
    };

    return (
        <Layout>
            <h2 className="text-2xl font-bold mb-4 text-amber-700">Quản lý Nhân viên</h2>

            {/* Nút chuyển đổi giữa Mock Data và API */}
            <div className="mb-4">
                <button
                    onClick={toggleApiMode}
                    className={`px-4 py-2 rounded ${apiMode === 'mock'
                        ? 'bg-blue-500 hover:bg-blue-600 text-white'
                        : 'bg-green-500 hover:bg-green-600 text-white'}`}
                >
                    {apiMode === 'mock'
                        ? 'Đang dùng dữ liệu mẫu - Click để dùng API thật'
                        : 'Đang dùng API thật - Click để dùng dữ liệu mẫu'}
                </button>
            </div>

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

            {/* Nút thêm nhân viên */}
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
                ) : (
                    <div className="text-center py-4">
                        <p>Không có dữ liệu nhân viên</p>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default StaffPage;