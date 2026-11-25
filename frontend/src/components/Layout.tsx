import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-beige">
      <Sidebar />
      <main className="flex-1 p-8 print:p-0">
        <Outlet />
      </main>
    </div>
  );
}