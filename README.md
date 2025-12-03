# FPS-Stable: Cross-Border Remittance Service Prototype

Website : [fps-stable.netlify.app](https://fps-stable.netlify.app/)

## Overview

**FPS-Stable** is a cutting-edge cross-border remittance platform that leverages Hong Kong's Fast Payment System (FPS), HKMA-compliant stablecoins, and local banking networks to enable rapid, transparent, and cost-effective money transfers from Hong Kong to Southeast Asia.

### Key Value Proposition

- ⚡ **12-minute average settlement** (P95 under 30 minutes)
- 💰 **Fees below 1.0%** (guaranteed upfront)
- 🔒 **HKMA-ready compliance** with built-in KYC/AML
- 🌏 **Multi-corridor support** (Philippines, Indonesia)
- 📊 **Real-time tracking** with live notifications

---

## Technology Stack

### Frontend

- **Framework:** HTML5 + Vanilla JavaScript
- **Styling:** Tailwind CSS + Custom CSS
- **Icons:** Lucide Icons
- **Fonts:** Inter, Geist, Bricolage Grotesque
- **Background:** Spline 3D (Glass Wave animation)

### Backend Integration

- **Authentication:** Supabase (Email/Password + Google OAuth)
- **Database:** Supabase PostgreSQL
- **Real-time Updates:** Supabase Realtime

### Design System

- **Color Scheme:** Dark theme (Slate-950 base)
- **Responsive:** Mobile-first, fully responsive
- **Accessibility:** WCAG compliant with semantic HTML

---

## Core Features

### 1. User Authentication

- Email/Password registration and login
- Google OAuth integration
- Session persistence via localStorage
- Secure token management

### 2. Recipient Management

- **Add New Recipient:** KYC-lite form (60 seconds)
- **Recipient List:** Visual cards with masked account numbers
- **Country Selection:** Philippines and Indonesia
- **Bank Selection:** Country-specific bank options
- **Account Validation:** Bank-specific format validation

### 3. Send Money Workflow

**4-Step Flow:**

1. **Select Recipient** - Choose from saved recipients
2. **Enter Amount** - HKD amount (capped at HKD 1,000 for MVP)
3. **Review & Confirm** - Transaction details verification
4. **Complete Transfer** - FPS QR code generation and tracking

### 4. Transaction Tracking

- Real-time status updates
- Multi-stage pipeline visualization:
  - FPS Payment Completed
  - HKD → Stablecoin Conversion
  - Stablecoin → PHP/IDR Conversion
  - Bank Payout to Recipient
- Live notifications and alerts

### 5. Dashboard

- Welcome section with user greeting
- Real-time KPIs:
  - Monthly accumulated remittance
  - Successful transaction rate
  - Average completion time
  - KYC/AML compliance status
- Quick actions panel
- Transaction history with download receipts

---

## Bank Requirements & Account Validation

### Philippines Banks

#### 1. BDO Unibank, Inc. (Bank Code: 011)

**Account Format:**

- **Standard:** 12-digit numeric account number
- **Legacy Support:** 10-digit accounts with auto-correction
  - System detects 10-digit input
  - Shows confirmation: "BDO legacy account detected. Please prepend two zeros at the beginning to make it 12 digits."
  - Auto-prepends "00" if user confirms

**Validation Rules:**

- ✅ Accepts: 12-digit numeric (e.g., `123456789012`)
- ✅ Accepts: 10-digit numeric with auto-correction (e.g., `1234567890` → `0012345678901`)
- ❌ Rejects: Non-numeric characters (letters, symbols, spaces)
- ❌ Rejects: Invalid lengths (not 10 or 12 digits)

**Error Message:**

```
Invalid BDO Unibank account format. Please enter a 12-digit numeric account number.
```

---

#### 2. Metropolitan Bank & Trust Company (Metrobank) (Bank Code: 018)

**Account Format:**

- **Standard:** 13-digit numeric account number
- **Excludes:** Virtual Accounts (VA) and payment references

**Validation Rules:**

- ✅ Accepts: Exactly 13-digit numeric (e.g., `1234567890123`)
- ❌ Rejects: Non-numeric characters (letters, symbols, spaces)
- ❌ Rejects: Any length other than 13 digits
- ❌ Rejects: Virtual Accounts (automatically excluded by 13-digit requirement)

**Error Message:**

```
Invalid Metropolitan Bank & Trust Company account format. Please enter a 13-digit numeric account number.
```

---

#### 3. Bank of the Philippine Islands (BPI) (Bank Code: 010)

**Account Format:**

- **Standard:** 10-digit numeric account number
- **Excludes:** Virtual Accounts (VA) and payment IDs

**Validation Rules:**

- ✅ Accepts: Exactly 10-digit numeric (e.g., `1234567890`)
- ❌ Rejects: Non-numeric characters (letters, symbols, spaces)
- ❌ Rejects: Any length other than 10 digits
- ❌ Rejects: Virtual Accounts (automatically excluded by 10-digit requirement)

**Error Message:**

```
Invalid Bank of the Philippine Islands account format. Please enter a 10-digit numeric account number.
```

---

### Indonesia Banks

#### 1. PT Bank Mandiri (Persero) Tbk (Bank Code: 008)

**Account Format:**

- **Standard:** 13-digit numeric account number
- **Excludes:** Virtual Accounts (VA)

**Validation Rules:**

- ✅ Accepts: Exactly 13-digit numeric (e.g., `1234567890123`)
- ❌ Rejects: Non-numeric characters (letters, symbols, spaces)
- ❌ Rejects: Any length other than 13 digits
- ❌ Rejects: Virtual Accounts (automatically excluded by 13-digit requirement)

**Error Message:**

```
Invalid PT Bank Mandiri (Persero) Tbk account format. Please enter a 13-digit numeric account number.
```

---

#### 2. PT Bank Rakyat Indonesia (Persero) Tbk (BRI) (Bank Code: 002)

**Account Format:**

- **Standard:** 15-digit numeric account number
- **Excludes:** Virtual Accounts (VA) and merchant-style VAs

**Validation Rules:**

- ✅ Accepts: Exactly 15-digit numeric (e.g., `123456789012345`)
- ❌ Rejects: Non-numeric characters (letters, symbols, spaces)
- ❌ Rejects: Any length other than 15 digits
- ❌ Rejects: Virtual Accounts (automatically excluded by 15-digit requirement)

**Error Message:**

```
Invalid PT Bank Rakyat Indonesia (Persero) Tbk account format. Please enter a 15-digit numeric account number.
```

---

#### 3. PT Bank Central Asia Tbk (BCA) (Bank Code: 014)

**Account Format:**

- **Standard:** 10-digit numeric account number
- **Excludes:** Virtual Accounts (VA) and known VA ranges

**Validation Rules:**

- ✅ Accepts: Exactly 10-digit numeric (e.g., `1234567890`)
- ❌ Rejects: Non-numeric characters (letters, symbols, spaces)
- ❌ Rejects: Any length other than 10 digits
- ❌ Rejects: Virtual Accounts (automatically excluded by 10-digit requirement)

**Error Message:**

```
Invalid PT Bank Central Asia Tbk account format. Please enter a 10-digit numeric account number.
```

---

## Account Validation Architecture

### Validation Flow

1. **Trigger:** Account field blur event (field loses focus)
2. **Check 1:** Numeric-only validation
   - Pattern: `/^\d+$/` (digits only)
   - Rejects: Letters, symbols, spaces, special characters
3. **Check 2:** Length validation
   - Bank-specific exact digit requirement
   - No flexibility for wrong lengths
4. **Check 3:** Virtual Account exclusion
   - Strict digit-length enforcement automatically excludes VAs
   - Different VA formats have different digit counts
   - Standard accounts have fixed digit counts

### Virtual Account (VA) Exclusion Strategy

**Why VA Exclusion Matters:**

- VAs are temporary payment references, not personal accounts
- VAs have different digit patterns than standard accounts
- VAs cannot be used for recurring transfers
- VAs expire after use

**Automatic Exclusion by Bank:**

| Bank      | Standard Digits | VA Typical Range | Exclusion Method |
| --------- | --------------- | ---------------- | ---------------- |
| BDO       | 12              | 16+              | Reject if not 12 |
| Metrobank | 13              | 14-16            | Reject if not 13 |
| BPI       | 10              | 11-16            | Reject if not 10 |
| Mandiri   | 13              | 16+              | Reject if not 13 |
| BRI       | 15              | 16-18            | Reject if not 15 |
| BCA       | 10              | 11-16            | Reject if not 10 |

---

## File Structure

```
fps-stablecoin/
├── index.html              # Landing page with login/registration
├── dashboard.html          # Main dashboard and send money workflow
├── README.md              # This file
└── assets/                # Images and static files
```

---

## Key Implementation Details

### Bank Configuration (dashboard.html, lines 1254-1266)

```javascript
const banksByCountry = {
    'PH': [
        { code: '011', name: 'BDO Unibank, Inc. (Bank Code: 011)' },
        { code: '018', name: 'Metropolitan Bank & Trust Company (Metrobank) (Bank Code: 018)' },
        { code: '010', name: 'Bank of the Philippine Islands (BPI) (Bank Code: 010)' }
    ],
    'ID': [
        { code: '008', name: 'PT Bank Mandiri (Persero) Tbk (Bank Code: 008)' },
        { code: '002', name: 'PT Bank Rakyat Indonesia (Persero) Tbk (Bank Code: 002)' },
        { code: '014', name: 'PT Bank Central Asia Tbk (Bank Code: 014)' }
    ]
};
```

### Account Validation (dashboard.html, lines 1299-1422)

- BDO: 10 or 12 digits with legacy support
- Metrobank: Exactly 13 digits
- BPI: Exactly 10 digits
- Mandiri: Exactly 13 digits
- BRI: Exactly 15 digits
- BCA: Exactly 10 digits

---

## User Flows

### Registration Flow

1. Click "Create a new account"
2. Enter email, full name, password
3. Submit registration
4. Redirect to dashboard for KYC verification

### Add Recipient Flow

1. Click "Add Recipient" button
2. Enter full name
3. Select country (Philippines or Indonesia)
4. Bank dropdown auto-populates based on country
5. Select bank
6. Enter account number (validated on blur)
7. Optional: Email and phone number
8. Submit to add recipient

### Send Money Flow

1. Click "Initiate New Remittance"
2. **Step 1:** Select recipient from list
3. **Step 2:** Enter HKD amount (max HKD 1,000)
4. **Step 3:** Review transaction details
5. **Step 4:** Complete transfer and scan FPS QR code
6. View real-time tracking

---

## MVP Scope & Limitations

### Current Limitations

- ✅ Transfer amount capped at HKD 1,000
- ✅ Philippines and Indonesia only
- ✅ Specific banks only (not all banks)
- ✅ Standard personal accounts only (no business accounts)
- ✅ No Virtual Account support

### Future Enhancements

- Flexible transfer amounts
- Additional corridors (Thailand, Vietnam, etc.)
- Expanded bank coverage
- Business account support
- Scheduled transfers
- Multi-currency support

---

## Compliance & Security

### KYC/AML

- Built-in KYC verification
- AML screening integration
- HKMA compliance ready
- Level 2 verification for MVP

### Data Security

- Bank-level encryption
- Secure token management
- HTTPS only (production)
- PCI DSS compliance ready

### Support

- 24/7 bilingual support
- Real-time notifications
- Transaction tracking
- Audit trail logging

---

## Testing

### Account Validation Test Cases

**BDO Tests:**

- ✓ 12-digit numeric → Accept
- ✓ 10-digit numeric → Show legacy prompt
- ✗ 11-digit → Reject
- ✗ 13-digit → Reject
- ✗ Contains letters → Reject

**Metrobank Tests:**

- ✓ 13-digit numeric → Accept
- ✗ 12-digit → Reject
- ✗ 14-digit → Reject
- ✗ Contains letters → Reject

**BPI Tests:**

- ✓ 10-digit numeric → Accept
- ✗ 9-digit → Reject
- ✗ 11-digit → Reject
- ✗ Contains letters → Reject

**Indonesia Bank Tests:**

- Mandiri: ✓ 13-digit, ✗ other lengths
- BRI: ✓ 15-digit, ✗ other lengths
- BCA: ✓ 10-digit, ✗ other lengths

---

## Getting Started

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection
- Supabase account (for backend)

### Installation

1. Clone repository
2. Open `index.html` in browser
3. Register account
4. Complete KYC verification
5. Add recipients
6. Start sending money

### Local Development

```bash
# No build process required - pure HTML/CSS/JS
# Serve files via HTTP server for development
python -m http.server 8000
# or
npx http-server -p 8000
```

---

## API Integration Points

### Supabase Integration

- User authentication (email/password, Google OAuth)
- User profile storage
- Recipient management
- Transaction history
- Real-time notifications

### External APIs (Future)

- FPS payment gateway
- Stablecoin liquidity provider
- Bank settlement APIs
- Currency conversion service
- KYC/AML screening service

---

## Support & Documentation

For detailed implementation notes, see:

- `IMPLEMENTATION_NOTES.md` - Technical implementation details
- Bank-specific validation rules documented above

---

## Version

**MVP v0.4** - Cross-Border Remittance Service

---

## License

Proprietary - HKBU FPS Prototype

---

## Contact

For inquiries, contact the development team.

---

## Appendix: Bank Code Reference

| Country | Bank Name    | Code | Account Format           |
| ------- | ------------ | ---- | ------------------------ |
| PH      | BDO Unibank  | 011  | 12 digits (or 10 legacy) |
| PH      | Metrobank    | 018  | 13 digits                |
| PH      | BPI          | 010  | 10 digits                |
| ID      | Bank Mandiri | 008  | 13 digits                |
| ID      | BRI          | 002  | 15 digits                |
| ID      | BCA          | 014  | 10 digits                |
