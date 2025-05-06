import React from 'react';
import { Search, Bell } from 'lucide-react';

const Topbar = () => {
    return (
        <div className="sticky top-0 right-0 left-0 bg-white z-30 h-16 px-6">
            <div className="flex items-center justify-between h-full">
                {/* Left side - Search */}
                <div className="flex-1 max-w-2xl">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Tìm kiếm..."
                            className="w-full h-10 pl-10 pr-4 rounded-lg bg-gray-100 border-none focus:outline-none focus:ring-0"
                        />
                    </div>
                </div>

                {/* Right side */}
                <div className="flex items-center gap-4">
                    {/* Notification */}
                    <div className="relative">
                        <Bell size={24} className="text-gray-600" />
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                    </div>

                    {/* Profile */}
                    <div className="flex items-center gap-2">
                        <span className="text-gray-800">Admin</span>
                        <img
                            src="https://i.pravatar.cc/32"
                            alt="Profile"
                            className="w-10 h-10 rounded-full"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Topbar;