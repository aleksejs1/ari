import {
    type ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { Edit, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { type Contact } from "@/types/models"


interface ContactsTableProps {
    data: Contact[]
    onEdit: (contact: Contact) => void
    onDelete: (contact: Contact) => void
}

export function ContactsTable({ data, onEdit, onDelete }: ContactsTableProps) {
    const columns: ColumnDef<Contact>[] = [
        {
            accessorKey: "contactNames",
            header: "Name",
            cell: ({ row }) => {
                const names = row.original.contactNames || []
                return (
                    <div className="flex flex-col">
                        {names.map((name, i) => (
                            <span key={i} className="font-medium">
                                {name.given} {name.family}
                            </span>
                        ))}
                    </div>
                )
            },
        },
        {
            accessorKey: "contactDates",
            header: "Important Dates",
            cell: ({ row }) => {
                const dates = row.original.contactDates || []
                return (
                    <div className="flex flex-col text-sm text-gray-500">
                        {dates.map((date, i) => (
                            <span key={i}>
                                {date.date ? new Date(date.date).toLocaleDateString() : 'No Date'} ({date.text ?? 'No Label'})
                            </span>
                        ))}
                    </div>
                )
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                return (
                    <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => onEdit(row.original)}>
                            <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => onDelete(row.original)}>
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                )
            },
        },
    ]

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                )
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
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
    )
}
