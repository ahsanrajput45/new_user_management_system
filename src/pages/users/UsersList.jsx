import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Users as UsersIcon } from "lucide-react";
import { toast } from "sonner";
import * as userService from "../../services/userService";
import { Button } from "../../components/ui/button";
import { Skeleton } from "../../components/ui/skeleton";
import EmptyState from "../../components/common/EmptyState";
import UserFilters from "../../components/users/UserFilters";
import UserTable from "../../components/users/UserTable";
import UserCard from "../../components/users/UserCard";
import Pagination from "../../components/users/Pagination";
import DeleteUserDialog from "../../components/users/DeleteUserDialog";
import UserDialog from "../../components/users/UserDialog";

const PAGE_SIZE = 6;

export default function UsersList() {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [role, setRole] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(1);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const location = useLocation();

  const {
    data: users = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["users"],
    queryFn: userService.getUsers,
  });

  useEffect(() => {
    const editUser = users.find((user) => String(user.id) === String(location.state?.editUserId));
    if (editUser) {
      setUserToEdit(editUser);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [users, location.state]);

  const deleteMutation = useMutation({
    mutationFn: userService.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User deleted successfully.");
      setUserToDelete(null);
    },
    onError: () => {
      toast.error("Failed to delete user. Please try again.");
    },
  });

  const updateFilter = (setter) => (value) => {
    setter(value);
    setPage(1);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDir((direction) => (direction === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortDir("asc");
    }
  };

  const resetFilters = () => {
    setSearch("");
    setStatus("all");
    setRole("all");
    setPage(1);
  };

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();

    let result = users.filter((user) => {
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      const matchesSearch =
        !term ||
        fullName.includes(term) ||
        user.email.toLowerCase().includes(term);

      const matchesStatus = status === "all" || user.status === status;
      const matchesRole = role === "all" || user.role === role;

      return matchesSearch && matchesStatus && matchesRole;
    });

    result = [...result].sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];

      if (sortBy === "firstName") {
        aVal = `${a.firstName} ${a.lastName}`.toLowerCase();
        bVal = `${b.firstName} ${b.lastName}`.toLowerCase();
      }
      if (sortBy === "email") {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      if (sortBy === "createdAt") {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      }

      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [users, search, status, role, sortBy, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginatedUsers = filteredUsers.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  const hasNoUsersAtAll = !isLoading && users.length === 0;
  const hasNoFilteredResults = !isLoading && users.length > 0 && filteredUsers.length === 0;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage and organize your users.
          </p>
        </div>
        <Button className="w-full sm:w-auto" onClick={() => setIsAddUserOpen(true)}>
          <Plus className="h-4 w-4" />
          Add user
        </Button>
      </div>

      <div className="mt-6">
        <UserFilters
          search={search}
          onSearchChange={updateFilter(setSearch)}
          status={status}
          onStatusChange={updateFilter(setStatus)}
          role={role}
          onRoleChange={updateFilter(setRole)}
          onReset={resetFilters}
        />
      </div>

      <div className="mt-6">
        {isLoading && (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-16 w-full" />
            ))}
          </div>
        )}

        {isError && !isLoading && (
          <EmptyState
            icon={UsersIcon}
            title="Couldn't load users"
            description="Something went wrong while fetching your users. Check that the JSON Server is running."
            action={
              <Button variant="outline" onClick={() => refetch()}>
                Try again
              </Button>
            }
          />
        )}

        {hasNoUsersAtAll && (
          <EmptyState
            icon={UsersIcon}
            title="No users yet"
            description="Get started by adding your first user."
            action={
              <Button onClick={() => setIsAddUserOpen(true)}>
                <Plus className="h-4 w-4" />
                Add user
              </Button>
            }
          />
        )}

        {hasNoFilteredResults && (
          <EmptyState
            icon={UsersIcon}
            title="No matching users"
            description="Try adjusting your search or filters."
            action={
              <Button variant="outline" onClick={resetFilters}>
                Clear filters
              </Button>
            }
          />
        )}

        {!isLoading && !isError && paginatedUsers.length > 0 && (
          <>
            <div className="hidden md:block">
              <UserTable
                users={paginatedUsers}
                sortBy={sortBy}
                sortDir={sortDir}
                onSort={handleSort}
                onDeleteRequest={setUserToDelete}
                onEditRequest={setUserToEdit}
              />
            </div>

            <div className="md:hidden space-y-3">
              {paginatedUsers.map((user) => (
              <UserCard key={user.id} user={user} onDeleteRequest={setUserToDelete} onEditRequest={setUserToEdit} />
              ))}
            </div>

            <Pagination page={safePage} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </div>

      <DeleteUserDialog
        user={userToDelete}
        open={Boolean(userToDelete)}
        onOpenChange={(open) => !open && setUserToDelete(null)}
        onConfirm={() => deleteMutation.mutate(userToDelete.id)}
        isDeleting={deleteMutation.isPending}
      />
      <UserDialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen} />
      <UserDialog
        user={userToEdit}
        open={Boolean(userToEdit)}
        onOpenChange={(open) => !open && setUserToEdit(null)}
      />
    </div>
  );
}
