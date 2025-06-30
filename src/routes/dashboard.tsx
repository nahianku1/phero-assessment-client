import React from 'react';
import { Link, Outlet, useRouteContext, createFileRoute, useRouter } from '@tanstack/react-router';
import { Button } from '@/components/ui/button'; // shadcn/ui Button
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'; // shadcn/ui Avatar
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'; // shadcn/ui Dropdown
import { Home, Calendar, Plus, User, LogOut } from 'lucide-react'; // Icons for sidebar and dropdown
import { provideRouteContext } from '@/utils/provideRouteContext';

interface User {
  name: string;
  photoURL: string;
}

const Dashboard: React.FC = () => {
  const { user }: { user: Record<string, unknown> } = useRouteContext({
    from: '/dashboard',
  });
  const router = useRouter(); // Get router for navigation

  // Logout handler to call server endpoint and redirect
  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:3000/auth/expire-token', {
        method: 'POST', // or GET, depending on your API
        credentials: 'include', // Include cookies in the request
      });

      if (response.ok) {
        console.log('Logged out successfully');
        router.navigate({ to: '/login' }); // Redirect to login page
      } else {
        console.error('Logout failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-2xl hidden md:block">
        <div className="p-6">
          <nav className="mt-8">
            <ul className="space-y-4">
              <li>
                <Link
                  to="/dashboard"
                  activeOptions={{ exact: true }}
                  className="flex items-center p-3 text-gray-200 hover:bg-gray-700 hover:text-white rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105"
                  activeProps={{
                    className: 'bg-gray-700 text-white rounded-xl',
                  }}
                >
                  <Home className="w-5 h-5 mr-3 group-[.bg-gray-700]:text-white" />
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/events"
                  className="flex items-center p-3 text-gray-200 hover:bg-gray-700 hover:text-white rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105"
                  activeProps={{
                    className: 'bg-gray-700 text-white rounded-xl',
                  }}
                >
                  <Calendar className="w-5 h-5 mr-3 group-[.bg-gray-700]:text-white" />
                  Events
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/add-events"
                  className="flex items-center p-3 text-gray-200 hover:bg-gray-700 hover:text-white rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105"
                  activeProps={{
                    className: 'bg-gray-700 text-white rounded-xl',
                  }}
                >
                  <Plus className="w-5 h-5 mr-3 group-[.bg-gray-700]:text-white" />
                  Add Event
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/my-events"
                  className="flex items-center p-3 text-gray-200 hover:bg-gray-700 hover:text-white rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105"
                  activeProps={{
                    className: 'bg-gray-700 text-white rounded-xl',
                  }}
                >
                  <User className="w-5 h-5 mr-3 group-[.bg-gray-700]:text-white" />
                  My Events
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <nav className="bg-white shadow-md p-4 flex justify-between items-center border-b border-gray-200">
            <div className="flex items-center">
            <Calendar className="h-8 w-8 mr-3 text-blue-500" />
            <span className="text-2xl font-semibold text-gray-900">Event Management</span>
            </div>
          <div className="relative">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer ring-2 ring-blue-500 ring-offset-2">
                    <AvatarImage src={user?.photoURL as string} alt="Profile" />
                    <AvatarFallback>{(user?.name as string)?.charAt(0)}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-white shadow-xl rounded-lg">
                  <DropdownMenuLabel className="font-semibold text-gray-900">
                    {user?.name as string}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer hover:bg-gray-100 flex items-center"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button className="bg-blue-400 hover:bg-blue-500 text-white font-medium rounded-lg px-5 py-2.5 transition-colors duration-200">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </nav>

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-auto bg-blue-50 backdrop-blur-sm">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

export const Route = createFileRoute('/dashboard')({
  component: Dashboard,
  beforeLoad: provideRouteContext,
});