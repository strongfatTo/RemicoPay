# Product Requirements Document (PRD)

**Product:** Cross-Border Remittance Service (Hong Kong → Philippines)  
**Version:** 1.0  
**Date:** January 2025  
**Status:** Draft  
**Prepared by:** John (Product Manager)  
**Stakeholders:** Engineering, Design, Compliance, Business Development

---

## 1. Product Overview

### 1.1 Product Vision
Enable fast, low-cost cross-border remittances from Hong Kong to the Philippines using regulated stablecoins, providing a transparent, secure, and efficient alternative to traditional remittance services.

### 1.2 Product Mission
To revolutionize cross-border remittances by leveraging blockchain technology and regulatory-compliant stablecoins, making money transfers faster, cheaper, and more accessible for Filipino expatriates in Hong Kong.

### 1.3 Success Metrics (North Star)
- **Primary:** Transaction volume (HKD processed per month)
- **Secondary:** User satisfaction score (>4.5/5)
- **Tertiary:** Transaction success rate (>95%)
- **Business:** Revenue per transaction (target: HKD 20-30 per HKD 1,000)

---

## 2. Problem Statement

### 2.1 The Problem
Filipino expatriates in Hong Kong face significant challenges when sending money home:
- **High costs:** 3-7% transaction fees
- **Slow processing:** 1-3 business days
- **Lack of transparency:** Hidden fees and unclear exchange rates
- **Limited accessibility:** Operating hours restrictions
- **Complex processes:** Cumbersome KYC and documentation

### 2.2 Why This Matters
- Large remittance corridor (HK → PH is one of the largest globally)
- Price-sensitive customer base
- Growing demand for digital solutions
- Regulatory framework now supports stablecoin-based solutions

### 2.3 Market Opportunity
- **TAM:** Large Filipino community in Hong Kong
- **SAM:** Tech-savvy, price-conscious remittance users
- **SOM:** 1-5% market share in first year (target: 1,000+ users)

---

## 3. Target Users

### 3.1 Primary Persona: Maria - Filipino Expatriate

**Demographics:**
- Age: 32
- Location: Hong Kong
- Occupation: Domestic worker
- Income: HKD 4,000-6,000/month
- Tech-savviness: Moderate (uses smartphone daily)

**Goals:**
- Send money home quickly and cheaply
- Know exactly how much recipient will receive
- Track transaction status in real-time
- Avoid hidden fees

**Pain Points:**
- High fees eat into limited income
- Slow transfers delay family needs
- Unclear exchange rates
- Limited time to visit remittance centers

**Behaviors:**
- Sends remittances 2-3 times per month
- Transaction size: HKD 1,000-3,000
- Uses mobile banking apps
- Values recommendations from friends/community

### 3.2 Secondary Persona: Carlos - Tech-Savvy Professional

**Demographics:**
- Age: 28
- Location: Hong Kong
- Occupation: IT professional
- Income: HKD 20,000+/month
- Tech-savviness: High (early adopter)

**Goals:**
- Try innovative fintech solutions
- Support blockchain/crypto adoption
- Faster, more transparent transfers

**Pain Points:**
- Traditional services feel outdated
- Lack of transparency
- Slow processing

**Behaviors:**
- Sends larger amounts (HKD 5,000+)
- Comfortable with new technology
- Values innovation and efficiency

---

## 4. Solution Overview

### 4.1 Core Value Proposition
"Send money from Hong Kong to the Philippines in minutes, not days. Pay 1-2% fees instead of 3-7%. See exactly what your family receives with transparent pricing."

### 4.2 How It Works
1. Customer scans FPS QR code and pays HKD
2. System converts HKD → HKD stablecoin → PHPC → PHP
3. Funds deposited to recipient's Philippine bank account
4. Customer receives real-time updates throughout

### 4.3 Key Differentiators
- **Speed:** Minutes vs. days
- **Cost:** 1-2% vs. 3-7% fees
- **Transparency:** Real-time tracking, clear pricing
- **Compliance:** Fully regulated, secure
- **Accessibility:** 24/7 availability, mobile-first

---

## 5. Product Requirements

### 5.1 Functional Requirements

