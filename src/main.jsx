import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Thêm dữ liệu người dùng giả tạm thời
// TODO: Xóa dòng này khi đã sửa xong dữ liệu
localStorage.setItem('authToken', 'fake-token-for-development');
localStorage.setItem('user', JSON.stringify({
    name: 'Admin',
    role: 'admin',
    email: 'admin@gerichtrestaurant.com'
}));

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <App />
    </StrictMode>,
)