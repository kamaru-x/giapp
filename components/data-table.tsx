"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

const MOBILE_EXCLUDED_IDS = ["slNo"]

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <>
      {/* ── Desktop: normal table ── */}
      <div className="hidden md:block overflow-hidden rounded-md border">
        <Table>
          <TableHeader className="bg-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-center h-10 font-medium">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="text-center"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-2">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* ── Mobile: card list ── */}
      <div className="flex md:hidden flex-col gap-3">
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => {
            const allCells = row.getVisibleCells()

            const actionCell = allCells.find((c) => c.column.id === "actions")

            const contentCells = allCells.filter(
              (c) => ![...MOBILE_EXCLUDED_IDS, "actions"].includes(c.column.id)
            )

            const getLabel = (columnId: string) => {
              const header = table
                .getHeaderGroups()[0]
                .headers.find((h) => h.id === columnId)
              if (!header || header.isPlaceholder) return null
              return flexRender(header.column.columnDef.header, header.getContext())
            }

            return (
              <div
                key={row.id}
                className="rounded-md border bg-card text-card-foreground shadow-sm overflow-hidden"
              >
                <div className="p-4 flex flex-col gap-2">
                  {contentCells.map((cell) => {
                    const label = getLabel(cell.column.id)
                    return (
                      <div key={cell.id} className="flex items-start justify-between gap-2 text-sm">
                        {label && (
                          <span className="font-medium text-muted-foreground shrink-0 min-w-20">
                            {label}
                          </span>
                        )}
                        <span className="text-right wrap-break-word">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </span>
                      </div>
                    )
                  })}
                  {actionCell && (
                    <div className="border-t pt-2.5 mt-1 flex justify-end">
                      {flexRender(actionCell.column.columnDef.cell, actionCell.getContext())}
                    </div>
                  )}
                </div>
              </div>
            )
          })
        ) : (
          <div className="rounded-md border p-8 text-center text-sm text-muted-foreground">
            No results.
          </div>
        )}
      </div>
    </>
  )
}