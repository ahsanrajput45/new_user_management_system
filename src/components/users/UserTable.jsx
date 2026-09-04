import { useNavigate } from "react-router-dom";
import { ArrowUp, ArrowDown, ArrowUpDown, Eye, Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../ui/table";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { formatDate, getInitials, cn } from "../../lib/utils";

function SortIcon({ active, direction }) {
  if (!active) return <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />;
  return direction === "asc" ? (
    <ArrowUp className="h-3.5 w-3.5" />
  ) : (
    <ArrowDown className="h-3.5 w-3.5" />
  );
}

export default function UserTable({ users, sortBy, sortDir, onSort, onDeleteRequest, onEditRequest }) {
  const navigate = useNavigate();

  const SortableHead = ({ field, children, className }) => (
    <TableHead className={className}>
      <button
        onClick={() => onSort(field)}
        className="flex items-center gap-1.5 hover:text-foreground transition-colors"
      >
        {children}
        <SortIcon active={sortBy === field} direction={sortDir} />
      </button>
    </TableHead>
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <SortableHead field="firstName">User</SortableHead>
          <SortableHead field="email">Email</SortableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <SortableHead field="createdAt">Created</SortableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>
              <div className="flex items-center gap-3 min-w-[160px]">
                <Avatar className="h-9 w-9">
                  {user.photo && <AvatarImage src={user.photo} alt={`${user.firstName} ${user.lastName}`} />}
                  <AvatarFallback>
                    {getInitials(user.firstName, user.lastName)}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium">
                  {user.firstName} {user.lastName}
                </span>
              </div>
            </TableCell>
            <TableCell className="text-muted-foreground">{user.email}</TableCell>
            <TableCell>
              <Badge variant={user.role === "Admin" ? "default" : "secondary"}>
                {user.role}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge variant={user.status === "Active" ? "success" : "destructive"}>
                {user.status}
              </Badge>
            </TableCell>
            <TableCell className="text-muted-foreground whitespace-nowrap">
              {formatDate(user.createdAt)}
            </TableCell>
            <TableCell>
              <div className="flex items-center justify-end gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="View user"
                  onClick={() => navigate(`/users/${user.id}`)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Edit user"
                  onClick={() => onEditRequest(user)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Delete user"
                  className="text-destructive hover:text-destructive"
                  onClick={() => onDeleteRequest(user)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
