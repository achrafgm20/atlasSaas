import { User, MapPin, Mail, Phone, Store, CheckCircle, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
// Types
interface Seller {
  name: string;
  email?: string;
}

interface Product {
  _id: string;
  seller?: Seller;
}

interface SellerData {
  Country: string;
  adresse: string;
  canReceiveTransfers: boolean;
  city: string;
  createdAt: string;
  email: string;
  lastStripeSync: string;
  name: string;
  phone: string;
  postalCode: string;
  role: string;
  statutCompte: boolean;
  storeDescription: string;
  storeName: string;
  stripeAccountId: string;
  stripeDetailsSubmitted: boolean;
  stripeOnboardingCompleted: boolean;
  stripeOnboardingUrl: string;
  transfersCapability: string;
  updatedAt: string;
}

interface ProfilSellerProps {
  product: Product;
}

export default function ProfilSeller({product}:ProfilSellerProps) {
    const [dataSeller, setDataSeller] = useState<SellerData | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetching = async () => {
            setLoading(true)
            try {
                const res = await fetch(`http://localhost:4000/api/product/getDetailsSeller/${product._id}`)
                const data = await res.json()
                setDataSeller(data)
            } catch (error) {
                console.error('Error fetching seller data:', error)
            } finally {
                setLoading(false)
            }
        }
        fetching()
    }, [product._id])

    return (
        <div className="mt-auto border-t border-gray-100 pt-5">
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">
                The profil of the seller 
            </p>
            <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                    <User size={24} />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                        {product.seller?.name || 'Unknown Seller'}
                    </h3>
                    <p className="text-sm text-gray-500">Verified Seller</p>
                </div>
                <div className="ml-auto">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="text-xs cursor-pointer">
                                View Profile
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle className="text-2xl">Seller Profile</DialogTitle>
                            </DialogHeader>
                            
                            {loading ? (
                                <div className="flex items-center justify-center py-8">
                                    <p className="text-gray-500">Loading seller information...</p>
                                </div>
                            ) : dataSeller ? (
                                <div className="space-y-6 py-4">
                                    {/* Profile Header */}
                                    <div className="flex items-start gap-4 pb-6 border-b">
                                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                                            <User size={32} />
                                        </div>
                                        <div className="flex-1">
                                            <h2 className="text-2xl font-bold text-gray-900">{dataSeller.name}</h2>
                                            <p className="text-sm text-gray-500 mt-1">
                                                Member since {new Date(dataSeller.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Store Information */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold flex items-center gap-2">
                                            <Store size={20} />
                                            Store Information
                                        </h3>
                                        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Store Name</p>
                                                <p className="text-base text-gray-900">{dataSeller.storeName}</p>
                                            </div>
                                            {dataSeller.storeDescription && (
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500">Description</p>
                                                    <p className="text-base text-gray-900">{dataSeller.storeDescription}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Contact Information */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold">Contact Information</h3>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                <Mail size={18} className="text-gray-400" />
                                                <span className="text-gray-900">{dataSeller.email}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Phone size={18} className="text-gray-400" />
                                                <span className="text-gray-900">{dataSeller.phone}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Location */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold flex items-center gap-2">
                                            <MapPin size={20} />
                                            Location
                                        </h3>
                                        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                                            <p className="text-gray-900">{dataSeller.adresse}</p>
                                            <p className="text-gray-900">{dataSeller.city}, {dataSeller.postalCode}</p>
                                            <p className="text-gray-900">{dataSeller.Country}</p>
                                        </div>
                                    </div>

                                    {/* Verification Status */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold">Verification Status</h3>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="flex items-center gap-2 bg-green-50 rounded-lg p-3">
                                                <CheckCircle size={18} className="text-green-600" />
                                                <span className="text-sm text-green-900">Stripe Verified</span>
                                            </div>
                                            <div className={`flex items-center gap-2 rounded-lg p-3 ${
                                                dataSeller.canReceiveTransfers ? 'bg-green-50' : 'bg-gray-50'
                                            }`}>
                                                {dataSeller.canReceiveTransfers ? (
                                                    <>
                                                        <CheckCircle size={18} className="text-green-600" />
                                                        <span className="text-sm text-green-900">Can Receive Payments</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <XCircle size={18} className="text-gray-400" />
                                                        <span className="text-sm text-gray-600">Payment Setup Pending</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center py-8">
                                    <p className="text-gray-500">Unable to load seller information</p>
                                </div>
                            )}
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>
    )
}