import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import {API_BASE_URL} from "../api/axiosConfig.js";

const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isRegisterMode, setIsRegisterMode] = useState(false);

    // Thêm state cho form đăng ký
    const [registerData, setRegisterData] = useState({
        name: "",
        email: "",
        password: "",
        phoneNumber: "",
        address: "", // Mặc định là Admin
        role: "ADMIN"
    });

    const navigate = useNavigate();

    // URL API từ backend
    const API_URL = `${API_BASE_URL}/api/auth`;

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            // Gọi trực tiếp đến API backend
            const response = await axios.post(`${API_URL}/login`, {
                email,
                password
            });

            console.log("Đăng nhập thành công:", response.data);

            // Lưu token và thông tin người dùng vào localStorage
            if (response.data.token) {
                // Kiểm tra xem người dùng có phải là Admin không
                const userData = response.data.user;
                if (userData && userData.role !== "Admin") {
                    setError("Chỉ tài khoản Admin mới được phép đăng nhập!");
                    setIsLoading(false);
                    return;
                }

                localStorage.setItem('authToken', response.data.token);
                localStorage.setItem('user', JSON.stringify(userData));
                navigate("/home");
            } else {
                setError("Phản hồi không hợp lệ từ server");
            }
        } catch (err) {
            console.error("Lỗi đăng nhập:", err);
            setError(err.response?.data?.message || "Sai email hoặc mật khẩu");
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            // Đảm bảo vai trò là Admin
            if (registerData.role !== "Admin") {
                setError("Chỉ được phép đăng ký tài khoản Admin!");
                setIsLoading(false);
                return;
            }

            // Kiểm tra mật khẩu có đủ mạnh không
            if (registerData.password.length < 6) {
                setError("Mật khẩu phải có ít nhất 6 ký tự");
                setIsLoading(false);
                return;
            }

            // Gọi API đăng ký
            const response = await axios.post(`${API_URL}/register`, registerData);

            console.log("Đăng ký thành công:", response.data);

            // Chuyển sang chế độ đăng nhập và điền email đã đăng ký
            setIsRegisterMode(false);
            setEmail(registerData.email);
            setPassword("");

            // Hiển thị thông báo thành công
            alert("Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.");

        } catch (err) {
            console.error("Lỗi đăng ký:", err);
            setError(err.response?.data?.message || "Có lỗi xảy ra khi đăng ký");
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegisterInputChange = (e) => {
        const { name, value } = e.target;
        setRegisterData({
            ...registerData,
            [name]: value
        });
    };

    const toggleMode = () => {
        setIsRegisterMode(!isRegisterMode);
        setError("");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-amber-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        {isRegisterMode ? "Đăng Ký Tài Khoản Admin" : "Đăng Nhập - Gericht Restaurant"}
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        {isRegisterMode ? "Tạo tài khoản admin mới" : "Đăng nhập để quản lý nhà hàng"}
                    </p>
                </div>

                {isRegisterMode ? (
                    // Form Đăng ký
                    <form className="mt-8 space-y-6" onSubmit={handleRegister}>
                        <div className="rounded-md shadow-sm space-y-4">
                            <div>
                                <label htmlFor="register-name" className="block text-sm font-medium text-gray-700">
                                    Họ và tên
                                </label>
                                <input
                                    id="register-name"
                                    name="name"
                                    type="text"
                                    required
                                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500 focus:z-10 sm:text-sm"
                                    placeholder="Nhập họ và tên"
                                    value={registerData.name}
                                    onChange={handleRegisterInputChange}
                                    disabled={isLoading}
                                />
                            </div>

                            <div>
                                <label htmlFor="register-email" className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input
                                    id="register-email"
                                    name="email"
                                    type="email"
                                    required
                                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500 focus:z-10 sm:text-sm"
                                    placeholder="Nhập email"
                                    value={registerData.email}
                                    onChange={handleRegisterInputChange}
                                    disabled={isLoading}
                                />
                            </div>

                            <div>
                                <label htmlFor="register-password" className="block text-sm font-medium text-gray-700">
                                    Mật khẩu
                                </label>
                                <input
                                    id="register-password"
                                    name="password"
                                    type="password"
                                    required
                                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500 focus:z-10 sm:text-sm"
                                    placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
                                    value={registerData.password}
                                    onChange={handleRegisterInputChange}
                                    disabled={isLoading}
                                />
                            </div>

                            <div>
                                <label htmlFor="register-phone" className="block text-sm font-medium text-gray-700">
                                    Số điện thoại
                                </label>
                                <input
                                    id="register-phone"
                                    name="phoneNumber"
                                    type="text"
                                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500 focus:z-10 sm:text-sm"
                                    placeholder="Nhập số điện thoại"
                                    value={registerData.phoneNumber}
                                    onChange={handleRegisterInputChange}
                                    disabled={isLoading}
                                />
                            </div>

                            <div>
                                <label htmlFor="register-address" className="block text-sm font-medium text-gray-700">
                                    Địa chỉ
                                </label>
                                <input
                                    id="register-address"
                                    name="address"
                                    type="text"
                                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500 focus:z-10 sm:text-sm"
                                    placeholder="Nhập địa chỉ"
                                    value={registerData.address}
                                    onChange={handleRegisterInputChange}
                                    disabled={isLoading}
                                />
                            </div>

                            {/* Đã ẩn lựa chọn vai trò, mặc định là Admin */}
                            <input type="hidden" name="role" value="Admin" />
                        </div>

                        {error && (
                            <div className="text-red-500 text-sm text-center">
                                {error}
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors duration-200 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Đang xử lý...
                                    </>
                                ) : (
                                    "Đăng ký"
                                )}
                            </button>
                        </div>

                        <div className="text-center">
                            <button
                                type="button"
                                className="text-sm text-amber-600 hover:text-amber-500"
                                onClick={toggleMode}
                            >
                                Đã có tài khoản? Đăng nhập ngay
                            </button>
                        </div>
                    </form>
                ) : (
                    // Form Đăng nhập
                    <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                        <div className="rounded-md shadow-sm space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500 focus:z-10 sm:text-sm"
                                    placeholder="Nhập email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={isLoading}
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Mật khẩu
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    required
                                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500 focus:z-10 sm:text-sm"
                                    placeholder="Nhập mật khẩu"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="text-red-500 text-sm text-center">
                                {error}
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors duration-200 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Đang xử lý...
                                    </>
                                ) : (
                                    "Đăng nhập"
                                )}
                            </button>
                        </div>

                        <div className="text-center">
                            <button
                                type="button"
                                className="text-sm text-amber-600 hover:text-amber-500"
                                onClick={toggleMode}
                            >
                                Chưa có tài khoản? Đăng ký ngay
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default LoginForm;