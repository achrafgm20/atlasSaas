interface PRODUCT {
  _id: string;
  productName: string;
  images: { url: string }[];
  storage: string;
  color: string;
  condition: string;
  listingPrice: number;
  battery: string;
  seller: { _id: number; name: string };
}

type USER = {
  stripeDetailsSubmitted: boolean | undefined;
  phone: string;
  storeName: string;
  adresse: string;
  city: string;
  storeDescription: string;
  Country: string;
  postalCode: string;
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