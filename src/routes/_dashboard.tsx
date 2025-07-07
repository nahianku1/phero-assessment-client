import React from "react";
import {
  Link,
  Outlet,
  useRouteContext,
  createFileRoute,
  useRouter,
  redirect,
} from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetClose,
} from "@/components/ui/sheet";
import { Home, Calendar, Plus, User, LogOut, Menu } from "lucide-react";
import { provideRouteContext } from "@/utils/provideRouteContext";
import { isLoggedIn } from "@/utils/isLoggedIn";

interface User {
  name: string;
  photoURL: string;
}

const Dashboard: React.FC = () => {
  const { user }: { user: Record<string, unknown> } = useRouteContext({
    from: "/_dashboard",
  });
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch(
        "https://event-manager-dun.vercel.app/auth/expire-token",
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (response.ok) {
        console.log("Logged out successfully");
        router.navigate({ to: "/login" });
      } else {
        console.error("Logout failed:", response.statusText);
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-2xl hidden md:block">
        <div className="p-6">
          <nav className="mt-8">
            <ul className="space-y-4">
              {[
                { to: "/", icon: Home, label: "Home" }, // Adjusted to match parent route
                { to: "/events", icon: Calendar, label: "Events" },
                { to: "/add-events", icon: Plus, label: "Add Event" },
                { to: "/my-events", icon: User, label: "My Events" },
              ].map(({ to, icon: Icon, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    activeOptions={{ exact: true }}
                    className="flex items-center p-3 text-gray-200 hover:bg-gray-700 hover:text-white rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105"
                    activeProps={{
                      className: "bg-gray-700 text-white rounded-xl",
                    }}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>

      {/* Mobile Sidebar with Navbar Trigger */}
      <Sheet>
        <div className="flex-1 flex flex-col">
          {/* Navbar */}
          <nav className="bg-white shadow-md p-4 flex justify-between items-center border-b border-gray-200">
            <div className="flex items-center">
              <img
                src="/eicon.webp"
                className="w-10 h-10 md:w-14 md:h-14"
                alt=""
              />
              <span className="text-lg md:text-2xl font-semibold text-gray-900">
                Event Management
              </span>
            </div>
            <div className="relative flex items-center space-x-4">
              <SheetTrigger asChild>
                <button className="md:hidden">
                  <Menu className="h-6 w-6 text-gray-900" />
                </button>
              </SheetTrigger>
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="cursor-pointer ring-2 ring-blue-500 ring-offset-2">
                      <AvatarImage
                        src={user?.photoURL as string}
                        alt="Profile"
                      />
                      <AvatarFallback>
                        {(user?.name as string)?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-48 bg-white shadow-xl rounded-lg"
                  >
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

          {/* Main Content */}
          <main className="flex-1 p-6 overflow-auto bg-blue-50 backdrop-blur-sm">
            <Outlet />
          </main>
        </div>

        {/* Mobile Sidebar Drawer */}
        <SheetContent
          side="left"
          className="w-64 p-0 bg-gradient-to-b from-gray-900 to-gray-800 text-white"
        >
          <nav className="mt-8">
            <ul className="space-y-4">
              {[
                { to: "/", icon: Home, label: "Home" },
                { to: "/events", icon: Calendar, label: "Events" },
                { to: "/add-events", icon: Plus, label: "Add Event" },
                { to: "/my-events", icon: User, label: "My Events" },
              ].map(({ to, icon: Icon, label }) => (
                <li key={to}>
                  <SheetClose asChild>
                    <Link
                      to={to}
                      activeOptions={{ exact: true }}
                      className="flex items-center p-3 text-gray-200 hover:bg-gray-700 hover:text-white rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105"
                      activeProps={{
                        className: "bg-gray-700 text-white rounded-xl",
                      }}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {label}
                    </Link>
                  </SheetClose>
                </li>
              ))}
            </ul>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Dashboard;

export const Route = createFileRoute("/_dashboard")({
  component: Dashboard,
  beforeLoad: async () => {
    const res = await isLoggedIn();
    if (!res) {
      throw redirect({
        to: "/login",
      });
    }
    return await provideRouteContext();
  },
});
