"use client";

import { useSession } from "next-auth/react";

const ORDERS_HREF = "/conta/pedidos";
const LOGIN_HREF = "/login";

export interface AuthNavState {
  readonly isAuthenticated: boolean;
  readonly isLoading: boolean;
  readonly showOrdersLink: boolean;
  readonly showLoginLink: boolean;
  readonly ordersHref: string;
  readonly loginHref: string;
}

export function useAuthNav(): AuthNavState {
  const sessionResult = useSession() ?? { data: null, status: "loading" };
  const status = sessionResult.status as
    | "loading"
    | "authenticated"
    | "unauthenticated";

  const isAuthenticated = status === "authenticated" && !!sessionResult.data;

  return {
    isAuthenticated,
    isLoading: status === "loading",
    showOrdersLink: isAuthenticated,
    showLoginLink: status === "unauthenticated",
    ordersHref: ORDERS_HREF,
    loginHref: LOGIN_HREF,
  };
}