#### FR-1: User Onboarding & KYC
- **FR-1.1:** User must register with email/phone
- **FR-1.2:** User must complete KYC (HKID or passport verification)
- **FR-1.3:** System must perform AML screening (sanctions list check)
- **FR-1.4:** User must verify phone number via SMS
- **FR-1.5:** System must store KYC documents securely
- **Priority:** P0 (Must Have)

#### FR-2: Transaction Initiation
- **FR-2.1:** User must be able to scan FPS QR code
- **FR-2.2:** User must enter recipient details (name, bank account, bank name)
- **FR-2.3:** System must validate Philippine bank account format
- **FR-2.4:** System must display transaction summary (amount, fees, exchange rate, estimated PHP)
- **FR-2.5:** User must confirm transaction before payment
- **Priority:** P0 (Must Have)

#### FR-3: FPS Payment Processing
- **FR-3.1:** System must generate unique FPS QR code per transaction
- **FR-3.2:** System must accept HKD payments via FPS
- **FR-3.3:** System must verify payment receipt within 2 minutes
- **FR-3.4:** System must handle payment timeouts (15-minute window)
- **FR-3.5:** System must handle payment failures gracefully
- **Priority:** P0 (Must Have)

#### FR-4: Stablecoin Conversion
- **FR-4.1:** System must purchase HKD stablecoin upon payment receipt
- **FR-4.2:** System must convert HKD stablecoin to PHPC
- **FR-4.3:** System must track all conversion rates and fees
- **FR-4.4:** System must handle conversion failures with automatic retry (max 3 attempts)
- **FR-4.5:** System must rollback on conversion failure
- **Priority:** P0 (Must Have)

#### FR-5: Philippine Disbursement
- **FR-5.1:** System must send PHPC to licensed Philippine partner
- **FR-5.2:** Partner must convert PHPC to PHP and deposit to bank
- **FR-5.3:** System must verify deposit completion
- **FR-5.4:** System must handle disbursement failures
- **Priority:** P0 (Must Have)

#### FR-6: Transaction Tracking
- **FR-6.1:** User must see real-time transaction status
- **FR-6.2:** System must send notifications at key milestones
- **FR-6.3:** User must be able to view transaction history
- **FR-6.4:** System must provide transaction receipt
- **Priority:** P0 (Must Have)

#### FR-7: User Interface
- **FR-7.1:** System must provide mobile-responsive web interface
- **FR-7.2:** Interface must support English, Tagalog, and Cantonese
- **FR-7.3:** Interface must be intuitive and easy to use
- **FR-7.4:** System must display clear error messages
- **Priority:** P0 (Must Have)

### 5.2 Non-Functional Requirements

#### NFR-1: Performance
- Payment verification: < 2 minutes (p95)
- End-to-end transaction: < 30 minutes (target)
- UI response time: < 2 seconds (p95)
- System uptime: > 99% during business hours
- **Priority:** P0

#### NFR-2: Security
- All data encrypted in transit (TLS 1.3)
- Sensitive data encrypted at rest (AES-256)
- Secure API key management (HSM or secure vault)
- Regular security audits (quarterly)
- Penetration testing before production
- **Priority:** P0

#### NFR-3: Compliance
- HKMA regulatory compliance
- BSP regulatory compliance (via partner)
- AML/CFT transaction monitoring
- Complete audit trail for all transactions
- Data retention per regulatory requirements
- **Priority:** P0

#### NFR-4: Usability
- Mobile-responsive design (works on all screen sizes)
- Multi-language support (English, Tagalog, Cantonese)
- Clear, actionable error messages
- Intuitive user flow (< 5 steps to complete transaction)
- Accessibility (WCAG 2.1 AA compliance)
- **Priority:** P1

#### NFR-5: Scalability
- Support 1,000+ concurrent users
- Handle 10,000+ transactions per day
- Auto-scaling infrastructure
- **Priority:** P1

### 5.3 Out of Scope (Post-MVP)
- Variable transaction amounts (MVP: fixed HKD 1,000)
- Multiple currency pairs
- Scheduled/recurring transfers
- Mobile apps (iOS/Android) - web only for MVP
- Advanced analytics dashboard
- Business accounts
- Multi-directional remittances (PH → HK)

---

## 6. User Stories

### 6.1 Epic 1: User Onboarding

