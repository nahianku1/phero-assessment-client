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
import { Eye, EyeOff, Mail, Lock, User, Link as LinkIcon } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";

interface FormState {
  error: string | null;
  success: boolean;
}

const signupAction = async (
  _: FormState,
  formData: FormData
): Promise<FormState> => {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const photoURL = formData.get("photoURL") as string;

  try {
    const response = await fetch("http://localhost:3000/users/create-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password, photoURL }),
    });

    if (!response.ok) {
      const res = await response.json();
      const message = res.errorSources[0].message;
      throw new Error(JSON.stringify(message));
    }

    return { error: null, success: true };
  } catch (error) {
    console.log(error);

    return {
      error: error instanceof Error ? error.message : "An error occurred",
      success: false,
    };
  }
};

const SignupPage: React.FC = () => {
  const [state, formAction, isPending] = useActionState(signupAction, {
    error: null,
    success: false,
  });
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [photoURL, setPhotoURL] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const navigate = useNavigate();
  useEffect(() => {
    if (state.success) {
      navigate({
        to: "/login",
      });
    }
  }, [state.success]);

  return (
    <div className="min-h-screen flex px-5 md:p-0 items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <Card className="w-full max-w-md bg-white border-gray-200 shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-gray-900 text-center">
            Create Account
          </CardTitle>
          <CardDescription className="text-gray-500 text-center">
            Sign up to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700">
                  Name
                </Label>
                <div className="relative">
                  <User
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500"
                    size={20}
                  />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 bg-white border-blue-300 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 rounded-lg transition-colors"
                    required
                  />
                </div>
              </div>
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
              <div className="space-y-2">
                <Label htmlFor="photoURL" className="text-gray-700">
                  Photo URL
                </Label>
                <div className="relative">
                  <LinkIcon
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500"
                    size={20}
                  />
                  <Input
                    id="photoURL"
                    name="photoURL"
                    type="url"
                    placeholder="Enter your photo URL"
                    value={photoURL}
                    onChange={(e) => setPhotoURL(e.target.value)}
                    className="pl-10 bg-white border-blue-300 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 rounded-lg transition-colors"
                  />
                </div>
              </div>
              {state.error && (
                <p className="text-sm text-red-500 text-center">
                  {state.error}
                </p>
              )}
              {state.success && (
                <p className="text-sm text-blue-500 text-center">
                  Account created successfully!
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-md transition-colors"
              disabled={isPending}
            >
              {isPending ? "Creating Account..." : "Sign Up"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignupPage;

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/signup")({
  component: SignupPage,
});
