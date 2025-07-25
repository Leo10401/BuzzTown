"use client"
import React, { useEffect, useState } from 'react';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose
} from '@/components/ui/drawer';
import { ArrowUpDown, ChevronUp, ChevronDown, Search } from 'lucide-react';
import './styles.css';

function ManageProduct() {
  const [search, setSearch] = useState('');
  const [sortedData, setSortedData] = useState([]);
  const [sortBy, setSortBy] = useState(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [productList, setProductList] = useState([]);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const fetchProducts = () => {
    if (typeof window !== 'undefined') {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/getall`)
        .then((res) => res.json())
        .then(data => {
          setProductList(data);
          setSortedData(data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (!search) {
      setSortedData(productList);
    } else {
      const query = search.toLowerCase();
      setSortedData(productList.filter(product =>
        Object.values(product).some(val =>
          String(val).toLowerCase().includes(query)
        )
      ));
    }
  }, [search, productList]);

  const setSorting = (field) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    const sorted = [...sortedData].sort((a, b) => {
      if (reversed) {
        return String(b[field]).localeCompare(String(a[field]));
      }
      return String(a[field]).localeCompare(String(b[field]));
    });
    setSortedData(sorted);
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const deleteProduct = async (productId) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/delete/${productId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete product');
      }
      fetchProducts();
    } catch (error) {
      alert('Failed to delete product. Please try again.');
    }
  };

  return (
    <div>
      <Drawer open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Product Details</DrawerTitle>
            <DrawerClose />
          </DrawerHeader>
          {/* Drawer content */}
        </DrawerContent>
      </Drawer>
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold text-center mb-6">Manage Product</h1>
        <div className="mb-4 flex items-center gap-2">
          <Search className="w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by any field"
            value={search}
            onChange={handleSearchChange}
            className="max-w-sm"
          />
        </div>
        <ScrollArea className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead onClick={() => setSorting('title')} className="cursor-pointer select-none">
                  <span className="flex items-center gap-1">Image {sortBy === 'title' ? (reverseSortDirection ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />) : <ArrowUpDown className="w-4 h-4" />}</span>
                </TableHead>
                <TableHead onClick={() => setSorting('material')} className="cursor-pointer select-none">
                  <span className="flex items-center gap-1">Singer Name {sortBy === 'material' ? (reverseSortDirection ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />) : <ArrowUpDown className="w-4 h-4" />}</span>
                </TableHead>
                <TableHead onClick={() => setSorting('embroidery')} className="cursor-pointer select-none">
                  <span className="flex items-center gap-1">Location {sortBy === 'embroidery' ? (reverseSortDirection ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />) : <ArrowUpDown className="w-4 h-4" />}</span>
                </TableHead>
                <TableHead onClick={() => setSorting('gender')} className="cursor-pointer select-none">
                  <span className="flex items-center gap-1">Description {sortBy === 'gender' ? (reverseSortDirection ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />) : <ArrowUpDown className="w-4 h-4" />}</span>
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.length > 0 ? (
                sortedData.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell>
                      <img height={50} src={`${process.env.NEXT_PUBLIC_API_URL}/${product.image?.[0]}`} alt="" />
                    </TableCell>
                    <TableCell>{product.title}</TableCell>
                    <TableCell>{product.location}</TableCell>
                    <TableCell>{product.description}</TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        onClick={() => deleteProduct(product._id)}
                        className="btn btn-danger"
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">Nothing found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
    </div>
  );
}

export default ManageProduct;