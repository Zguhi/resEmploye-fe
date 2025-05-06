import {
    LayoutDashboard,
    Utensils,
    CalendarDays,
    Receipt,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const Sidebar = ({ isOpen }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [active, setActive] = useState("");

    useEffect(() => {
        const path = location.pathname;
        const menuItem = menu.find(item => item.path === path) || menu.find(item => item.path === "/");
        if (menuItem) {
            setActive(menuItem.name);
        }
    }, [location.pathname]);

    const menu = [
        { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/" },
        { name: "Thực đơn", icon: <Utensils size={20} />, path: "/menu" },
        { name: "Đặt bàn", icon: <CalendarDays size={20} />, path: "/reservation" },
        { name: "Hóa đơn", icon: <Receipt size={20} />, path: "/bills" },
    ];

    const handleClick = (path) => {
        navigate(path);
    };

    return (
        <aside
            className={`fixed top-0 left-0 h-screen w-64 bg-white z-40
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                transition-transform duration-300 ease-in-out`}
        >
            <div className="h-full flex flex-col">
                {/* Logo và Tiêu đề */}
                <div className="h-16 flex items-center px-6">
                    <h1 className="font-bold text-xl text-orange-500">Gericht Restaurant</h1>
                </div>

                {/* Menu */}
                <nav className="flex-1 px-3 py-4">
                    {menu.map((item) => (
                        <button
                            key={item.name}
                            className={`flex items-center w-full px-3 py-2 mb-1 rounded-lg text-sm
                                ${active === item.name
                                ? "bg-amber-50 text-orange-500"
                                : "text-gray-600 hover:bg-gray-100"}
                                transition-colors duration-200`}
                            onClick={() => handleClick(item.path)}
                        >
                            <span className="mr-3">{item.icon}</span>
                            {item.name}
                        </button>
                    ))}
                </nav>

                {/* Footer */}
                <div className="p-4">
                    <div className="flex items-center gap-3">
                        <img
                            src="https://i.pravatar.cc/32"
                            alt="User"
                            className="w-8 h-8 rounded-full"
                        />
                        <div>
                            <p className="text-sm text-gray-900">Admin</p>
                            <p className="text-xs text-gray-500">admin@gericht.com</p>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;