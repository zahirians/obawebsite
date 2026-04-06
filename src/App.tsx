import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/Home";
import { AlumniHubPage } from "./pages/AlumniHub";
import { MembershipPage } from "./pages/Membership";
import { BranchesListPage } from "./pages/BranchesList";
import { BranchDetailPage } from "./pages/BranchDetail";
import { BatchesListPage } from "./pages/BatchesList";
import { BatchDetailPage } from "./pages/BatchDetail";
import { AssociationsListPage } from "./pages/AssociationsList";
import { AssociationDetailPage } from "./pages/AssociationDetail";
import { NewsListPage } from "./pages/NewsList";
import { ContactPage } from "./pages/Contact";
import { AdminLoginPage } from "./pages/admin/AdminLogin";
import { AdminProtected } from "./pages/admin/AdminProtected";
import { AdminDashboard } from "./pages/admin/AdminDashboard";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="alumni" element={<AlumniHubPage />} />
        <Route path="alumni/membership" element={<MembershipPage />} />
        <Route path="alumni/branches" element={<BranchesListPage />} />
        <Route path="alumni/branches/:slug" element={<BranchDetailPage />} />
        <Route path="alumni/batches" element={<BatchesListPage />} />
        <Route path="alumni/batches/:slug" element={<BatchDetailPage />} />
        <Route path="alumni/associations" element={<AssociationsListPage />} />
        <Route path="alumni/associations/:slug" element={<AssociationDetailPage />} />
        <Route path="news" element={<NewsListPage />} />
        <Route path="contact" element={<ContactPage />} />
      </Route>
      <Route path="admin/login" element={<AdminLoginPage />} />
      <Route
        path="admin"
        element={
          <AdminProtected>
            <AdminDashboard />
          </AdminProtected>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
