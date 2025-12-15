import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import HomePage from "../pages/HomePage";
import ProductsPage from "../pages/ProductsPage";
import ProductDetailPage from "../pages/ProductDetailPage";
import CartPage from "../pages/CartPage"; // NEW: Import the new CartPage
import OrdersPage from "../pages/OrdersPage";
import ServicesPage from "../pages/ServicesPage";
import AboutPage from "../pages/AboutPage";
import ContactPage from "../pages/ContactPage";
import NotFoundPage from "../pages/NotFoundPage";
import ProtectedRoute from "../components/ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* Protected Routes */}
      <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
      <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
      <Route path="/products" element={<ProtectedRoute><ProductsPage /></ProtectedRoute>} />
      <Route path="/products/:id" element={<ProtectedRoute><ProductDetailPage /></ProtectedRoute>} />
      
      {/* NEW: Route for the Cart Page */}
      <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
      
      <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
      <Route path="/services" element={<ProtectedRoute><ServicesPage /></ProtectedRoute>} />
      <Route path="/about" element={<ProtectedRoute><AboutPage /></ProtectedRoute>} />
      <Route path="/contact" element={<ProtectedRoute><ContactPage /></ProtectedRoute>} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;