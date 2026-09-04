import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <p className="text-sm font-medium text-primary">404</p>
      <h1 className="text-2xl font-semibold tracking-tight mt-2">Page not found</h1>
      <Button asChild className="mt-6">
        <Link to="/users">Back to users</Link>
      </Button>
    </div>
  );
}
