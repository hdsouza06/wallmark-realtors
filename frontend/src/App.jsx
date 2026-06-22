import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";

const Home = lazy(() => import("./pages/Home"));
const Buy = lazy(() => import("./pages/Buy"));
const Sell = lazy(() => import("./pages/Sell"));
const Lease = lazy(() => import("./pages/Lease"));
const HomeLoan = lazy(() => import("./pages/HomeLoan"));
const Interiors = lazy(() => import("./pages/Interiors"));
const Redevelopment = lazy(() => import("./pages/Redevelopment"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const PropertyDetail = lazy(() => import("./pages/PropertyDetail"));
const NotFound = lazy(() => import("./pages/NotFound"));

const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const ManageProperties = lazy(() => import("./pages/admin/ManageProperties"));
const PropertyEditor = lazy(() => import("./pages/admin/PropertyEditor"));
const ManageEnquiries = lazy(() => import("./pages/admin/ManageEnquiries"));
const ManageTestimonials = lazy(() => import("./pages/admin/ManageTestimonials"));
const ManageBanners = lazy(() => import("./pages/admin/ManageBanners"));
const ManageBlog = lazy(() => import("./pages/admin/ManageBlog"));
const ManageSettings = lazy(() => import("./pages/admin/ManageSettings"));

function Loader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream">
      <div className="h-12 w-12 animate-spin rounded-full border-2 border-gold border-t-transparent" />
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="buy" element={<Buy />} />
          <Route path="sell" element={<Sell />} />
          <Route path="lease" element={<Lease />} />
          <Route path="home-loan" element={<HomeLoan />} />
          <Route path="interiors" element={<Interiors />} />
          <Route path="redevelopment" element={<Redevelopment />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:slug" element={<BlogPost />} />
          <Route path="property/:slug" element={<PropertyDetail />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="properties" element={<ManageProperties />} />
          <Route path="properties/new" element={<PropertyEditor />} />
          <Route path="properties/:id" element={<PropertyEditor />} />
          <Route path="enquiries" element={<ManageEnquiries />} />
          <Route path="testimonials" element={<ManageTestimonials />} />
          <Route path="banners" element={<ManageBanners />} />
          <Route path="blog" element={<ManageBlog />} />
          <Route path="settings" element={<ManageSettings />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
