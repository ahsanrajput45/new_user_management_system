import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, ImagePlus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { signupSchema } from "../../schemas/authSchemas";
import * as authService from "../../services/authService";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

export default function Signup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [preview, setPreview] = useState("");
  const photoInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      photo: "",
    },
  });

  const signupMutation = useMutation({
    mutationFn: authService.signup,
    onSuccess: () => {
      toast.success("Account created successfully.");
      navigate("/login", { replace: true });
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong. Please try again.");
    },
  });

  const onSubmit = (data) => {
    const { confirmPassword, ...payload } = data;
    signupMutation.mutate(payload);
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      setError('photo', { message: 'Choose a JPG, JPEG, or PNG image.' });
      event.target.value = '';
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError('photo', { message: 'Image must be 2 MB or smaller.' });
      event.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const photo = reader.result;
      setPreview(photo);
      setValue('photo', photo);
      clearErrors('photo');
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setPreview('');
    setValue('photo', '');
    clearErrors('photo');
    if (photoInputRef.current) photoInputRef.current.value = '';
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Sign up</h1>
      <p className="text-sm text-muted-foreground mt-1">
        Enter your details below to create your account and get started.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-5" noValidate>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="firstName">First name</Label>
            <Input
              id="firstName"
              autoComplete="given-name"
              placeholder="Jane"
              aria-invalid={Boolean(errors.firstName)}
              {...register("firstName")}
            />
            {errors.firstName && (
              <p className="text-xs text-destructive">{errors.firstName.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="lastName">Last name</Label>
            <Input
              id="lastName"
              autoComplete="family-name"
              placeholder="Doe"
              aria-invalid={Boolean(errors.lastName)}
              {...register("lastName")}
            />
            {errors.lastName && (
              <p className="text-xs text-destructive">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-invalid={Boolean(errors.email)}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="photo">Profile photo <span className="text-muted-foreground">(optional)</span></Label>
          <div className="flex items-center gap-3">
            {preview ? (
              <img src={preview} alt="Profile preview" className="h-14 w-14 rounded-full border object-cover" />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-primary"><ImagePlus className="h-5 w-5" /></div>
            )}
            <div className="flex flex-wrap items-center gap-2">
              <Input
                ref={photoInputRef}
                id="photo"
                type="file"
                accept="image/jpeg,image/png"
                className="max-w-[220px] cursor-pointer file:mr-3 file:border-0 file:bg-transparent file:text-sm file:font-medium"
                onChange={handlePhotoChange}
              />
              {preview && <Button type="button" variant="ghost" size="sm" onClick={removePhoto}><Trash2 className="h-4 w-4" /> Remove</Button>}
            </div>
          </div>
          <p className="text-xs text-muted-foreground">JPG, JPEG, or PNG. Maximum 2 MB.</p>
          {errors.photo && <p className="text-xs text-destructive">{errors.photo.message}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Create password"
                aria-invalid={Boolean(errors.password)}
                className="pr-10"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((isVisible) => !isVisible)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-destructive">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword">Confirm password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirm ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Repeat password"
                aria-invalid={Boolean(errors.confirmPassword)}
                className="pr-10"
                {...register("confirmPassword")}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((isVisible) => !isVisible)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showConfirm ? "Hide password" : "Show password"}
              >
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
            )}
          </div>
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={signupMutation.isPending}>
          {signupMutation.isPending ? "Creating account..." : "Create account"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground mt-6">
        Already have an account?{" "}
        <Link to="/login" className="text-primary font-medium hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
