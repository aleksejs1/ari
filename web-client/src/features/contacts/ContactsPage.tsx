import { Plus } from "lucide-react"
import { useState } from "react"

import { ContactSheet } from "./components/ContactSheet"
import { ContactsTable } from "./components/ContactsTable"
import { useContacts, useDeleteContact } from "./useContacts"

import { Button } from "@/components/ui/button"
import { type Contact } from "@/types/models"

export default function ContactsPage() {
    const [page, setPage] = useState(1)
    const { data, isLoading, isError } = useContacts(page)
    const deleteMutation = useDeleteContact()

    const [isSheetOpen, setIsSheetOpen] = useState(false)
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null)

    const handleCreate = () => {
        setSelectedContact(null)
        setIsSheetOpen(true)
    }

    const handleEdit = (contact: Contact) => {
        setSelectedContact(contact)
        setIsSheetOpen(true)
    }

    const handleDelete = async (contact: Contact) => {
        if (confirm("Are you sure you want to delete this contact?")) {
            // contact["@id"] is expected to be present
            if (contact["@id"]) {
                await deleteMutation.mutateAsync(contact["@id"])
            }
        }
    }

    if (isLoading) return <div>Loading contacts...</div>
    if (isError) return <div>Error loading contacts.</div>

    const contacts = Array.isArray(data) ? data : (data?.["hydra:member"] ?? data?.member ?? [])
    const view = Array.isArray(data) ? undefined : (data?.["hydra:view"] ?? data?.view)

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Contacts</h2>
                    <p className="text-muted-foreground">Manage your contacts list.</p>
                </div>
                <Button onClick={handleCreate}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Contact
                </Button>
            </div>

            <ContactsTable
                data={contacts}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <div className="flex justify-end gap-2">
                <Button
                    variant="outline"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={!view?.["hydra:previous"]}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    onClick={() => setPage(p => p + 1)}
                    disabled={!view?.["hydra:next"]}
                >
                    Next
                </Button>
            </div>

            <ContactSheet
                isOpen={isSheetOpen}
                onClose={() => setIsSheetOpen(false)}
                contact={selectedContact}
            />
        </div>
    )
}
