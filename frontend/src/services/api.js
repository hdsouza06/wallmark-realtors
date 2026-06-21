import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("wallmark_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("wallmark_token");
      if (window.location.pathname.startsWith("/admin") && window.location.pathname !== "/admin/login") {
        window.location.href = "/admin/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// ---------------- API helpers ----------------
export const propertiesApi = {
  list: (params) => api.get("/properties", { params }).then((r) => r.data),
  get: (slug) => api.get(`/properties/${slug}`).then((r) => r.data),
  create: (data) => api.post("/properties", data).then((r) => r.data),
  update: (id, data) => api.put(`/properties/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/properties/${id}`).then((r) => r.data),
};

export const uploadsApi = {
  propertyImages: (id, files) => {
    const fd = new FormData();
    [...files].forEach((f) => fd.append("files", f));
    return api
      .post(`/uploads/property/${id}`, fd, { headers: { "Content-Type": "multipart/form-data" } })
      .then((r) => r.data);
  },
  generic: (file) => {
    const fd = new FormData();
    fd.append("file", file);
    return api
      .post(`/uploads/generic`, fd, { headers: { "Content-Type": "multipart/form-data" } })
      .then((r) => r.data);
  },
  deleteImage: (id) => api.delete(`/uploads/property-image/${id}`).then((r) => r.data),
};

export const enquiriesApi = {
  create: (data) => api.post("/enquiries", data).then((r) => r.data),
  list: () => api.get("/enquiries").then((r) => r.data),
  markRead: (id) => api.patch(`/enquiries/${id}/read`).then((r) => r.data),
  remove: (id) => api.delete(`/enquiries/${id}`).then((r) => r.data),
};

export const contentApi = {
  testimonials: () => api.get("/testimonials").then((r) => r.data),
  allTestimonials: () => api.get("/testimonials/all").then((r) => r.data),
  createTestimonial: (d) => api.post("/testimonials", d).then((r) => r.data),
  updateTestimonial: (id, d) => api.put(`/testimonials/${id}`, d).then((r) => r.data),
  removeTestimonial: (id) => api.delete(`/testimonials/${id}`).then((r) => r.data),
  banners: () => api.get("/banners").then((r) => r.data),
  createBanner: (d) => api.post("/banners", d).then((r) => r.data),
  updateBanner: (id, d) => api.put(`/banners/${id}`, d).then((r) => r.data),
  removeBanner: (id) => api.delete(`/banners/${id}`).then((r) => r.data),
  blog: () => api.get("/blog").then((r) => r.data),
  blogPost: (slug) => api.get(`/blog/${slug}`).then((r) => r.data),
  createBlog: (d) => api.post("/blog", d).then((r) => r.data),
  updateBlog: (id, d) => api.put(`/blog/${id}`, d).then((r) => r.data),
  removeBlog: (id) => api.delete(`/blog/${id}`).then((r) => r.data),
  subscribe: (email) => api.post("/newsletter", { email }).then((r) => r.data),
};

export const settingsApi = {
  get: () => api.get("/settings").then((r) => r.data),
  update: (data) => api.put("/settings", data).then((r) => r.data),
};

export const authApi = {
  login: (email, password) => {
    const fd = new URLSearchParams();
    fd.append("username", email);
    fd.append("password", password);
    return api.post("/auth/login", fd).then((r) => r.data);
  },
  me: () => api.get("/auth/me").then((r) => r.data),
};
