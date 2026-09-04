import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ImagePlus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { createUserSchema, editUserSchema } from "../../schemas/userSchemas";
import * as userService from "../../services/userService";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

const defaultValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  role: "User",
  status: "Active",
  photo: "",
};

const MAX_FILE_SIZE = 2 * 1024 * 1024;

export default function UserDialog({ open, onOpenChange, user = null }) {
  const isEditing = Boolean(user);
  const photoInputRef = useRef(null);
  const queryClient = useQueryClient();
  const [preview, setPreview] = useState("");
  const schema = isEditing ? editUserSchema : createUserSchema;
  const { register, handleSubmit, control, reset, setValue, setError, clearErrors, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  useEffect(() => {
    const values = user
      ? { ...defaultValues, ...user, password: "", photo: user.photo || "" }
      : defaultValues;
    reset(values);
    setPreview(values.photo);
    if (photoInputRef.current) photoInputRef.current.value = "";
  }, [user, open, reset]);

  const mutation = useMutation({
    mutationFn: (data) => (isEditing ? userService.updateUser(user.id, data) : userService.createUser(data)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      if (isEditing) queryClient.invalidateQueries({ queryKey: ["user", user.id] });
      toast.success(isEditing ? "User updated successfully." : "User created successfully.");
      reset(defaultValues);
      setPreview("");
      onOpenChange(false);
    },
    onError: () => toast.error(`Failed to ${isEditing ? "update" : "create"} user. Please try again.`),
  });

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setError("photo", { message: "Choose a JPG, JPEG, or PNG image." });
      event.target.value = "";
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError("photo", { message: "Image must be 2 MB or smaller." });
      event.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result);
      setValue("photo", reader.result, { shouldDirty: true });
      clearErrors("photo");
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setPreview("");
    setValue("photo", "", { shouldDirty: true });
    clearErrors("photo");
    if (photoInputRef.current) photoInputRef.current.value = "";
  };

  const onSubmit = async (data) => {
    const emailTaken = await userService.checkEmailExists(data.email, user?.id);
    if (emailTaken) {
      toast.error("A user with this email already exists.");
      return;
    }
    const payload = { ...data };
    if (isEditing && !payload.password) delete payload.password;
    mutation.mutate(payload);
  };

  const handleOpenChange = (isOpen) => {
    if (!isOpen && mutation.isPending) return;
    if (!isOpen) {
      reset(defaultValues);
      setPreview("");
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit user" : "Add user"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update this user's information." : "Create a user account with their role and access status."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["firstName", "First name", "Jane"],
              ["lastName", "Last name", "Doe"],
            ].map(([name, label, placeholder]) => (
              <div className="space-y-1.5" key={name}>
                <Label htmlFor={`user-${name}`}>{label}</Label>
                <Input id={`user-${name}`} placeholder={placeholder} aria-invalid={Boolean(errors[name])} {...register(name)} />
                {errors[name] && <p className="text-xs text-destructive">{errors[name].message}</p>}
              </div>
            ))}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="user-email">Email</Label>
            <Input id="user-email" type="email" placeholder="jane@example.com" aria-invalid={Boolean(errors.email)} {...register("email")} />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="user-password">Password {isEditing && <span className="text-muted-foreground">(leave blank to keep current)</span>}</Label>
            <Input id="user-password" type="password" autoComplete="new-password" placeholder={isEditing ? "Unchanged" : "Create password"} aria-invalid={Boolean(errors.password)} {...register("password")} />
            {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["role", "Role", [["Admin", "Admin"], ["User", "User"]]],
              ["status", "Status", [["Active", "Active"], ["Inactive", "Inactive"]]],
            ].map(([name, label, options]) => (
              <div className="space-y-1.5" key={name}>
                <Label htmlFor={`user-${name}`}>{label}</Label>
                <Controller name={name} control={control} render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id={`user-${name}`}><SelectValue /></SelectTrigger>
                    <SelectContent>{options.map(([value, text]) => <SelectItem key={value} value={value}>{text}</SelectItem>)}</SelectContent>
                  </Select>
                )} />
                {errors[name] && <p className="text-xs text-destructive">{errors[name].message}</p>}
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <Label htmlFor="user-photo">Profile photo <span className="text-muted-foreground">(optional)</span></Label>
            <div className="flex items-center gap-3">
              {preview ? <img src={preview} alt="Profile preview" className="h-14 w-14 rounded-full border object-cover" /> : <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-primary"><ImagePlus className="h-5 w-5" /></div>}
              <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                <Input ref={photoInputRef} id="user-photo" type="file" accept="image/jpeg,image/png" className="max-w-[220px] cursor-pointer file:mr-3 file:border-0 file:bg-transparent file:text-sm file:font-medium" onChange={handlePhotoChange} />
                {preview && <Button type="button" variant="ghost" size="sm" onClick={removePhoto}><Trash2 className="h-4 w-4" /> Remove</Button>}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">JPG, JPEG, or PNG. Maximum 2 MB.</p>
            {errors.photo && <p className="text-xs text-destructive">{errors.photo.message}</p>}
          </div>
          <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={mutation.isPending}>Cancel</Button>
            <Button type="submit" disabled={mutation.isPending}>{mutation.isPending ? (isEditing ? "Saving..." : "Creating...") : (isEditing ? "Save changes" : "Create user")}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
