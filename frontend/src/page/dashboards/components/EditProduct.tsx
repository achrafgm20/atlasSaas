"use client";

import React, { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogDescription,
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Edit, Loader2 } from "lucide-react";
import axios from "axios";
import { AlertDemo } from "./AlertForm";

const initialFormData = {
  productName: "",
  category: "",
  condition: "",
  color: "",
  storage: "",
  battery: "",
  costPrice: "",
  listingPrice: "",
  status: "active",
  description: "",
};

type EditProductProps = {
  productId: string;
  onProductUpdated: () => void;
  triggerElement?: React.ReactNode;
};

export default function EditProduct({ productId, onProductUpdated, triggerElement }: EditProductProps) {
  const [open, setOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState(initialFormData);

  // Fetch existing product data when dialog opens
  useEffect(() => {
    if (open && productId) {
      fetchProductData();
    }
  }, [open, productId]);

  const fetchProductData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No authentication token found");
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(
        `http://localhost:4000/api/product/getProductDetails/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const product = response.data;
      console.log("Fetched product data:", product);
      
      setFormData({
        productName: product.productName || "",
        category: parseCategory(product.category),
        condition: parseCondition(product.condition),
        color: product.color || "",
        storage: product.storage || "",
        battery: product.battery || "",
        costPrice: product.costPrice?.toString() || "",
        listingPrice: product.listingPrice?.toString() || "",
        status: parseStatus(product.status),
        description: product.description || "",
      });

    } catch (error) {
      console.error("Error fetching product data:", error);
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "Failed to fetch product data");
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  // Helper functions to parse values back to select values
  const parseCategory = (value: string) => {
    if (!value) return "";
    return value.toLowerCase();
  };

  const parseCondition = (value: string) => {
    if (!value) return "";
    if (value === "Brand New") return "new";
    if (value === "Grade A") return "grade-a";
    if (value === "Grade B") return "grade-b";
    if (value === "Fair") return "fair";
    return value.toLowerCase();
  };

  const parseStatus = (value: string) => {
    if (!value) return "active";
    return value.toLowerCase();
  };

  // Handler for text inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Handler for Select components
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setFormData(initialFormData);
      setError(null);
    }
  }, [open]);

  const capitalize = (value: string) => {
    if (!value) return "";
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  const formatCondition = (value: string) => {
    if (value === "new") return "Brand New";
    if (value === "grade-a") return "Grade A";
    if (value === "grade-b") return "Grade B";
    if (value === "fair") return "Fair";
    return value;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      setError("No authentication token found. Please login again.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // Send as JSON object (no images)
      const productData = {
        productName: formData.productName,
        battery: formData.battery,
        category: capitalize(formData.category),
        color: formData.color,
        condition: formatCondition(formData.condition),
        costPrice: Number(formData.costPrice),
        listingPrice: Number(formData.listingPrice),
        description: formData.description,
        status: capitalize(formData.status),
        storage: formData.storage,
      };

      console.log("Submitting data:", productData);

      const response = await axios.put(
        `http://localhost:4000/api/product/editProdut/${productId}`,
        productData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log("Product updated successfully!", response.data);
      onProductUpdated();

      setShowAlert(true);
      setOpen(false);
      
      setTimeout(() => setShowAlert(false), 3000);
    } catch (error) {
      console.error("Error updating product:", error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 
                            error.response?.data?.error || 
                            `Error ${error.response?.status}: ${error.response?.statusText}` ||
                            error.message;
        setError(errorMessage);
      } else {
        setError("An unexpected error occurred while updating the product");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {showAlert && (
        <div className="fixed top-5 right-5 z-50">
          <AlertDemo />
        </div>
      )}
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {triggerElement || (
            <Button variant="outline" size="sm" className="hover:bg-sky-50">
              <Edit className="h-4 w-4" />
            </Button>
          )}
        </DialogTrigger>

        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Edit Product</DialogTitle>
            <DialogDescription>Update product details below</DialogDescription>
          </DialogHeader>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-10 w-10 animate-spin text-sky-500 mb-4" />
              <p className="text-slate-500">Loading product data...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 pt-4">

              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-900 border-b pb-1">Basic Information</h3>
                
                <div className="grid gap-2">
                  <Label htmlFor="productName">Product Name *</Label>
                  <Input 
                    id="productName" 
                    placeholder="e.g., iPhone 15 Pro Max" 
                    value={formData.productName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Category *</Label>
                    <Select 
                      value={formData.category} 
                      onValueChange={(v) => handleSelectChange("category", v)} 
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="phone">Phone</SelectItem>
                        <SelectItem value="laptop">Laptop</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Condition *</Label>
                    <Select 
                      value={formData.condition} 
                      onValueChange={(v) => handleSelectChange("condition", v)} 
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">Brand New</SelectItem>
                        <SelectItem value="grade-a">Grade A</SelectItem>
                        <SelectItem value="grade-b">Grade B</SelectItem>
                        <SelectItem value="fair">Fair</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="color">Color *</Label>
                    <Input 
                      id="color" 
                      placeholder="e.g., Titanium" 
                      value={formData.color}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Storage *</Label>
                    <Select 
                      value={formData.storage} 
                      onValueChange={(v) => handleSelectChange("storage", v)} 
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="64GB">64GB</SelectItem>
                        <SelectItem value="128GB">128GB</SelectItem>
                        <SelectItem value="256GB">256GB</SelectItem>
                        <SelectItem value="512GB">512GB</SelectItem>
                        <SelectItem value="1TB">1TB</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="battery">Battery Health</Label>
                    <Input 
                      id="battery" 
                      placeholder="e.g., 98%" 
                      value={formData.battery}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-900 border-b pb-1">Pricing</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="costPrice">Cost Price *</Label>
                    <Input 
                      id="costPrice" 
                      type="number" 
                      placeholder="0.00" 
                      value={formData.costPrice}
                      onChange={handleInputChange} 
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="listingPrice">Listing Price *</Label>
                    <Input 
                      id="listingPrice" 
                      type="number" 
                      placeholder="0.00" 
                      value={formData.listingPrice}
                      onChange={handleInputChange} 
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Status *</Label>
                    <Select 
                      value={formData.status} 
                      onValueChange={(v) => handleSelectChange("status", v)} 
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="sold">Sold</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="grid gap-2">
                <Label htmlFor="description">Product Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Describe features, accessories, and condition..." 
                  className="min-h-[100px]"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setOpen(false)}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-sky-500 hover:bg-sky-600 px-10"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Product"
                  )}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}