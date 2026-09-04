import { useNavigate } from "react-router-dom";
import { Eye, Pencil, Trash2, Mail, Calendar } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { formatDate, getInitials } from "../../lib/utils";

export default function UserCard({ user, onDeleteRequest, onEditRequest }) {
  const navigate = useNavigate();

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar className="h-11 w-11 shrink-0">
            {user.photo && <AvatarImage src={user.photo} alt={`${user.firstName} ${user.lastName}`} />}
            <AvatarFallback>{getInitials(user.firstName, user.lastName)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="font-medium truncate">
              {user.firstName} {user.lastName}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
              <Mail className="h-3 w-3 shrink-0" />
              <span className="truncate">{user.email}</span>
            </div>
          </div>
        </div>
        <Badge variant={user.status === "Active" ? "success" : "destructive"}>
          {user.status}
        </Badge>
      </div>

      <div className="mt-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Calendar className="h-3 w-3 shrink-0" />
          <span className="truncate">{formatDate(user.createdAt)}</span>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <Badge variant={user.role === "Admin" ? "default" : "secondary"}>{user.role}</Badge>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" aria-label="View user" onClick={() => navigate(`/users/${user.id}`)}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Edit user" onClick={() => onEditRequest(user)}>
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
      </div>
    </div>
  );
}
