import type * as React from "react";
import type { Metadata } from "next";

import { appConfig } from "@/config/app";
import { dayjs } from "@/lib/dayjs";
import { CategoriesView } from "@/components/dashboard/categories/categories-view";
import type { CategoryItem } from "@/components/dashboard/categories/types";

export const metadata: Metadata = {
  title: `Categories | Dashboard | ${appConfig.name}`,
};

// Dummy-Kategorien
const dummyCategories: CategoryItem[] = [
  {
    id: "CAT-001",
    name: "SIF-Org Alpha",
    createdAt: dayjs().subtract(2, "hour").toDate(),
    lastUsedAt: dayjs().subtract(30, "minute").toDate(),
  },
  {
    id: "CAT-002",
    name: "SIF-Org Beta",
    createdAt: dayjs().subtract(1, "hour").toDate(),
    lastUsedAt: null,
  },
  {
    id: "CAT-003",
    name: "Alliance XY",
    createdAt: dayjs().subtract(45, "minute").toDate(),
    lastUsedAt: dayjs().subtract(10, "minute").toDate(),
  },
];

export default function Page(): React.JSX.Element {
  return <CategoriesView categories={dummyCategories} />;
}