**US-1.1: User Registration**
- **As a** new user
- **I want to** create an account with my email and phone
- **So that** I can start using the remittance service
- **Acceptance Criteria:**
  - User can register with email and phone
  - User receives verification code via SMS
  - User must verify phone before proceeding
  - System validates email format and phone number

**US-1.2: KYC Verification**
- **As a** new user
- **I want to** complete KYC verification
- **So that** I can comply with regulatory requirements
- **Acceptance Criteria:**
  - User can upload HKID or passport
  - System performs identity verification
  - System performs AML screening
  - User receives KYC status notification

### 6.2 Epic 2: Send Remittance

**US-2.1: Initiate Transaction**
- **As a** verified user
- **I want to** scan a QR code and enter recipient details
- **So that** I can start a remittance transaction
- **Acceptance Criteria:**
  - User can scan FPS QR code
  - User can enter recipient name, bank account, bank name
  - System validates bank account format
  - System displays transaction summary

**US-2.2: Complete Payment**
- **As a** user
- **I want to** pay via FPS
- **So that** my transaction can be processed
- **Acceptance Criteria:**
  - User can initiate FPS payment
  - System verifies payment within 2 minutes
  - User receives payment confirmation
  - Transaction proceeds to processing

**US-2.3: Track Transaction**
- **As a** user
- **I want to** see real-time status of my transaction
- **So that** I know when funds reach the recipient
- **Acceptance Criteria:**
  - User can view transaction status page
  - Status updates in real-time
  - User receives notifications at milestones
  - User can see estimated completion time

### 6.3 Epic 3: Transaction History

**US-3.1: View History**
- **As a** user
- **I want to** view my transaction history
- **So that** I can track my past remittances
- **Acceptance Criteria:**
  - User can see list of all transactions
  - Transactions show status, amount, date
  - User can filter by status, date range
  - User can view transaction details

---

## 7. User Flows

### 7.1 Primary Flow: Complete Remittance

```
1. User opens web app
   ↓
2. User logs in (or registers if new)
   ↓
3. User completes KYC (if not done)
   ↓
4. User clicks "Send Money"
   ↓
5. User scans FPS QR code
   ↓
6. User enters recipient details:
   - Recipient name
   - Bank account number
   - Bank name
   ↓
7. System validates and displays summary:
   - Amount: HKD 1,000
   - Fees: HKD 20 (2%)
   - Exchange rate: 7.2
   - Estimated PHP: 7,056
   ↓
8. User confirms transaction
   ↓
9. User initiates FPS payment
   ↓
10. System verifies payment (within 2 min)
    ↓
11. System performs AML check
    ↓
12. System purchases HKD stablecoin
    ↓
13. System converts to PHPC
    ↓
14. System sends PHPC to Philippine partner
    ↓
15. Partner converts and deposits PHP
    ↓
16. System verifies deposit
    ↓
17. User receives completion notification
    ↓
18. Transaction complete ✅
```

### 7.2 Error Flows

**Error Flow A: Payment Failure**
- User attempts FPS payment but it fails
- System displays error: "Payment failed. Please try again."
- User can retry payment or cancel transaction
- No stablecoin purchase initiated

**Error Flow B: KYC/AML Failure**
- User fails AML screening
- System blocks transaction
- System refunds FPS payment (if already paid)
- System notifies compliance team
- User receives message: "Transaction cannot be processed. Contact support."

**Error Flow C: Conversion Failure**
- HKD stablecoin purchase fails
- System retries automatically (max 3 attempts)
- If all retries fail:
  - System refunds FPS payment
  - System notifies user and operations team
  - User receives error notification

**Error Flow D: Disbursement Failure**
- Philippine partner cannot process
- System holds PHPC in escrow
- System notifies operations team for manual intervention
- User receives notification: "Transaction delayed. We're working on it."

---

## 8. Technical Requirements

### 8.1 Architecture Overview
- **Frontend:** React/Vue.js (mobile-responsive SPA)
- **Backend:** Node.js/Python (REST API)
- **Database:** PostgreSQL
- **Queue:** Redis (for async job processing)
- **Hosting:** AWS/Azure/GCP (cloud)

