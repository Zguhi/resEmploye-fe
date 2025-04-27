import {
    LayoutDashboard,
    Utensils,
    CalendarDays,
    Users,
    Package,
    Receipt,
    Clock,
    Contact,
    Settings,
    LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { logout } from "../api/auth";

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const [active, setActive] = useState("Dashboard");
    const navigate = useNavigate();

    const menu = [
        { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/home" },
        { name: "Thực đơn", icon: <Utensils size={20} />, path: "/menu" },
        { name: "Đặt bàn", icon: <CalendarDays size={20} />, path: "/reservation" },
        { name: "Nhân viên", icon: <Users size={20} />, path: "/staff" },
        { name: "Kho nguyên liệu", icon: <Package size={20} />, path: "/inventory" },
        { name: "Hóa đơn", icon: <Receipt size={20} />, path: "/bills" },
    ];

    const pages = [
        { name: "Lịch làm việc", icon: <Clock size={20} />, path: "/schedule" },
        { name: "Liên hệ", icon: <Contact size={20} />, path: "/contact" },
    ];

    const handleClick = (name, path) => {
        setActive(name);
        navigate(path);
        if (toggleSidebar) toggleSidebar();
    };

    // Xử lý đăng xuất
    const handleLogout = () => {
        logout(); // Xóa thông tin đăng nhập
        navigate("/"); // Chuyển hướng về trang đăng nhập
    };

    return (
        <div className={`fixed top-0 left-0 h-full w-64 bg-white border-r shadow-sm z-40 transform transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>

            <div className="px-6 py-4 font-bold text-xl text-amber-600 flex justify-between items-center">
                Gericht Restaurant
                <button onClick={toggleSidebar} className="lg:hidden text-gray-600 hover:text-black">
                    ✕
                </button>
            </div>

            <nav className="flex-1 px-4 space-y-1">
                {menu.map((item) => (
                    <button
                        key={item.name}
                        className={`flex items-center w-full px-3 py-2 rounded-lg text-sm font-medium ${
                            active === item.name ? "bg-amber-100 text-amber-600" : "text-gray-600 hover:bg-gray-100"
                        }`}
                        onClick={() => handleClick(item.name, item.path)}
                    >
                        <span className="mr-3">{item.icon}</span>
                        {item.name}
                    </button>
                ))}

                <div className="mt-4 text-gray-400 text-xs uppercase px-3">Tiện ích</div>

                {pages.map((item) => (
                    <button
                        key={item.name}
                        className={`flex items-center w-full px-3 py-2 rounded-lg text-sm font-medium ${
                            active === item.name ? "bg-amber-100 text-amber-600" : "text-gray-600 hover:bg-gray-100"
                        }`}
                        onClick={() => handleClick(item.name, item.path)}
                    >
                        <span className="mr-3">{item.icon}</span>
                        {item.name}
                    </button>
                ))}
            </nav>

            <div className="px-4 py-3 border-t flex flex-col space-y-2">
                <button className="flex items-center text-sm text-gray-600 hover:text-amber-500">
                    <Settings size={18} className="mr-2" />
                    Cài đặt
                </button>
                <button
                    className="flex items-center text-sm text-gray-600 hover:text-amber-500"
                    onClick={handleLogout}
                >
                    <LogOut size={18} className="mr-2" />
                    Đăng xuất
                </button>
            </div>
        </div>
    );
};

export default Sidebar;