// apps/dashboard/src/components/dashboard/categories/zones/zones-pagination.tsx
"use client";

import * as React from "react";
import TablePagination from "@mui/material/TablePagination";

interface ZonesPaginationProps {
  count: number;
  page: number;
}

function noop() {
  // NOP
}

/**
 * Minimaler Fake-Paginator
 */
export function ZonesPagination({ count, page }: ZonesPaginationProps) {
  return (
    <TablePagination
      component="div"
      count={count}
      onPageChange={noop}
      onRowsPerPageChange={noop}
      page={page}
      rowsPerPage={10}
      rowsPerPageOptions={[5, 10, 25]}
    />
  );
}
