'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Card,
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { FaUpload, FaTrash, FaSave, FaTimesCircle } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { uploadToCloudinary, isCloudinaryConfigured } from '@/lib/cloudinary';

// Component that uses useSearchParams
function AddVehicleForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [vehicle, setVehicle] = useState({
    type: 'car',
    make: '',
    model: '',
    year: '',
    price: '',
    mileage: '',
    color: '',
    vin: '',
    description: '',
    features: '',
    images: [],
    sold: false
  });

  // Check for type parameter in URL
  useEffect(() => {
    const typeParam = searchParams.get('type');
    if (typeParam === 'motorcycle' || typeParam === 'car') {
      setVehicle(prev => ({ ...prev, type: typeParam }));
    }
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVehicle(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name) => {
    console.log(`Checkbox ${name} changed. Current value:`, vehicle[name]);
    setVehicle(prev => {
      const newValue = !prev[name];
      console.log(`Setting ${name} to:`, newValue);
      return { ...prev, [name]: newValue };
    });
  };

  const handleSelectChange = (name, value) => {
    setVehicle(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    setIsUploading(true);
    
    try {
      const uploadPromises = files.map(async (file) => {
        try {
          const result = await uploadToCloudinary(file);
          return result.secure_url;
        } catch (error) {
          console.error(`Error uploading file ${file.name}:`, error);
          toast.error(`Failed to upload ${file.name}: ${error.message}`);
          return null;
        }
      });
      
      const uploadedUrls = (await Promise.all(uploadPromises)).filter(url => url !== null);
      
      setVehicle(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls]
      }));
      
      toast.success(`${uploadedUrls.length} images uploaded successfully`);
    } catch (error) {
      console.error('Image upload failed:', error);
      toast.error("Failed to upload images. Please try again.");
    } finally {
      setIsUploading(false);
      // Reset the file input
      e.target.value = '';
    }
  };

  const removeImage = (index) => {
    setVehicle(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!vehicle.make || !vehicle.model || !vehicle.price) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    // Create a copy of the vehicle data with explicit boolean typing for sold
    const vehicleData = {
      ...vehicle,
      sold: Boolean(vehicle.sold)
    };
    
    // Log the data being sent for debugging
    console.log('Submitting new vehicle with data:');
    console.log('- Make/Model:', vehicleData.make, vehicleData.model);
    console.log('- Sold status:', vehicleData.sold, typeof vehicleData.sold);
    console.log('- Full data:', vehicleData);

    try {
      const response = await fetch('/api/admin/vehicles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vehicleData),
      });

      // Get the raw response text
      const responseText = await response.text();
      console.log('Raw response:', responseText);
      
      // Try to parse the response as JSON
      let newVehicle;
      try {
        newVehicle = JSON.parse(responseText);
      } catch (err) {
        console.error('Failed to parse JSON response:', err);
        throw new Error(`Invalid response: ${responseText}`);
      }

      if (!response.ok) {
        throw new Error(newVehicle.error || 'Failed to add vehicle');
      }

      console.log('Vehicle added successfully:', newVehicle);
      console.log('Sold status on new vehicle:', newVehicle.sold);
      
      toast.success('Vehicle added successfully');
      router.push('/admin/vehicles');
    } catch (error) {
      console.error('Error adding vehicle:', error);
      toast.error(error.message || 'Failed to add vehicle');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Add New Vehicle</h1>
        <Button onClick={() => router.back()} variant="outline">
          <FaTimesCircle className="mr-2" /> Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Vehicle Information</CardTitle>
            <CardDescription>Enter all vehicle details and upload images</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type *</Label>
                <Select 
                  value={vehicle.type} 
                  onValueChange={(value) => handleSelectChange('type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="car">Car</SelectItem>
                    <SelectItem value="motorcycle">Motorcycle</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="make">Make *</Label>
                <Input 
                  id="make" 
                  name="make" 
                  value={vehicle.make} 
                  onChange={handleChange} 
                  placeholder="e.g. Honda, Ford" 
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="model">Model *</Label>
                <Input 
                  id="model" 
                  name="model" 
                  value={vehicle.model} 
                  onChange={handleChange} 
                  placeholder="e.g. Civic, F-150" 
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="year">Year *</Label>
                <Input 
                  id="year" 
                  name="year" 
                  type="number" 
                  value={vehicle.year} 
                  onChange={handleChange} 
                  placeholder="e.g. 2023" 
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price ($) *</Label>
                <Input 
                  id="price" 
                  name="price" 
                  type="number" 
                  value={vehicle.price} 
                  onChange={handleChange} 
                  placeholder="e.g. 15000" 
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mileage">Mileage (miles)</Label>
                <Input 
                  id="mileage" 
                  name="mileage" 
                  type="number" 
                  value={vehicle.mileage} 
                  onChange={handleChange} 
                  placeholder="e.g. 5000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <Input 
                  id="color" 
                  name="color" 
                  value={vehicle.color} 
                  onChange={handleChange} 
                  placeholder="e.g. Red, Black"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vin">VIN/Chassis Number</Label>
                <Input 
                  id="vin" 
                  name="vin" 
                  value={vehicle.vin} 
                  onChange={handleChange} 
                  placeholder="Vehicle Identification Number"
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-8 mt-4 border p-4 rounded-md bg-accent/20">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="sold"
                  checked={Boolean(vehicle.sold)}
                  onCheckedChange={(checked) => {
                    console.log("Sold checkbox changed to:", checked);
                    setVehicle(prev => ({
                      ...prev,
                      sold: Boolean(checked)
                    }));
                  }}
                />
                <div>
                  <Label htmlFor="sold" className="font-semibold text-destructive">
                    Sold {vehicle.sold ? '(Will be Marked as Sold)' : ''}
                  </Label>
                  <p className="text-xs text-muted-foreground">Mark as sold (will show SOLD badge)</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  value={vehicle.description} 
                  onChange={handleChange} 
                  placeholder="Detailed description of the vehicle"
                  rows={5}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="features">Features (one per line)</Label>
                <Textarea 
                  id="features" 
                  name="features" 
                  value={vehicle.features} 
                  onChange={handleChange} 
                  placeholder="ABS&#10;Power Steering&#10;AC&#10;etc."
                  rows={5}
                />
                <p className="text-sm text-muted-foreground">
                  Add each feature on a new line
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <div className="mb-6">
                <Label htmlFor="images" className="block mb-2">
                  Upload Images
                </Label>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    onClick={() => document.getElementById('images').click()}
                    disabled={isUploading}
                    variant="outline"
                  >
                    <FaUpload className="mr-2" /> 
                    {isUploading ? 'Uploading...' : 'Select Images'}
                  </Button>
                  <Input
                    id="images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <p className="text-sm text-muted-foreground">
                    You can select multiple images at once
                  </p>
                </div>
              </div>

              {vehicle.images.length > 0 && (
                <div>
                  <h3 className="font-medium mb-3">Uploaded Images</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {vehicle.images.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url}
                          alt={`Vehicle image ${index + 1}`}
                          className="h-40 w-full object-cover rounded-md"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeImage(index)}
                        >
                          <FaTrash />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 flex justify-end">
          <Button
            type="submit"
            className="w-full md:w-auto"
            disabled={isSubmitting}
          >
            <FaSave className="mr-2" /> 
            {isSubmitting ? 'Saving...' : 'Save Vehicle'}
          </Button>
        </div>
      </form>
    </div>
  );
}

// Loading component
function LoadingVehicleForm() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Add New Vehicle</h1>
        <div className="w-24 h-10 bg-gray-200 animate-pulse rounded-md"></div>
      </div>
      <div className="space-y-4">
        <div className="h-[600px] bg-gray-200 animate-pulse rounded-md"></div>
      </div>
    </div>
  );
}

// Main component with suspense
export default function AddVehiclePage() {
  return (
    <Suspense fallback={<LoadingVehicleForm />}>
      <AddVehicleForm />
    </Suspense>
  );
} 