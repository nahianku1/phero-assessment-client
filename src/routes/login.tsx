import { useEffect, useState } from "react";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";

interface FormState {
  error: string | null;
  success: boolean;
}

const loginAction = async (
  _: FormState,
  formData: FormData
): Promise<FormState> => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const response = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    if (!response.ok) {
      const res = await response.json();
      const message = res.errorSources[0].message;
      throw new Error(JSON.stringify(message));
    }

    return { error: null, success: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "An error occurred",
      success: false,
    };
  }
};

const LoginPage: React.FC = () => {
  const [state, formAction, isPending] = useActionState(loginAction, {
    error: null,
    success: false,
  });
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (state.success) {
      navigate({
        to: "/dashboard",
      });
    }
  }, [state.success]);

  return (
    <div className="min-h-screen flex items-center p-5 md:p-0 justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <Card className="w-full max-w-md bg-white border-gray-200 shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-gray-900 text-center">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-gray-500 text-center">
            Sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction}>
            <div className="space-y-4">
              {state.error && (
                <p className="text-sm text-red-500 text-center">
                  {state.error}
                </p>
              )}
              {state.success && (
                <p className="text-sm text-blue-500 text-center">
                  Login successful!
                </p>
              )}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">
                  Email
                </Label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500"
                    size={20}
                  />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-white border-blue-300 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 rounded-lg transition-colors"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500"
                    size={20}
                  />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 bg-white border-blue-300 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 rounded-lg transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-md transition-colors"
              disabled={isPending}
            >
              {isPending ? "Signing In..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-500">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-500 hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});
