import { User } from "@prisma/client";
import { useMatches } from "@remix-run/react";
import { useMemo } from "react";

export function useMatchesData(
  id: string,
): Record<string, unknown> | undefined {
  const matches = useMatches();
  const route = useMemo(
    () => matches.find((match) => match.id === id),
    [matches, id],
  );

  return route?.data as Record<string, unknown>;
}
function isUser(user: unknown): user is User {
  return (
    user != null &&
    typeof user === "object" &&
    "email" in user &&
    typeof user.email === "string"
  );
}

export function useCurrentUser(): User | undefined {
  const data = useMatchesData("root");
  if (!data || !isUser(data.user)) return undefined;
  return data?.user;
}
