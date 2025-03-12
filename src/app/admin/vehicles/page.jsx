'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Card,
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaFileCsv } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

export default function VehiclesPage() {
  const router = useRouter();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [vehicleType, setVehicleType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Fetch vehicles
  const fetchVehicles = async () => {
    setLoading(true);
    try {
      let url = `/api/admin/vehicles?page=${currentPage}`;
      
      if (vehicleType && vehicleType !== 'all') {
        url += `&type=${vehicleType}`;
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch vehicles');
      }
      
      const data = await response.json();
      setVehicles(data.vehicles);
      setTotalPages(data.pagination.pages);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      toast.error('Failed to load vehicles');
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchVehicles();
  }, [currentPage, vehicleType]);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    // Reset to first page when searching
    setCurrentPage(1);
    fetchVehicles();
  };

  // Handle delete
  const handleDelete = async () => {
    if (!selectedVehicle) return;
    
    try {
      const response = await fetch(`/api/admin/vehicles/${selectedVehicle._id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete vehicle');
      }
      
      toast.success('Vehicle deleted successfully');
      fetchVehicles();
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      toast.error('Failed to delete vehicle');
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedVehicle(null);
    }
  };

  // Export to CSV
  const exportToCSV = () => {
    // Only proceed if there are vehicles
    if (vehicles.length === 0) {
      toast.error('No vehicles to export');
      return;
    }

    // Define fields to include in CSV
    const fields = [
      'type', 'make', 'model', 'year', 'price', 'mileage', 
      'color', 'vin', 'sold'
    ];
    
    // Create CSV header row
    const csvHeader = fields.join(',');
    
    // Create CSV data rows
    const csvRows = vehicles.map(vehicle => {
      return fields.map(field => {
        let value = vehicle[field];
        // Handle boolean values
        if (typeof value === 'boolean') {
          return value ? 'Yes' : 'No';
        }
        // Handle strings with commas
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value}"`;
        }
        return value || '';
      }).join(',');
    });
    
    // Combine header and rows
    const csvContent = [csvHeader, ...csvRows].join('\n');
    
    // Create blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'vehicles.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Exported vehicles to CSV');
  };

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-xl font-bold dark:text-gray-100">Vehicles Management</h1>
        <div className="flex flex-wrap gap-2">
          <Button asChild size="sm">
            <Link href="/admin/vehicles/new">
              <FaPlus className="mr-2" /> Add Vehicle
            </Link>
          </Button>
          <Button size="sm" variant="outline" onClick={exportToCSV} className="dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700">
            <FaFileCsv className="mr-2" /> Export CSV
          </Button>
        </div>
      </div>

      {/* Search & Filter */}
      <Card className="glass-card dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="dark:text-gray-100">Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by make, model, or VIN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
              />
            </div>
            <div className="w-full sm:w-48">
              <Select value={vehicleType} onValueChange={setVehicleType}>
                <SelectTrigger className="dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">
                  <SelectValue placeholder="Vehicle Type" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="car">Cars</SelectItem>
                  <SelectItem value="motorcycle">Motorcycles</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit">
              <FaSearch className="mr-2" /> Search
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Vehicles List */}
      <Card className="glass-card dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="dark:text-gray-100">Vehicles ({vehicles.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 text-center dark:text-gray-300">
              <p>Loading vehicles...</p>
            </div>
          ) : vehicles.length === 0 ? (
            <div className="py-8 text-center dark:text-gray-300">
              <p>No vehicles found. Add a new vehicle to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="dark:border-gray-700">
                    <TableHead className="w-[80px] dark:text-gray-300">ID</TableHead>
                    <TableHead className="dark:text-gray-300">Vehicle</TableHead>
                    <TableHead className="dark:text-gray-300">Type</TableHead>
                    <TableHead className="dark:text-gray-300">Price</TableHead>
                    <TableHead className="dark:text-gray-300">Status</TableHead>
                    <TableHead className="text-right dark:text-gray-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vehicles.map((vehicle) => (
                    <TableRow key={vehicle._id} className="dark:border-gray-700 dark:hover:bg-gray-700/50">
                      <TableCell className="font-medium dark:text-gray-300">
                        {vehicle._id.substring(0, 6)}...
                      </TableCell>
                      <TableCell className="dark:text-gray-200">
                        <div>
                          <p className="font-medium">{vehicle.year} {vehicle.make} {vehicle.model}</p>
                          <p className="text-sm text-muted-foreground dark:text-gray-400">
                            {vehicle.mileage.toLocaleString()} miles | {vehicle.color}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="dark:text-gray-300">
                        <Badge variant={vehicle.type === 'car' ? 'default' : 'secondary'} className="capitalize">
                          {vehicle.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="dark:text-gray-300">{formatCurrency(vehicle.price)}</TableCell>
                      <TableCell>
                        {vehicle.sold ? (
                          <Badge variant="destructive">Sold</Badge>
                        ) : vehicle.featured ? (
                          <Badge variant="success">Featured</Badge>
                        ) : (
                          <Badge variant="outline" className="dark:border-gray-600 dark:text-gray-300">Available</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push(`/admin/vehicles/edit/${vehicle._id}`)}
                            className="dark:text-gray-300 dark:hover:bg-gray-700"
                          >
                            <FaEdit />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive dark:text-red-400 dark:hover:bg-gray-700"
                            onClick={() => {
                              setSelectedVehicle(vehicle);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            <FaTrash />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      className={`cursor-pointer dark:text-gray-300 dark:hover:bg-gray-700 ${currentPage === 1 ? 'pointer-events-none opacity-50' : ''}`}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={page === currentPage}
                        className="cursor-pointer dark:text-gray-300 dark:hover:bg-gray-700"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      className={`cursor-pointer dark:text-gray-300 dark:hover:bg-gray-700 ${currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}`}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="dark:bg-gray-800 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="dark:text-gray-100">Confirm Deletion</DialogTitle>
            <DialogDescription className="dark:text-gray-300">
              Are you sure you want to delete the {selectedVehicle?.year} {selectedVehicle?.make} {selectedVehicle?.model}? 
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
              className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 