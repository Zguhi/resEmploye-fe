// src/utils/apiHelper.js
import axios from 'axios';

/**
 * Kiểm tra kết nối API
 * @param {string} apiUrl - URL của API cần kiểm tra
 * @returns {Promise<boolean>} - True nếu kết nối thành công, False nếu thất bại
 */
export const checkApiConnection = async (apiUrl) => {
    try {
        // Tách URL để lấy phần domain và base path
        const url = new URL(apiUrl);
        const baseUrl = `${url.protocol}//${url.hostname}${url.port ? ':' + url.port : ''}`;

        console.log('Đang kiểm tra kết nối tới:', baseUrl);

        // Chỉ kiểm tra kết nối đến domain, không cần kiểm tra endpoint cụ thể
        const response = await axios.get(baseUrl, {
            timeout: 5000 // Timeout sau 5 giây
        });

        console.log('Kết nối thành công, trạng thái:', response.status);
        return true;
    } catch (error) {
        console.error('Kiểm tra kết nối thất bại:', error.message);

        if (error.response) {
            // Nếu nhận được phản hồi từ server, dù là lỗi 4xx thì vẫn
            // coi là kết nối được đến server
            console.log('Server có phản hồi với mã:', error.response.status);
            return true;
        }

        return false;
    }
};

/**
 * Tạo dữ liệu mẫu để sử dụng khi API không khả dụng
 * @returns {Array} - Mảng dữ liệu mẫu
 */
export const generateMockStaffData = () => {
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