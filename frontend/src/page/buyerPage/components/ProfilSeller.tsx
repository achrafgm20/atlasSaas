import { User } from 'lucide-react'
import { Button } from '@/components/ui/button';

export default function ProfilSeller({product}) {
  return (
    <div className="mt-auto border-t border-gray-100 pt-5">
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">The profil of the seller </p>
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
                    <Button variant="outline" size="sm" className="text-xs cursor-pointer">View Profile</Button>
                </div>
              </div>
    </div>
  )
}
