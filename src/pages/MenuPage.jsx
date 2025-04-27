import React, { useState, useEffect } from 'react';
import Layout from '../layouts/layout.jsx';
import MenuService from '../api/MenuService.js';

const MenuPage = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [newMenuItem, setNewMenuItem] = useState({
        name: '',
        price: '',
        category_id: '',
        description: '',
        image_url: ''
    });
    const [editMenuItem, setEditMenuItem] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchMenuItems();
    }, []);

    // Lấy danh sách món ăn
    const fetchMenuItems = async () => {
        try {
            setIsLoading(true);
            const response = await MenuService.getAll();

            // Dữ liệu API của bạn trả về mảng món ăn trực tiếp trong response.data
            if (response.data && Array.isArray(response.data)) {
                // Ánh xạ dữ liệu để phù hợp với cấu trúc cần thiết cho component
                const mappedItems = response.data.map(item => ({
                    dish_id: item.dishId,
                    name: item.name,
                    description: item.description,
                    price: item.price,
                    category_id: item.category.categoryId,
                    image_url: item.imageUrl,
                    created_at: item.createdAt
                }));

                setMenuItems(mappedItems);

                // Thay thế bằng việc gọi API danh mục
                try {
                    const categoriesResponse = await MenuService.getCategories();
                    const mappedCategories = categoriesResponse.data.map(category => ({
                        category_id: category.categoryId,
                        name: category.name
                    }));

                    setCategories(mappedCategories);
                    console.log('Danh mục đã tải:', mappedCategories);
                    setIsLoading(false);
                } catch (error) {
                    console.error('Lỗi khi tải danh mục:', error);
                    setIsLoading(false);
                }
            } else {
                console.error('Cấu trúc dữ liệu API không đúng như mong đợi:', response);
                setError('Cấu trúc dữ liệu API không đúng như mong đợi');
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Lỗi khi lấy danh sách món ăn:', error);
            setError(error.message || 'Đã xảy ra lỗi khi tải dữ liệu');
            setIsLoading(false);
        }
    };

    // Thêm món ăn mới
    const handleAddMenuItem = async () => {
        if (newMenuItem.name.trim() === '') {
            alert('Vui lòng nhập tên món ăn');
            return;
        }

        if (!newMenuItem.price) {
            alert('Vui lòng nhập giá món ăn');
            return;
        }

        if (!newMenuItem.category_id) {
            alert('Vui lòng chọn danh mục');
            return;
        }

        try {



            // Đảm bảo category_id là số nguyên
            const categoryId = parseInt(newMenuItem.category_id, 10);

            // Chuyển đổi dữ liệu để phù hợp với API
            const menuItemToAdd = {
                name: newMenuItem.name,
                price: Number(newMenuItem.price),
                categoryId: categoryId, // Đảm bảo đây là số và sử dụng đúng tên trường API
                description: newMenuItem.description || '', // Tránh gửi null
                imageUrl: newMenuItem.image_url || '', // Tránh gửi null
            };

            console.log('Dữ liệu gửi đi khi thêm món ăn:', menuItemToAdd);

            const response = await MenuService.add(menuItemToAdd);
            console.log('Kết quả thêm món ăn:', response);

            // Reset form
            setNewMenuItem({
                name: '',
                price: '',
                category_id: '',
                description: '',
                image_url: ''
            });

            // Tải lại danh sách món ăn
            fetchMenuItems();
            setIsModalOpen(false);
        } catch (err) {
            console.error('Lỗi khi thêm món ăn:', err);
            alert('Có lỗi xảy ra khi thêm món ăn: ' + (err.message || 'Lỗi không xác định'));
        }
    };

    // Cập nhật món ăn
    const handleUpdate = async () => {
        if (!editMenuItem.name.trim()) {
            alert('Tên món ăn không được để trống');
            return;
        }

        try {
            // Log toàn bộ thông tin của editMenuItem
            console.log('Thông tin chi tiết của editMenuItem:', JSON.stringify(editMenuItem, null, 2));

            // Đảm bảo category_id là số nguyên
            const categoryId = parseInt(editMenuItem.category_id, 10);
            if (isNaN(categoryId)) {
                alert('Danh mục không hợp lệ');
                return;
            }

            // Chuẩn bị dữ liệu update
            const itemToUpdate = {
                dishId: editMenuItem.dish_id,
                name: editMenuItem.name,
                description: editMenuItem.description || '',
                price: parseFloat(editMenuItem.price),
                categoryId: categoryId,
                imageUrl: editMenuItem.image_url || ''
            };

            console.log('Dữ liệu chuẩn bị gửi lên API:', JSON.stringify(itemToUpdate, null, 2));

            try {
                const response = await MenuService.update(itemToUpdate);

                // Log phản hồi từ server
                console.log('Phản hồi từ server:', response);

                // Kiểm tra trạng thái của phản hồi
                if (response && response.status === 200) {
                    console.log('Cập nhật thành công');
                    setEditMenuItem(null);
                    fetchMenuItems();
                } else {
                    console.error('Cập nhật không thành công:', response);
                    alert('Cập nhật không thành công');
                }
            } catch (apiError) {
                // Log chi tiết lỗi API
                console.error('Chi tiết lỗi API:', apiError.response ? apiError.response.data : apiError);
                alert('Lỗi khi gọi API: ' + (apiError.response?.data?.message || apiError.message));
            }
        } catch (err) {
            console.error('Lỗi xử lý:', err);
            alert('Có lỗi xảy ra khi cập nhật món ăn');
        }
    };

    // Xóa món ăn
    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa món ăn này?')) {
            try {
                await MenuService.delete(id);
                fetchMenuItems();
            } catch (err) {
                console.error('Lỗi khi xóa món ăn:', err);
                alert('Có lỗi xảy ra khi xóa món ăn: ' + (err.message || 'Lỗi không xác định'));
            }
        }
    };

    // Chỉnh sửa món ăn
    const handleEdit = (item) => {
        setEditMenuItem({ ...item });
    };

    // Lấy tên danh mục từ ID
    const getCategoryName = (categoryId) => {
        const category = categories.find(cat => cat.category_id === categoryId);
        return category ? category.name : 'Không có danh mục';
    };

    // Format giá tiền
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    return (
        <Layout>
            <h2 className="text-2xl font-bold mb-4 text-amber-700">Quản lý Thực đơn</h2>

            {/* Nút thêm món ăn, mở Modal */}
            <button
                className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700"
                onClick={() => setIsModalOpen(true)}
            >
                Thêm Món ăn
            </button>

            {/* Trạng thái tải */}
            {isLoading && (
                <div className="mt-4 text-center">
                    <p className="text-gray-600">Đang tải dữ liệu...</p>
                </div>
            )}

            {/* Thông báo lỗi */}
            {error && (
                <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
                    <p>Lỗi: {error}</p>
                </div>
            )}

            {/* Modal Thêm Món ăn */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h3 className="text-xl font-semibold mb-4 text-amber-700">Thêm Món ăn mới</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Tên món <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    placeholder="Tên món ăn"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    value={newMenuItem.name}
                                    onChange={(e) => setNewMenuItem({ ...newMenuItem, name: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Giá <span className="text-red-500">*</span></label>
                                <input
                                    type="number"
                                    placeholder="Giá"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    value={newMenuItem.price}
                                    onChange={(e) => setNewMenuItem({ ...newMenuItem, price: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Danh mục <span className="text-red-500">*</span></label>
                                <select
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    value={newMenuItem.category_id}
                                    onChange={(e) => {
                                        console.log('Danh mục đã chọn:', e.target.value);
                                        setNewMenuItem({ ...newMenuItem, category_id: e.target.value });
                                    }}
                                >
                                    <option value="">-- Chọn danh mục --</option>
                                    {categories.map((cat) => (
                                        <option key={cat.category_id} value={cat.category_id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                                {/* Hiển thị giá trị đã chọn để debug */}
                                <div className="mt-1 text-xs text-gray-500">
                                    ID danh mục đã chọn: {newMenuItem.category_id || 'Chưa chọn'}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Mô tả</label>
                                <textarea
                                    placeholder="Mô tả"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    value={newMenuItem.description}
                                    onChange={(e) => setNewMenuItem({ ...newMenuItem, description: e.target.value })}
                                    rows="3"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Đường dẫn hình ảnh</label>
                                <input
                                    type="text"
                                    placeholder="URL hình ảnh"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    value={newMenuItem.image_url}
                                    onChange={(e) => setNewMenuItem({ ...newMenuItem, image_url: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="flex gap-2 justify-end mt-4">
                            <button
                                className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700"
                                onClick={handleAddMenuItem}
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

            {/* Bảng danh sách thực đơn */}
            {!isLoading && menuItems.length > 0 && (
                <div className="mt-6 overflow-x-auto">
                    <table className="w-full table-auto border-collapse">
                        <thead>
                        <tr className="bg-amber-50 text-left">
                            <th className="border px-4 py-2">ID</th>
                            <th className="border px-4 py-2">Ảnh</th>
                            <th className="border px-4 py-2">Tên món</th>
                            <th className="border px-4 py-2">Danh mục</th>
                            <th className="border px-4 py-2">Giá</th>
                            <th className="border px-4 py-2">Mô tả</th>
                            <th className="border px-4 py-2">Hành động</th>
                        </tr>
                        </thead>
                        <tbody>
                        {menuItems.map((item) => (
                            <tr key={item.dish_id}>
                                <td className="border px-4 py-2">{item.dish_id}</td>
                                <td className="border px-4 py-2">
                                    {item.image_url && (
                                        <img
                                            src={item.image_url}
                                            alt={item.name}
                                            className="w-16 h-16 object-cover rounded"
                                        />
                                    )}
                                </td>
                                <td className="border px-4 py-2">
                                    {editMenuItem?.dish_id === item.dish_id ? (
                                        <input
                                            value={editMenuItem.name}
                                            onChange={(e) => setEditMenuItem({ ...editMenuItem, name: e.target.value })}
                                            className="border p-1 rounded w-full"
                                        />
                                    ) : (
                                        item.name
                                    )}
                                </td>
                                <td className="border px-4 py-2">
                                    {editMenuItem?.dish_id === item.dish_id ? (
                                        <select
                                            value={editMenuItem.category_id}
                                            onChange={(e) => setEditMenuItem({ ...editMenuItem, category_id: e.target.value })}
                                            className="border p-1 rounded w-full"
                                        >
                                            <option value="">-- Chọn danh mục --</option>
                                            {categories.map((cat) => (
                                                <option key={cat.category_id} value={cat.category_id}>
                                                    {cat.name}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        getCategoryName(item.category_id)
                                    )}
                                </td>
                                <td className="border px-4 py-2">
                                    {editMenuItem?.dish_id === item.dish_id ? (
                                        <input
                                            type="number"
                                            value={editMenuItem.price}
                                            onChange={(e) => setEditMenuItem({ ...editMenuItem, price: e.target.value })}
                                            className="border p-1 rounded w-full"
                                        />
                                    ) : (
                                        formatPrice(item.price)
                                    )}
                                </td>
                                <td className="border px-4 py-2">
                                    {editMenuItem?.dish_id === item.dish_id ? (
                                        <textarea
                                            value={editMenuItem.description}
                                            onChange={(e) => setEditMenuItem({ ...editMenuItem, description: e.target.value })}
                                            className="border p-1 rounded w-full"
                                            rows="2"
                                        />
                                    ) : (
                                        item.description
                                    )}
                                </td>
                                <td className="border px-4 py-2">
                                    {editMenuItem?.dish_id === item.dish_id ? (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={handleUpdate}
                                                className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                                            >
                                                Lưu
                                            </button>
                                            <button
                                                onClick={() => setEditMenuItem(null)}
                                                className="bg-gray-400 text-white px-2 py-1 rounded hover:bg-gray-500"
                                            >
                                                Hủy
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(item)}
                                                className="bg-amber-500 text-white px-2 py-1 rounded hover:bg-amber-600"
                                            >
                                                Sửa
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.dish_id)}
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
            )}

            {/* Thông báo không có dữ liệu */}
            {!isLoading && menuItems.length === 0 && !error && (
                <div className="mt-6 p-4 bg-gray-100 rounded text-center">
                    <p>Không có món ăn nào. Hãy thêm món ăn mới.</p>
                </div>
            )}
        </Layout>
    );
};

export default MenuPage;