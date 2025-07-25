'use client';
import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from '@/components/ui/button';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/getall`);
      const data = await response.json();
      setUsers(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/delete/${selectedUser._id}`, {
        method: 'DELETE',
      });
      fetchUsers();
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="flex gap-2">
        <Button 
          variant="destructive" 
          onClick={() => {
            setSelectedUser(rowData);
            setDeleteDialogOpen(true);
          }}
        >
          Delete
        </Button>
      </div>
    );
  };

  const dateBodyTemplate = (rowData) => {
    return new Date(rowData.createdAt).toLocaleDateString();
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Manage Users</h1>

      <DataTable 
        value={users} 
        loading={loading}
        paginator 
        rows={10} 
        className="p-datatable-striped"
      >
        <Column field="name" header="Name" sortable />
        <Column field="email" header="Email" sortable />
        <Column field="role" header="Role" sortable />
        <Column field="createdAt" header="Joined Date" body={dateBodyTemplate} sortable />
        <Column body={actionBodyTemplate} header="Actions" style={{ width: '10%' }} />
      </DataTable>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user
              account and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ManageUsers;
