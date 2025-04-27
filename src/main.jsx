import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Đã xóa dữ liệu người dùng mặc định để yêu cầu đăng nhập
// Giờ ứng dụng sẽ hiển thị trang đăng nhập khi khởi động

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <App />
    </StrictMode>,
)