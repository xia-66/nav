import axios from "axios";
export default (config: any) => {
  const service: any = axios.create({
    baseURL: import.meta.env.VITE_BASEURL_API,
    timeout: 12000,
  });
  service.interceptors.request.use(
    (config: any) => {
      config.headers["Content-Type"] =
        config.headers["Content-Type"] || "application/json";
      // if (config.url !== "/WfwGetUserInfo") {
      //   config.headers["Authorization"] = sessionStorage.getItem("token");
      // }
      return config;
    },
    (error: any) => {
      return Promise.reject(error);
    }
  );
  service.interceptors.response.use(
    (response: any) => {
      return response.data;
    },
    (error: any) => {
      return Promise.reject(error);
    }
  );
  return service(config);
};
