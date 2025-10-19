import axios from "axios"

console.log("API base URL:", process.env.NEXT_PUBLIC_API_BASE_URL);

const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
})  

// instance.interceptors.response.use(
//     response => response,
//     (error: AxiosError) => {
//         if(error.response) {
//             console.error('API error status:', error.response.status);
//             console.error('API error data:', error.response.data);

//         switch (error.response.status) {
//             case 401:
//                 alert('Session expired. Please login again.');
//                 break;
//             default:
//                 alert(`Error: ${error.response.statusText}`);
//         }
//         } else if (error.request) {
//             alert('Network error. Please check your connection.');
//         } else {
//             alert(`Error: ${error.message}`);
//         }

//         return Promise.reject(error);
//     }
// )

export default instance