"use client";

import React, { useState, useRef, useEffect } from "react";
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
import {Plus, Upload } from "lucide-react";
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
  images: [null, null, null] as (File | null)[]
};

export default function FormBtn() {
  const [open, setOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  // 1. Centralized State for all form information
  const [formData, setFormData] = useState(initialFormData);

  const [imagePreviews, setImagePreviews] = useState<(string | null)[]>([null, null, null]);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Handler for text inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Handler for shadcn Select components
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newImages = [...formData.images];
      newImages[index] = file;
      setFormData((prev) => ({ ...prev, images: newImages }));

      const reader = new FileReader();
      reader.onloadend = () => {
        const newPreviews = [...imagePreviews];
        newPreviews[index] = reader.result as string;
        setImagePreviews(newPreviews);
      };
      reader.readAsDataURL(file);
    }
  };

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setFormData(initialFormData);
      setImagePreviews([null, null, null]);
      fileInputRefs.current.forEach((ref) => {
        if (ref) ref.value = "";
      });
    }
  }, [open]);

  const capitalize = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);

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
  if (!token) return;

  try {
    const productData = new FormData();

    productData.append("productName", formData.productName);
    productData.append("battery", formData.battery); // e.g. "3200mAh"
    productData.append("category", capitalize(formData.category)); // Phone
    productData.append("color", formData.color);
    productData.append("condition", formatCondition(formData.condition)); // Brand New
    productData.append("costPrice", String(formData.costPrice));
    productData.append("listingPrice", String(formData.listingPrice));
    productData.append("description", formData.description);
    productData.append("status", capitalize(formData.status)); // Active
    productData.append("storage", formData.storage);

    // 👇 IMPORTANT: same key "images" repeated
    formData.images.forEach((image) => {
      if (image instanceof File) {
        productData.append("images", image);
      }
    });

    await axios.post(
      "http://localhost:4000/api/product/addProduct",
      productData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log("Product added successfully!");
    setShowAlert(true);
    setOpen(false);
    setTimeout(() => setShowAlert(false), 3000);
  } catch (error) {
    console.error("Error adding product:", error);
  }
};


  return (
    <>
    {showAlert && <div className="fixed top-5 right-5 z-50"><AlertDemo /></div>}
    <Dialog  open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-sky-500 hover:bg-sky-600 font-semibold cursor-pointer">
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Add Product</DialogTitle>
           <DialogDescription>Fill product details below</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          
          {/* Product Images (UI Placeholder) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Label className="text-xs font-bold uppercase tracking-wider">Main Image *(add 3 IMAGE)</Label>
              <div className="flex w-auto gap-3">
                {[0, 1, 2].map((index) => (
                  <div 
                    key={index}
                    onClick={() => fileInputRefs.current[index]?.click()}
                    className="mt-2 border-2 border-dashed rounded-xl h-24 w-24 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer relative overflow-hidden"
                  >
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      ref={(el) => { fileInputRefs.current[index] = el; }}
                      onChange={(e) => handleImageChange(index, e)}
                    />
                    {imagePreviews[index] ? (
                      <img src={imagePreviews[index]!} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <Upload className="h-6 w-6 text-slate-400 mb-2" />
                        <span className="text-[10px] text-slate-600 text-center">Upload</span>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

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
                <Select onValueChange={(v) => handleSelectChange("category", v)} required>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="phone">Phone</SelectItem>
                    <SelectItem value="laptop">Laptop</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Condition *</Label>
                <Select onValueChange={(v) => handleSelectChange("condition", v)} required>
                  <SelectTrigger><SelectValue placeholder="Select condition" /></SelectTrigger>
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
                <Select onValueChange={(v) => handleSelectChange("storage", v)} required>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
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
                  required
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
                <Input id="costPrice" type="number" placeholder="$ 0.00" onChange={handleInputChange} required/>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="listingPrice">Listing Price *</Label>
                <Input id="listingPrice" type="number" placeholder="$ 0.00" onChange={handleInputChange} required/>
              </div>
              <div className="grid gap-2">
                <Label>Status *</Label>
                <Select defaultValue="active" onValueChange={(v) => handleSelectChange("status", v)} required>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
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
              className="min-h-25"
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" className="bg-sky-500 hover:bg-sky-600 px-10">
              Add Product
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
    </>
  );
}