### 8.2 Key Integrations
- **FPS:** Hong Kong Faster Payment System API
- **HKD Stablecoin:** Partner API (licensed issuer)
- **PHPC:** Coins.ph API (or alternative)
- **Philippine Partner:** Partner API (Coins.ph/Union Bank/PDAX)
- **KYC/AML:** Third-party service (Sumsub/Onfido/Jumio)

### 8.3 Data Models

**Transaction:**
- id (UUID)
- customer_id (UUID)
- status (enum: pending, processing, completed, failed)
- amount_hkd (decimal)
- amount_php (decimal)
- exchange_rate (decimal)
- fees (decimal)
- fps_payment_id (string)
- hkd_stablecoin_tx (string, nullable)
- phpc_tx (string, nullable)
- php_deposit_ref (string, nullable)
- recipient_name (string)
- recipient_bank_account (string)
- recipient_bank (string)
- created_at (timestamp)
- completed_at (timestamp, nullable)

**Customer:**
- id (UUID)
- email (string, unique)
- phone (string)
- name (string)
- hkid (string, nullable)
- kyc_status (enum: pending, verified, rejected)
- aml_status (enum: pending, cleared, flagged)
- created_at (timestamp)

### 8.4 API Endpoints

**Public APIs:**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-phone` - Phone verification

**Customer APIs:**
- `POST /api/kyc/submit` - Submit KYC documents
- `GET /api/kyc/status` - Get KYC status
- `POST /api/transactions` - Create new transaction
- `GET /api/transactions/:id` - Get transaction details
- `GET /api/transactions` - List user transactions
- `GET /api/transactions/:id/qr` - Get FPS QR code

**Webhook APIs:**
- `POST /api/webhooks/fps` - FPS payment notification
- `POST /api/webhooks/stablecoin` - Stablecoin transaction update
- `POST /api/webhooks/partner` - Philippine partner notification

---

## 9. Design Requirements

### 9.1 UI/UX Principles
- **Simplicity:** Minimal steps to complete transaction
- **Clarity:** Clear messaging, no jargon
- **Trust:** Transparent pricing, security indicators
- **Accessibility:** WCAG 2.1 AA compliance
- **Mobile-first:** Optimized for smartphone use

### 9.2 Key Screens
1. **Landing/Login:** Simple login/registration
2. **Dashboard:** Transaction history, quick send
3. **Send Money:** QR scan, recipient details, confirmation
4. **Transaction Status:** Real-time progress tracking
5. **Transaction History:** List of past transactions

### 9.3 Design System
- **Colors:** Professional, trustworthy palette
- **Typography:** Clear, readable fonts
- **Icons:** Simple, recognizable icons
- **Components:** Reusable, consistent components

---

## 10. Compliance & Security

### 10.1 Regulatory Compliance
- **Hong Kong:** HKMA regulations (partner-based model)
- **Philippines:** BSP regulations (via licensed partner)
- **AML/CFT:** Full compliance with both jurisdictions
- **Data Protection:** HK Privacy Ordinance, Philippines PDPA

### 10.2 Security Measures
- End-to-end encryption
- Secure API authentication (JWT)
- Rate limiting and DDoS protection
- Regular security audits
- Penetration testing
- Incident response plan

### 10.3 Risk Management
- Transaction monitoring for suspicious activity
- Automated fraud detection
- Manual review process for flagged transactions
- Compliance reporting

---

## 11. Success Metrics & KPIs

### 11.1 Product Metrics
- **Transaction Volume:** HKD 100K+ in first 3 months
- **Transaction Success Rate:** >95%
- **Average Transaction Time:** <30 minutes
- **User Satisfaction:** >4.5/5

### 11.2 Business Metrics
- **Revenue:** HKD 2K-3K per HKD 100K processed
- **Customer Acquisition Cost:** <HKD 50
- **Customer Lifetime Value:** >HKD 500
- **Monthly Active Users:** 100+ in first 3 months

### 11.3 Technical Metrics
- **System Uptime:** >99%
- **API Response Time:** <2 seconds (p95)
- **Error Rate:** <5%
- **Payment Verification Time:** <2 minutes

---

## 12. MVP Scope & Timeline

### 12.1 MVP Scope
**In Scope:**
- Single direction: HK → PH only
- Fixed amount: HKD 1,000 per transaction
- Basic KYC/AML
- Web interface (mobile-responsive)
- Real-time transaction tracking
- Basic error handling

**Out of Scope:**
- Variable amounts
- Multiple currencies
- Mobile apps
- Advanced features
- Multi-directional

### 12.2 Timeline
- **Phase 1 (Weeks 1-2):** Foundation & setup
- **Phase 2 (Weeks 3-6):** Core development
- **Phase 3 (Weeks 7-8):** Integration
- **Phase 4 (Weeks 9-10):** Testing & refinement
- **Phase 5 (Week 11):** MVP launch

**Total:** 11 weeks (approximately 3 months)

---

## 13. Risks & Mitigation

### 13.1 Technical Risks
| Risk | Impact | Mitigation |
|------|--------|------------|
| FPS API unavailable | High | Sandbox testing, manual fallback |
| Stablecoin liquidity | High | Partner with established providers |
| Partner API delays | High | Start early, backup partners |
| Scalability issues | Medium | Cloud auto-scaling, load testing |

### 13.2 Regulatory Risks
| Risk | Impact | Mitigation |
|------|--------|------------|
| Regulatory changes | High | Monitor closely, legal counsel |
| Compliance issues | High | Compliance-first design, legal review |
| Partner license issues | High | Work with established partners |

### 13.3 Business Risks
| Risk | Impact | Mitigation |
|------|--------|------------|
| Low adoption | Medium | Focus on UX, clear value prop |
| High costs | Medium | Negotiate partner fees |
| Competition | Low | First-mover advantage |

---

## 14. Dependencies & Assumptions

### 14.1 External Dependencies
- FPS API access (sandbox/production)
- HKD stablecoin partner
- Philippine partner (Coins.ph preferred)
- KYC/AML service provider
- Legal/regulatory counsel

### 14.2 Assumptions
- Regulatory environment remains stable
- Partners willing to work with MVP
- Testnet/sandbox available
- Sufficient development resources
- 3-month timeline achievable

### 14.3 Open Questions
- [ ] Which HKD stablecoin issuer available first?
- [ ] Exact fee structure from partners?
- [ ] FPS API documentation access?
- [ ] Coins.ph partnership terms?
- [ ] Legal requirements for MVP testing?

---

## 15. Post-MVP Roadmap

### 15.1 Phase 2 (Months 4-6)
- Variable transaction amounts
- Multiple currency pairs
- Mobile apps (iOS/Android)
- Enhanced analytics

### 15.2 Phase 3 (Months 7-12)
- Scheduled transfers
- Recurring payments
- Business accounts
- Additional corridors

---

## 16. Appendices

### 16.1 Glossary
- **FPS:** Faster Payment System (Hong Kong)
- **HKMA:** Hong Kong Monetary Authority
- **BSP:** Bangko Sentral ng Pilipinas
- **VASP:** Virtual Asset Service Provider
- **PHPC:** Philippine Peso Coin (stablecoin)
- **KYC:** Know Your Customer
- **AML:** Anti-Money Laundering

### 16.2 References
- Market Research: `market-research.md`
- Regulatory: HKMA Stablecoins Ordinance, BSP VASP Regulations
- Technical: FPS API Documentation, Partner APIs

### 16.3 Document History
- **v1.0** (Jan 2025): Initial PRD draft

---

**Next Steps:**
1. Review and approve PRD with stakeholders
2. Begin architecture design
3. Start partner outreach
4. Legal/regulatory consultation
5. Begin Phase 1: Foundation

---

## 17. Prototype Scope Conclusion

- **Identity:** Limit onboarding to email-only registration and login; postpone SMS verification until after prototype validation.
- **Frontend:** Keep the current responsive web interface focused on the send-money happy path plus status/history views needed for demos.
- **Backend:** Implement all server-side logic in Supabase (auth, database tables, RPCs, storage); do not build or deploy separate Node/Python services for this iteration.
- **Payments & Conversion:** Simulate FPS settlement, stablecoin conversion, and Philippine disbursement steps, persisting state in Supabase rather than integrating live partners.
- **Compliance & Ops:** Document manual procedures (offline KYC review, manual payout confirmation) so the prototype highlights UX while keeping operational overhead light.

---

*This PRD is a living document and will be updated as requirements evolve and learnings are gathered.*



