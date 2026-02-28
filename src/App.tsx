import { Navigate, Route, Routes } from 'react-router-dom';
import DirectoryPage from './pages/DirectoryPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ToolPage from './pages/ToolPage';
import LeaderboardPage from './pages/LeaderboardPage';
import ComparePage from './pages/ComparePage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<DirectoryPage />} />
      <Route path="/tool/:id" element={<ToolPage />} />
      <Route path="/leaderboard" element={<LeaderboardPage />} />
      <Route path="/compare" element={<ComparePage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/blog/:slug" element={<BlogPostPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin" element={<AdminDashboardPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
