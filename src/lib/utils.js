import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString) {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function getInitials(firstName, lastName) {
  const firstInitial = firstName?.[0] || "";
  const lastInitial = lastName?.[0] || "";
  return (firstInitial + lastInitial).toUpperCase();
}
