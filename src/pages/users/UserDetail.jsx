import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Pencil, Trash2, UserX } from "lucide-react";
import { toast } from "sonner";
import * as userService from "../../services/userService";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Separator } from "../../components/ui/separator";
import { Skeleton } from "../../components/ui/skeleton";
import EmptyState from "../../components/common/EmptyState";
import DeleteUserDialog from "../../components/users/DeleteUserDialog";
import { formatDate, getInitials } from "../../lib/utils";

export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["user", id],
    queryFn: () => userService.getUserById(id),
    retry: false,
  });

  const deleteMutation = useMutation({
    mutationFn: () => userService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User deleted successfully.");
      navigate("/users");
    },
    onError: () => toast.error("Failed to delete user. Please try again."),
  });

  if (isLoading) {
    return (
      <div className="max-w-2xl">
        <Skeleton className="h-8 w-40 mb-6" />
        <div className="rounded-2xl border border-border p-6 space-y-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>
    );
  }

  if (isError || !user) {
    return (
      <EmptyState
        icon={UserX}
        title="User not found"
        description="This user may have been deleted or the link is incorrect."
        action={
          <Button variant="outline" onClick={() => navigate("/users")}>
            Back to users
          </Button>
        }
      />
    );
  }

  return (
    <div className="max-w-2xl">
      <button
        onClick={() => navigate("/users")}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to users
      </button>

      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <Avatar className="h-16 w-16">
            {user.photo && <AvatarImage src={user.photo} alt={`${user.firstName} ${user.lastName}`} />}
            <AvatarFallback className="text-lg">
              {getInitials(user.firstName, user.lastName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-semibold truncate">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-sm text-muted-foreground truncate">{user.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant={user.role === "Admin" ? "default" : "secondary"}>
                {user.role}
              </Badge>
              <Badge variant={user.status === "Active" ? "success" : "destructive"}>
                {user.status}
              </Badge>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <dt className="text-xs text-muted-foreground">Created</dt>
            <dd className="text-sm font-medium mt-1">{formatDate(user.createdAt)}</dd>
          </div>
        </dl>

        <Separator className="my-6" />

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
          <Button
            variant="outline"
            className="text-destructive hover:text-destructive"
            onClick={() => setConfirmDelete(true)}
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
          <Button onClick={() => navigate("/users", { state: { editUserId: id } })}>
            <Pencil className="h-4 w-4" />
            Edit user
          </Button>
        </div>
      </div>

      <DeleteUserDialog
        user={user}
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        onConfirm={() => deleteMutation.mutate()}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
}
