import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Save, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { UseAuth } from "@/context/AuthContext";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  
   statutCompte?: boolean;
  stripeOnboardingUrl?: string;
  stripeAccountId?: string;
  stripeOnboardingCompleted?: boolean;
  canReceiveTransfers?: boolean;
  onboardingComplete?: boolean;
  transfersActive?: boolean;
  canReceiveMoney?: boolean
}

// Validation schema
const profileSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  storeName: z.string().min(2, "Store name must be at least 2 characters"),
  storeDescription: z.string().optional(),
  country: z.string().min(2, "Country is required"),
  city: z.string().min(2, "City is required"),
  postalCode: z.string().min(4, "Postal code is required"),
  street: z.string().min(5, "Street address is required"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function Settings() {
  const { fetchUser, user } = UseAuth();
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "John Seller",
      email: "john.seller@atlastech.com",
      phone: "+1 (555) 123-4567",
      storeName: "AtlasTech Electronics",
      storeDescription: "Premium smartphones and laptops.",
      country: "United States",
      city: "San Francisco",
      postalCode: "94102",
      street: "123 Commerce Street",
    },
  });

  useEffect(() => {
    const loadUser = async () => {
      setIsLoading(true);
      await fetchUser();
      setIsLoading(false);
    };
    loadUser();
  }, []);

  useEffect(() => {
    if (user) {
      console.log("User data:", user);
      console.log("Stripe URL:", user.stripeOnboardingUrl);
      console.log("Stripe Completed:", user.stripeOnboardingCompleted);
    }
  }, [user]);

  const onSubmit = async (data: ProfileFormValues) => {
    await new Promise((r) => setTimeout(r, 1000));
    console.log("Profile updated:", data);
  };

  const handleConnectStripe = () => {
    if (!user?.stripeOnboardingUrl) {
      console.error("No Stripe onboarding URL available");
      alert("Stripe onboarding URL is not available. Please contact support.");
      return;
    }

    console.log("Opening Stripe URL:", user.stripeOnboardingUrl);
    window.open(user.stripeOnboardingUrl, "_blank", "noopener,noreferrer");
  };

  // Determine if Stripe is connected based on API data
  const isStripeConnected = user?.stripeOnboardingCompleted && user?.stripeDetailsSubmitted;

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Form */}
        <div className="lg:col-span-2 border rounded-lg p-6 bg-white shadow">
          <h2 className="text-lg font-semibold mb-4">Seller Profile</h2>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {[
              { name: "fullName", label: "Full Name" },
              { name: "email", label: "Email" },
              { name: "phone", label: "Phone" },
              { name: "storeName", label: "Store Name" },
              { name: "street", label: "Street" },
              { name: "city", label: "City" },
              { name: "postalCode", label: "Postal Code" },
              { name: "country", label: "Country" },
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium">
                  {field.label}
                </label>
                <input
                  {...form.register(field.name as keyof ProfileFormValues)}
                  className="w-full border rounded px-3 py-2"
                />
                {form.formState.errors[field.name as keyof ProfileFormValues] && (
                  <p className="text-red-500 text-sm">
                    {
                      form.formState.errors[
                        field.name as keyof ProfileFormValues
                      ]?.message
                    }
                  </p>
                )}
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium">
                Store Description
              </label>
              <textarea
                {...form.register("storeDescription")}
                rows={4}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </form>
        </div>

        {/* Stripe Section */}
        <div className="border rounded-lg p-6 h-max bg-white shadow space-y-4">
          <h2 className="text-lg font-semibold">Stripe Connect</h2>

          {isStripeConnected ? (
            <div className="text-center space-y-2">
              <CheckCircle className="mx-auto text-green-500 h-12 w-12" />
              <p className="font-medium text-green-700">Account Connected</p>
              {user?.stripeAccountId && (
                <span className="text-xs font-mono border px-2 py-1 rounded bg-gray-50">
                  {user.stripeAccountId}
                </span>
              )}
              <p className="text-sm text-gray-600">
                You can now receive payments
              </p>
            </div>
          ) : (
            <div className="text-center space-y-2">
              <AlertCircle className="mx-auto text-yellow-500 h-12 w-12" />
              <p className="font-medium text-gray-700">Not Connected</p>
              <p className="text-sm text-gray-600">
                Connect your Stripe account to receive payments
              </p>
            </div>
          )}

          <button
            onClick={handleConnectStripe}
            disabled={!user?.stripeOnboardingUrl || isStripeConnected}
            className="w-full bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {isStripeConnected
              ? "Connected"
              : user?.stripeOnboardingUrl
              ? "Connect Stripe"
              : "Loading..."}
          </button>

          {/* Debug info - remove in production */}
          {process.env.NODE_ENV === 'development' && user && (
            <div className="mt-4 p-2 bg-gray-100 rounded text-xs">
              <p>Debug Info:</p>
              <p>Account ID: {user.stripeAccountId || 'None'}</p>
              <p>Onboarding Complete: {String(user.stripeOnboardingCompleted)}</p>
              <p>Details Submitted: {String(user.stripeDetailsSubmitted)}</p>
              <p>Can Receive: {String(user.canReceiveTransfers)}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}