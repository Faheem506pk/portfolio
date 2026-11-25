"use client"

import { useState } from "react"
import { flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table"
import { ArrowDown, ArrowUp, ChevronsUpDown, Loader2 } from "lucide-react"

// Sortable, paged list table built on TanStack Table (MIT). Styling lives in admin.css (.wp-table).
// Column meta: `label` is the header text shown as a row label on phones, `primary` marks the title column.
export function DataTable({ columns, data, loading = false, emptyText = "Nothing here yet.", pageSize = 20, initialSort = [] }) {
  const [sorting, setSorting] = useState(initialSort)
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize })

  const table = useReactTable({
    data,
    columns,
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    autoResetPageIndex: true,
  })

  const rows = table.getRowModel().rows
  const total = data.length
  const pageCount = table.getPageCount()
  const { pageIndex } = table.getState().pagination
  const from = total === 0 ? 0 : pageIndex * pageSize + 1
  const to = Math.min(total, (pageIndex + 1) * pageSize)
  const colSpan = columns.length

  return (
    <div>
      <div className="wp-table-wrap">
        <table className="wp-table">
          <thead>
            {table.getHeaderGroups().map((group) => (
              <tr key={group.id}>
                {group.headers.map((header) => {
                  const canSort = header.column.getCanSort()
                  const dir = header.column.getIsSorted()
                  return (
                    <th key={header.id} scope="col" aria-sort={dir === "asc" ? "ascending" : dir === "desc" ? "descending" : canSort ? "none" : undefined}>
                      {header.isPlaceholder ? null : canSort ? (
                        <button type="button" className="wp-sort" onClick={header.column.getToggleSortingHandler()}>
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {dir === "asc" ? <ArrowUp size={13} aria-hidden="true" /> : dir === "desc" ? <ArrowDown size={13} aria-hidden="true" /> : <ChevronsUpDown size={13} aria-hidden="true" className="opacity-50" />}
                        </button>
                      ) : (
                        flexRender(header.column.columnDef.header, header.getContext())
                      )}
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={colSpan} className="muted">
                  <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
                  Loading
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={colSpan} className="muted">
                  {emptyText}
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    const meta = cell.column.columnDef.meta || {}
                    const label = meta.label ?? (typeof cell.column.columnDef.header === "string" ? cell.column.columnDef.header : undefined)
                    return (
                      <td key={cell.id} data-label={meta.primary ? undefined : label} className={meta.className}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    )
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {total > pageSize && (
        <nav className="wp-pager" aria-label="Pagination">
          <span aria-live="polite" className="muted">
            {from} to {to} of {total}
          </span>
          <div>
            <button type="button" className="wp-pager-btn" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
              Previous
            </button>
            <span className="muted">
              Page {pageIndex + 1} of {pageCount}
            </span>
            <button type="button" className="wp-pager-btn" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              Next
            </button>
          </div>
        </nav>
      )}
    </div>
  )
}
