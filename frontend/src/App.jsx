import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/layout/Sidebar";
import Topbar from "./components/layout/Topbar";
import Home from "./pages/Home";
import History from "./pages/History";
import Pinned from "./pages/Pinned";
import WorkspaceDetail from "./pages/workspaceDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { useWorkspace } from "./hooks/useWorkspace";

function DashboardLayout({ workspace }) {
  return (
    <div className="flex h-screen w-full bg-app-bg overflow-hidden text-app-text">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 overflow-y-auto no-scrollbar relative">
          <div className="mx-auto max-w-7xl w-full">
            <Routes>
              <Route path="/" element={<Home workspace={workspace} />} />
              <Route path="/history" element={<History workspace={workspace} />} />
              <Route path="/pinned" element={<Pinned workspace={workspace} />} />
              <Route path="/workspace/:id" element={<WorkspaceDetail workspace={workspace} />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  const workspace = useWorkspace();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/*" element={
        <ProtectedRoute>
          <DashboardLayout workspace={workspace} />
        </ProtectedRoute>
      } />
    </Routes>
  );
}