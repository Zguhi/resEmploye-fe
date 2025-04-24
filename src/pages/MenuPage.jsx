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
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchMenuItems();
        fetchCategories();
    }, [page]);

    // Lấy danh sách món ăn
    const fetchMenuItems = async () => {
        try {
            const response = await MenuService.getAll();
            const data = response.data.data;
            setMenuItems(data.content);
            setTotalPages(data.totalPages);
            console.log(response);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách món ăn:', error);
        }
    };
    // const fetchMenuItems = async () => {
    //     try {
    //         const response = await MenuService.getAll();
    //         if (response.data) {
    //             setMenuItems(response.data);
    //         } else {
    //             console.error('Invalid API response:', response);
    //         }
    //     } catch (error) {
    //         console.error('Error fetching menu items:', error);
    //     }
    // };

    // Lấy danh sách danh mục
    const fetchCategories = async () => {
        try {
            const response = await MenuService.getCategories();
            setCategories(response.data.data || []);
            console.log(response);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách danh mục:', error);
        }
    };

    // Thêm món ăn mới
    const handleAddMenuItem = async () => {
        if (newMenuItem.name.trim() === '') return;

        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const restaurantId = user.user_id; // Nếu người dùng là nhà hàng

            const menuItemToAdd = {
                ...newMenuItem,
                restaurant_id: restaurantId
            };

            await MenuService.add(menuItemToAdd);
            setNewMenuItem({
                name: '',
                price: '',
                category_id: '',
                description: '',
                image_url: ''
            });
            fetchMenuItems();
            setIsModalOpen(false);
        } catch (err) {
            console.error('Lỗi khi thêm món ăn:', err);
        }
    };

    // Cập nhật món ăn
    const handleUpdate = async () => {
        if (!editMenuItem.name.trim()) return;

        try {
            const response = await MenuService.update(editMenuItem);

            if (response.status === 200) {
                console.log('Cập nhật thành công:', response.data);
                setEditMenuItem(null);
                fetchMenuItems();
            } else {
                console.error('Cập nhật không thành công:', response);
            }
        } catch (err) {
            console.error('Lỗi khi cập nhật món ăn:', err);
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

            {/* Modal Thêm Món ăn */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h3 className="text-xl font-semibold mb-4 text-amber-700">Thêm Món ăn mới</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Tên món</label>
                                <input
                                    type="text"
                                    placeholder="Tên món ăn"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    value={newMenuItem.name}
                                    onChange={(e) => setNewMenuItem({ ...newMenuItem, name: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Giá</label>
                                <input
                                    type="number"
                                    placeholder="Giá"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    value={newMenuItem.price}
                                    onChange={(e) => setNewMenuItem({ ...newMenuItem, price: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Danh mục</label>
                                <select
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    value={newMenuItem.category_id}
                                    onChange={(e) => setNewMenuItem({ ...newMenuItem, category_id: e.target.value })}
                                >
                                    <option value="">-- Chọn danh mục --</option>
                                    {categories.map((cat) => (
                                        <option key={cat.category_id} value={cat.category_id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
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
            <div className="mt-6 overflow-x-auto">
                <table className="w-full table-auto border-collapse">
                    <thead>
                    <tr className="bg-amber-50 text-left">
                        <th className="border px-4 py-2">ID</th>
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

export default MenuPage;