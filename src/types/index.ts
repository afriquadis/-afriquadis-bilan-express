export interface Symptom { id: string; name: string; category: string; }
export interface Advice { alimentation: string; hygiene: string; repos: string; hydratation: string; activite_physique: string; }

export interface Product {
  id: string;
  name: string;
  description: string;
  price?: string;
  rating?: number;
  reviews?: number;
}

export interface PathologyProductRecommendation {
  product_id: string;
  dosage: string; // ex: 2 gélules
  frequency: string; // ex: 2x/jour
  duration: string; // ex: 7 jours
  notes?: string; // précisions, contre-indications
}

export interface Pathology {
  id: string;
  name: string;
  symptoms: string[];
  product_kit_id: string;
  advice: Advice;
  recommended_products?: PathologyProductRecommendation[];
}

export interface ProductKit { id: string; name: string; description: string; order_link: string; components?: string[]; }

export interface Database { symptoms: Symptom[]; pathologies: Pathology[]; products?: Product[]; product_kits: ProductKit[]; }

// Nouveaux types pour la gestion des utilisateurs
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  createdAt: Date;
  lastLogin: Date;
  preferences: UserPreferences;
}

export interface UserPreferences {
  notifications: boolean;
  emailUpdates: boolean;
  language: 'fr' | 'en';
  theme: 'light' | 'dark';
}

export interface DiagnosticSession {
  id: string;
  userId?: string; // Optionnel pour les utilisateurs invités
  symptoms: SymptomWithIntensity[];
  results: DiagnosticResult[];
  createdAt: Date;
  completed: boolean;
}

export interface SymptomWithIntensity {
  symptomId: string;
  intensity: number; // 1-10
}

export interface DiagnosticResult {
  pathology: Pathology;
  score: number;
  confidence: 'low' | 'medium' | 'high';
}

export interface UserBilan {
  id: string;
  userId: string;
  diagnosticSessionId: string;
  pathologyId: string;
  productKitId: string;
  followUpDate?: Date;
  completed: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Types pour l'administration
export interface AdminUser extends User {
  role: 'admin' | 'moderator' | 'conseiller';
  permissions: string[];
}

export interface Analytics {
  totalDiagnostics: number;
  totalUsers: number;
  popularPathologies: Array<{
    pathologyId: string;
    count: number;
    percentage: number;
  }>;
  conversionRate: number;
  averageSessionDuration: number;
}

// Types pour le dashboard patient (Commandes et Messages)
export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price?: string; // prix au format texte pour cohérence avec les données
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total?: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
  trackingCode?: string;
}

export interface Message {
  id: string;
  userId: string;
  from: 'patient' | 'conseiller';
  content: string;
  timestamp: Date;
}

// Panier
export interface CartItem {
  productId: string;
  name: string;
  quantity: number;
  price?: string;
}
