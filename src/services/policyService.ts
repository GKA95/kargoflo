import { apiClient } from './apiClient';
import type { ApiResponse, PolicyDocument } from '../types';

export const defaultPolicies: Record<string, PolicyDocument> = {
  privacy: {
    id: 'pol_privacy',
    slug: 'privacy-policy',
    title: 'Privacy Policy',
    version: '1.2.0',
    lastUpdated: 'November 2026',
    complianceNotes: 'Compliant with Republic of Ghana Data Protection Act, 2012 (Act 843)',
    content: `
# Privacy Policy & Data Protection Notice

### 1. Statutory Compliance
This Privacy Policy outlines how [BUSINESS_LEGAL_NAME] ("we", "our", or "the Platform") collects, processes, and protects your personal data in accordance with the **Republic of Ghana Data Protection Act, 2012 (Act 843)** and relevant National Communications Authority (NCA) regulations.

### 2. Information We Collect
- **Identity Information**: Full name, Ghana Card / National ID (for verified couriers), phone number, email address.
- **Location Data**: Precise pickup and destination GPS coordinates, Ghana Post GPS digital address codes (e.g., GA-183-9024), and live transit coordinates during active fulfillment.
- **Transactional Records**: Order references, parcel category descriptions, declared handling instructions, and proof-of-delivery signatures or receipt confirmations.
- **Payment Information**: Transaction reference codes generated via licensed payment gateways (Paystack, MTN MoMo, Telecel Cash, AT Money). We do not store full payment card details or mobile money PINs.

### 3. Purpose of Processing
Your data is processed strictly for:
- Dispatching, executing, and confirming courier delivery services.
- Verifying the background and statutory suitability of dispatch riders.
- Generating electronic receipts and resolving delivery claims or complaints.
- Complying with statutory reporting requirements under Act 843.

### 4. Data Retention & Safeguards
Personal data is retained only for the duration required to fulfill delivery obligations and legal audit duties. All transit communications are protected by TLS 1.3 encryption.

### 5. Data Subject Rights Under Act 843
As a data subject in Ghana, you are entitled to:
- Request access to your personal data.
- Request rectification of inaccurate or outdated records.
- Object to unauthorized processing or direct marketing.

For data protection inquiries or to reach our designated Data Protection Supervisor:
- **Email**: [DATA_PROTECTION_EMAIL_PLACEHOLDER]
- **Office**: [BUSINESS_OFFICE_ADDRESS_PLACEHOLDER], Accra, Ghana
    `.trim(),
  },
  terms: {
    id: 'pol_terms',
    slug: 'terms-and-conditions',
    title: 'Terms and Conditions',
    version: '1.1.0',
    lastUpdated: 'November 2026',
    complianceNotes: 'Regulated Logistics Dispatch Agreement under Ghanaian Commercial Law',
    content: `
# Terms of Service & Courier Conditions

### 1. Scope of Service
[BUSINESS_LEGAL_NAME] provides an on-demand courier and delivery orchestration platform connecting customers with vetted dispatch riders across designated delivery zones in Ghana.

### 2. Prohibited & Restricted Items
Customers agree not to dispatch any of the following items:
- Illegal narcotics, controlled substances, or unlicensed pharmaceutical products.
- Firearms, explosives, corrosive chemicals, or hazardous flammable materials.
- Unregistered bullion, cash, counterfeit currency, or stolen property.
- Any item prohibited by the Criminal Offences Act, 1960 (Act 29) or Customs regulations of Ghana.

### 3. Pricing, Quotes & Surcharges
- Delivery pricing is determined based on base distance, parcel size category, and chosen speed (Standard, Express, Same-Day).
- Final charges are calculated prior to confirmation and charged in Ghana Cedis (GH₵).
- Additional waiting fees may apply if the pickup or delivery recipient fails to appear within the grace period.

### 4. Rider Verification & Delivery Liability
All registered riders undergo document verification. In the event of documented transit damage or loss arising from proven courier negligence, claims must be lodged through the customer portal within 24 hours of scheduled completion.

### 5. Dispute Resolution
These Terms are governed by the laws of the Republic of Ghana. Any disputes shall be submitted to mediation in Accra prior to any formal legal proceedings.
    `.trim(),
  },
  payment: {
    id: 'pol_payment',
    slug: 'payment-policy',
    title: 'Payment Policy',
    version: '1.0.0',
    lastUpdated: 'November 2026',
    complianceNotes: 'Integrated with Bank of Ghana regulated payment service providers (Paystack)',
    content: `
# Payment Policy & Accepted Channels

### 1. Currency
All delivery fees, express surcharges, and service charges are denominated and billed in **Ghanaian Cedis (GH₵)**.

### 2. Accepted Payment Channels
Transactions are processed securely through licensed Payment Service Providers (including Paystack):
- **MTN Mobile Money (MoMo)**
- **Telecel Cash**
- **AT Money**
- **Visa & Mastercard debit / credit cards issued by licensed banks**

### 3. Payment Timing
- Standard deliveries require upfront payment confirmation before a rider is dispatched.
- For verified corporate accounts, invoicing terms may be configured via administrative agreement.

### 4. Security & Non-Storage of Financial Credentials
Our platform adheres to PCI-DSS standards via gateway tokenization. Your Mobile Money PIN or card security digits (CVV) are never processed or retained on our application servers.
    `.trim(),
  },
  refund: {
    id: 'pol_refund',
    slug: 'refund-policy',
    title: 'Refund and Cancellation Policy',
    version: '1.0.0',
    lastUpdated: 'November 2026',
    complianceNotes: 'Customer Protection & Service Fair Use Guidelines',
    content: `
# Refund & Order Cancellation Policy

### 1. Cancellation Before Rider Assignment
- If an order is cancelled by the customer prior to rider acceptance, a 100% refund of the delivery fee will be processed to the original payment channel.

### 2. Cancellation After Rider Dispatch
- If an order is cancelled after a rider has been assigned and traveled to the pickup location, a partial administrative and mobilization fee may be deducted.

### 3. Undeliverable Packages
- If the recipient cannot be contacted at the delivery address and all secondary contact attempts fail, the parcel will be safely returned to the sender. A return transit fee may apply.

### 4. Requesting a Refund
Refund requests can be submitted directly through the Customer Portal with the order tracking reference and relevant explanation. Administrative decisions are communicated within 24–48 business hours.
    `.trim(),
  },
  cookie: {
    id: 'pol_cookie',
    slug: 'cookie-policy',
    title: 'Cookie Policy',
    version: '1.0.0',
    lastUpdated: 'November 2026',
    complianceNotes: 'Transparent Data Tracking Compliance under Act 843',
    content: `
# Cookie & Storage Policy

### 1. What Are Cookies?
Cookies and browser storage mechanisms are small data files placed on your device to keep you securely signed in, preserve user interface preferences, and ensure application responsiveness.

### 2. Types of Cookies We Use
- **Strictly Essential**: Required for secure authentication sessions, CSRF protection, and role-based access routing.
- **Functional**: Retaining preferred dispatch view layouts and filter criteria.
- **Analytics (Optional)**: Aggregated performance metrics to improve route efficiency. We do not sell user data.

### 3. User Controls
You can manage or withdraw consent for non-essential cookies at any time via the Cookie Preferences link in the website footer.
    `.trim(),
  },
};

export const policyService = {
  async getPolicy(slug: string): Promise<ApiResponse<PolicyDocument>> {
    try {
      return await apiClient.get<ApiResponse<PolicyDocument>>(`/policies/${slug}`);
    } catch {
      // Return default template with compliance notes
      const matched = Object.values(defaultPolicies).find((p) => p.slug === slug);
      if (matched) {
        return { success: true, data: matched };
      }
      throw new Error(`Policy document not found for slug: ${slug}`);
    }
  },

  async updatePolicy(id: string, content: string, version: string): Promise<ApiResponse<PolicyDocument>> {
    return apiClient.put<ApiResponse<PolicyDocument>>(`/admin/policies/${id}`, { content, version });
  },
};
