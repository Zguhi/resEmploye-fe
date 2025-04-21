import React, { useState, useEffect } from 'react';
import Layout from '../layouts/layout.jsx';
import { getCurrentUser } from '../api/auth.js';

const HomePage = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userInfo = getCurrentUser();
        setUser(userInfo);
    }, []);

    return (
        <Layout>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-amber-700 mb-4">Chào mừng đến với Quản lý Gericht Restaurant</h1>
                {user && (
                    <p className="text-gray-700 mb-4">
                        Xin chào, <span className="font-semibold">{user.name}</span>!
                    </p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                    <div className="bg-amber-50 p-6 rounded-lg shadow-sm border border-amber-100">
                        <h2 className="text-lg font-bold text-amber-800 mb-3">Đặt bàn hôm nay</h2>
                        <p className="text-amber-700 text-2xl font-bold">12</p>
                        <p className="text-gray-600 text-sm mt-1">3 chờ xác nhận</p>
                    </div>

                    <div className="bg-green-50 p-6 rounded-lg shadow-sm border border-green-100">
                        <h2 className="text-lg font-bold text-green-800 mb-3">Doanh thu hôm nay</h2>
                        <p className="text-green-700 text-2xl font-bold">8.540.000 đ</p>
                        <p className="text-gray-600 text-sm mt-1">+15% so với hôm qua</p>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-lg shadow-sm border border-blue-100">
                        <h2 className="text-lg font-bold text-blue-800 mb-3">Tổng đơn hàng</h2>
                        <p className="text-blue-700 text-2xl font-bold">24</p>
                        <p className="text-gray-600 text-sm mt-1">4 đang xử lý</p>
                    </div>
                </div>

                <div className="mt-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Đặt bàn mới nhất</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white">
                            <thead className="bg-gray-100">
                            <tr>
                                <th className="py-2 px-4 text-left">Khách hàng</th>
                                <th className="py-2 px-4 text-left">Số điện thoại</th>
                                <th className="py-2 px-4 text-left">Thời gian</th>
                                <th className="py-2 px-4 text-left">Số người</th>
                                <th className="py-2 px-4 text-left">Trạng thái</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                            <tr>
                                <td className="py-2 px-4">Nguyễn Văn A</td>
                                <td className="py-2 px-4">0912345678</td>
                                <td className="py-2 px-4">18:30 - 20/04/2025</td>
                                <td className="py-2 px-4">4</td>
                                <td className="py-2 px-4"><span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Chờ xác nhận</span></td>
                            </tr>
                            <tr>
                                <td className="py-2 px-4">Trần Thị B</td>
                                <td className="py-2 px-4">0987654321</td>
                                <td className="py-2 px-4">19:00 - 20/04/2025</td>
                                <td className="py-2 px-4">2</td>
                                <td className="py-2 px-4"><span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Đã xác nhận</span></td>
                            </tr>
                            <tr>
                                <td className="py-2 px-4">Lê Văn C</td>
                                <td className="py-2 px-4">0976543210</td>
                                <td className="py-2 px-4">12:30 - 21/04/2025</td>
                                <td className="py-2 px-4">6</td>
                                <td className="py-2 px-4"><span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Đã xác nhận</span></td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default HomePage;