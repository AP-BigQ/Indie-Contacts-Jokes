import { useParams } from "@remix-run/react";

export default function UserPage() {
  const { user } = useParams();
}
