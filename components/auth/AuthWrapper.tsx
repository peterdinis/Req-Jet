"use client";

import { useState, useEffect, FC, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Zap, Eye, EyeOff } from "lucide-react";
import { useLoginMutation } from "@/hooks/auth/useLogin";
import { useSignupMutation } from "@/hooks/auth/useRegister";
import { useResetPasswordMutation, useUpdatePasswordMutation } from "@/hooks/auth/usePasswords";

const AuthWrapper: FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const router = useRouter();
  const { toast } = useToast();

  // mutations
  const loginMutation = useLoginMutation();
  const signupMutation = useSignupMutation();
  const resetPasswordMutation = useResetPasswordMutation();
  const updatePasswordMutation = useUpdatePasswordMutation();

  /**
   * Handle Supabase redirect (signup confirmation / magic link / recovery).
   */
  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const access_token = hashParams.get("access_token");
    const refresh_token = hashParams.get("refresh_token");
    const type = hashParams.get("type");

    if (access_token && refresh_token) {
      supabase.auth.setSession({ access_token, refresh_token }).then(({ error }) => {
        if (error) {
          toast({
            title: "Authentication failed",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Welcome!",
            description:
              type === "signup"
                ? "Your email has been confirmed."
                : "You are logged in.",
          });
          router.push("/dashboard");
        }
      });
    }

    if (type === "recovery") {
      setIsRecoveryMode(true);
    }
  }, [router, toast]);

  /** LOGIN */
  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    loginMutation.mutate(
      { email, password },
      {
        onSuccess: () => {
          toast({ title: "Welcome back!", description: "Successfully logged in." });
          router.push("/dashboard");
        },
        onError: (err: any) =>
          toast({
            title: "Login failed",
            description: err.message,
            variant: "destructive",
          }),
      }
    );
  };

  /** SIGNUP */
  const handleSignup = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signupMutation.mutate(
      { email, password, fullName },
      {
        onSuccess: () => {
          toast({
            title: "Account created!",
            description: "Check your email to confirm your account.",
          });
          setFullName("");
          setPassword("");
          setActiveTab("login");
        },
        onError: (err: any) =>
          toast({
            title: "Signup failed",
            description: err.message,
            variant: "destructive",
          }),
      }
    );
  };

  /** RESET PASSWORD */
  const handlePasswordReset = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    resetPasswordMutation.mutate(
      { email },
      {
        onSuccess: () => {
          toast({
            title: "Reset email sent",
            description: "Check your inbox for the password reset link.",
          });
          setShowResetPassword(false);
        },
        onError: (err: any) =>
          toast({
            title: "Reset failed",
            description: err.message,
            variant: "destructive",
          }),
      }
    );
  };

  /** UPDATE PASSWORD (recovery mode) */
  const handleUpdatePassword = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updatePasswordMutation.mutate(
      { newPassword },
      {
        onSuccess: () => {
          toast({
            title: "Password updated",
            description: "You can now log in with your new password.",
          });
          setIsRecoveryMode(false);
          setNewPassword("");
          router.push("/dashboard");
        },
        onError: (err: any) =>
          toast({
            title: "Update failed",
            description: err.message,
            variant: "destructive",
          }),
      }
    );
  };

  const isLoading =
    loginMutation.isPending ||
    signupMutation.isPending ||
    resetPasswordMutation.isPending ||
    updatePasswordMutation.isPending;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent mb-4 animate-glow">
            <Zap className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold mb-2">API Testing Platform</h1>
          <p className="text-muted-foreground">Test, debug, and document your APIs</p>
        </div>

        {/* Card */}
        <Card className="border-border bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle>
              {isRecoveryMode
                ? "Set New Password"
                : showResetPassword
                ? "Reset Password"
                : "Get Started"}
            </CardTitle>
            <CardDescription>
              {isRecoveryMode
                ? "Enter your new password below"
                : showResetPassword
                ? "Enter your email to receive a password reset link"
                : "Sign in or create an account to continue"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* Recovery Mode */}
            {isRecoveryMode && (
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <div className="relative">
                    <Input
                      id="new-password"
                      type={showNewPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      disabled={isLoading}
                      minLength={6}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword((s) => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showNewPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating password...
                    </>
                  ) : (
                    "Update Password"
                  )}
                </Button>
              </form>
            )}

            {/* Reset Password */}
            {!isRecoveryMode && showResetPassword && (
              <form onSubmit={handlePasswordReset} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reset-email">Email</Label>
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending reset link...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => setShowResetPassword(false)}
                  disabled={isLoading}
                >
                  Back to Login
                </Button>
              </form>
            )}

            {/* Login & Signup Tabs */}
            {!isRecoveryMode && !showResetPassword && (
              <Tabs
                value={activeTab}
                onValueChange={(val) => setActiveTab(val as "login" | "signup")}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>

                {/* Login */}
                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="login-password">Password</Label>
                        <button
                          type="button"
                          onClick={() => setShowResetPassword(true)}
                          className="text-xs text-primary hover:underline"
                        >
                          Forgot password?
                        </button>
                      </div>
                      <div className="relative">
                        <Input
                          id="login-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          disabled={isLoading}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((s) => !s)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Logging in...
                        </>
                      ) : (
                        "Log In"
                      )}
                    </Button>
                  </form>
                </TabsContent>

                {/* Signup */}
                <TabsContent value="signup">
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name">Full Name</Label>
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="John Doe"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <div className="relative">
                        <Input
                          id="signup-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          disabled={isLoading}
                          minLength={6}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((s) => !s)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthWrapper;
