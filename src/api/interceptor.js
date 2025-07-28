import axios from 'axios';

axios.interceptors.request.use(
  function (config) {
    var token = typeof window !== 'undefined' ? window.localStorage.getItem('accessToken') : '';

    // let publicPaths = ["/api/v1/otp-generator/generateotp", "/api/v1/otp-generator/verifyOtp", "/api/v1/customer/getCustomer"];
    
    // if(config.url.includes(publicPaths[0]) || config.url.includes(publicPaths[1]) || config.url.includes(publicPaths[2]) ){

    //   token = process.env.REACT_APP_PUBLIC_TOKEN
    // }

    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export const createAxiosResponseInterceptor = async () => {
  const interceptor = axios.interceptors.response.use(
    response => response,
    async error => {
      console.log("error", error)
      const status = error?.response?.status
      console.log("error refresh", status)
      if (status !== 444 && status !== 401 && status !== 200) {
        console.log("promise reject");
        return Promise.reject(error);
      }

      axios.interceptors.response.eject(interceptor)

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        console.log("refreshToken", refreshToken)
        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/refreshToken`, { refreshToken })
        console.log("response", response)
        await saveToken(response);

        error.response.config.headers['Authorization'] = 'Bearer ' + response.data.data.accessToken

        return await axios(error.response.config)
      } catch (error2) {
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(error2);
      } finally {
        console.log("finally")
        createAxiosResponseInterceptor();
      }
    }
  )
}

const saveToken = async res => {
  localStorage.setItem('refreshToken', res.data.data.refreshToken);
  localStorage.setItem('accessToken', res.data.data.accessToken);
  localStorage.setItem('userData', JSON.stringify(res.data.data.user));
}
