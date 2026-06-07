"use client";
import { useEffect, useState } from "react";
import { useApi } from "./useApi";
import { useAuth } from "@/store/auth";
import type { MyOrder } from "@/lib/ApiClient";

export function useMyOrders(): MyOrder[] {
  const api = useApi();
  const user = useAuth((s) => s.user);
  const [orders, setOrders] = useState<MyOrder[]>([]);

  useEffect(() => {
    if (!user) return;
    api.orders
      .mine()
      .then(setOrders)
      .catch(() => setOrders([]));
  }, [api, user]);

  return orders;
}
