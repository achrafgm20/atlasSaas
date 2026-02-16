import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
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
  SelectValue,
} from "@/components/ui/select";
import { Edit, Loader2, Plus, X, RefreshCw, ImageIcon } from "lucide-react";
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

const MAX_IMAGES = 3;

type ProductImage = {
  _id: string;
  url: string;
};

type EditProductProps = {
  productId: string;
  onProductUpdated: () => void;
  triggerElement?: React.ReactNode;
};

export default function EditProduct({
  productId,
  onProductUpdated,
  triggerElement,
}: EditProductProps) {
  const [open, setOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState(initialFormData);

  // Image states
  const [existingImages, setExistingImages] = useState<ProductImage[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [replacingImageId, setReplacingImageId] = useState<string | null>(null);
  const [replacingLoading, setReplacingLoading] = useState<string | null>(null);

  const newImageInputRef = useRef<HTMLInputElement>(null);
  const replaceImageInputRef = useRef<HTMLInputElement>(null);

  // ─── Total image count & remaining slots ───
  const totalImages = existingImages.length + newImages.length;
  const remainingSlots = MAX_IMAGES - totalImages;
  const canAddMore = remainingSlots > 0;

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

      if (product.images && Array.isArray(product.images)) {
        setExistingImages(product.images);
      }
    } catch (error) {
      console.error("Error fetching product data:", error);
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message || "Failed to fetch product data"
        );
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ─── New Image Handlers ───
  const handleNewImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files);

    // Only take as many files as remaining slots allow
    const allowedFiles = fileArray.slice(0, remainingSlots);

    if (fileArray.length > remainingSlots) {
      setError(
        `You can only add ${remainingSlots} more image${
          remainingSlots !== 1 ? "s" : ""
        }. Maximum ${MAX_IMAGES} images allowed.`
      );
      setTimeout(() => setError(null), 4000);
    }

    if (allowedFiles.length === 0) return;

    setNewImages((prev) => [...prev, ...allowedFiles]);

    allowedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });

    if (newImageInputRef.current) {
      newImageInputRef.current.value = "";
    }
  };

  const removeNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // ─── Replace Image Handlers ───
  const handleReplaceImageClick = (imageId: string) => {
    setReplacingImageId(imageId);
    setTimeout(() => {
      replaceImageInputRef.current?.click();
    }, 100);
  };

  const handleReplaceImageSelect = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file || !replacingImageId) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setError("No authentication token found");
      return;
    }

    setReplacingLoading(replacingImageId);
    setError(null);

    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);

      const response = await axios.patch(
        `http://localhost:4000/api/product/editImage/${productId}/${replacingImageId}`,
        formDataUpload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Image replaced successfully:", response.data);

      setExistingImages((prev) =>
        prev.map((img) =>
          img._id === replacingImageId
            ? {
                ...img,
                url:
                  response.data?.image?.url ||
                  response.data?.url ||
                  img.url + "?t=" + Date.now(),
              }
            : img
        )
      );

      if (!response.data?.image?.url && !response.data?.url) {
        await fetchProductData();
      }
    } catch (error) {
      console.error("Error replacing image:", error);
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message || "Failed to replace image"
        );
      } else {
        setError("An unexpected error occurred while replacing the image");
      }
    } finally {
      setReplacingLoading(null);
      setReplacingImageId(null);
      if (replaceImageInputRef.current) {
        replaceImageInputRef.current.value = "";
      }
    }
  };

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setFormData(initialFormData);
      setError(null);
      setExistingImages([]);
      setNewImages([]);
      setNewImagePreviews([]);
      setReplacingImageId(null);
      setReplacingLoading(null);
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
      const formDataToSend = new FormData();

      formDataToSend.append("productName", formData.productName);
      formDataToSend.append("battery", formData.battery);
      formDataToSend.append("category", capitalize(formData.category));
      formDataToSend.append("color", formData.color);
      formDataToSend.append("condition", formatCondition(formData.condition));
      formDataToSend.append("costPrice", formData.costPrice);
      formDataToSend.append("listingPrice", formData.listingPrice);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("status", capitalize(formData.status));
      formDataToSend.append("storage", formData.storage);

      newImages.forEach((file) => {
        formDataToSend.append("file", file);
      });

      console.log("Submitting form data with", newImages.length, "new images");

      const response = await axios.put(
        `http://localhost:4000/api/product/editProdut/${productId}`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
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
        const errorMessage =
          error.response?.data?.message ||
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

      {/* Hidden input for replacing images */}
      <input
        type="file"
        ref={replaceImageInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleReplaceImageSelect}
      />

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
            <DialogDescription>
              Update product details below
            </DialogDescription>
          </DialogHeader>

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
                <h3 className="font-semibold text-slate-900 border-b pb-1">
                  Basic Information
                </h3>

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
                <h3 className="font-semibold text-slate-900 border-b pb-1">
                  Pricing
                </h3>
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

              {/* ─── Images Section ─── */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-1">
                  <h3 className="font-semibold text-slate-900">
                    Product Images
                  </h3>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      totalImages >= MAX_IMAGES
                        ? "bg-amber-100 text-amber-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {totalImages} / {MAX_IMAGES}
                  </span>
                </div>

                {/* Existing Images */}
                {existingImages.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm text-slate-600">
                      Current Images (hover to replace)
                    </Label>
                    <div className="grid grid-cols-3 gap-3">
                      {existingImages.map((image) => (
                        <div
                          key={image._id}
                          className="relative group rounded-lg overflow-hidden border-2 border-slate-200 
                                     hover:border-sky-400 transition-colors"
                        >
                          <img
                            src={image.url}
                            alt="Product"
                            className="w-full h-32 object-cover"
                          />

                          {replacingLoading === image._id ? (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <Loader2 className="h-6 w-6 animate-spin text-white" />
                            </div>
                          ) : (
                            <div
                              className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 
                                          transition-opacity flex items-center justify-center cursor-pointer"
                              onClick={() =>
                                handleReplaceImageClick(image._id)
                              }
                            >
                              <div className="text-center text-white">
                                <RefreshCw className="h-5 w-5 mx-auto mb-1" />
                                <span className="text-xs font-medium">
                                  Replace
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* New Images to Add */}
                <div className="space-y-2">
                  <Label className="text-sm text-slate-600">
                    Add New Images
                    {!canAddMore && existingImages.length > 0 && (
                      <span className="ml-2 text-amber-600 font-normal">
                        — Maximum {MAX_IMAGES} images reached. Replace an
                        existing image instead.
                      </span>
                    )}
                  </Label>
                  <div className="grid grid-cols-3 gap-3">
                    {/* Preview new images */}
                    {newImagePreviews.map((preview, index) => (
                      <div
                        key={index}
                        className="relative rounded-lg overflow-hidden border-2 border-green-300"
                      >
                        <img
                          src={preview}
                          alt={`New ${index + 1}`}
                          className="w-full h-32 object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeNewImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5
                                     hover:bg-red-600 transition-colors"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                        <div
                          className="absolute bottom-0 left-0 right-0 bg-green-500/80 text-white 
                                      text-[10px] text-center py-0.5"
                        >
                          NEW
                        </div>
                      </div>
                    ))}

                    {/* Add image button — only show if under limit */}
                    {canAddMore && (
                      <label
                        className="flex flex-col items-center justify-center h-32 border-2 border-dashed 
                                     border-slate-300 rounded-lg cursor-pointer hover:border-sky-400 
                                     hover:bg-sky-50 transition-colors"
                      >
                        <Plus className="h-6 w-6 text-slate-400" />
                        <span className="text-xs text-slate-400 mt-1">
                          Add Image
                        </span>
                        <span className="text-[10px] text-slate-300 mt-0.5">
                          {remainingSlots} slot{remainingSlots !== 1 ? "s" : ""}{" "}
                          left
                        </span>
                        <input
                          type="file"
                          ref={newImageInputRef}
                          className="hidden"
                          accept="image/*"
                          multiple
                          onChange={handleNewImageSelect}
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* No images at all */}
                {existingImages.length === 0 &&
                  newImagePreviews.length === 0 && (
                    <div className="flex flex-col items-center py-6 text-slate-400">
                      <ImageIcon className="h-10 w-10 mb-2" />
                      <p className="text-sm">No images yet</p>
                    </div>
                  )}
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