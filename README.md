# Open Ledger

A flexible open-source ledger for tracking any type of asset. Store, manage, and audit all your transactions in one place.

## Core Concepts

The ledger is built on four simple primitives:

- **Asset**: Any unit of value you want to track. Examples: BRL, USD, Points, Tokens, Items.
- **Account**: A container that holds a balance of a specific asset. Examples: user wallets, credit accounts, savings accounts, checking accounts, inventory warehouse.
- **Transaction**: A record of a financial event, composed of multiple operations. A transaction is the unit of work and is always balanced (debits must equal credits).
- **Operation**: The most granular unit of movement, representing a single debit or credit to an account.

## Core Features

**⚖️ Double-Entry Bookkeeping**

At its core, the ledger enforces double-entry accounting. Every movement of value is recorded as a balanced journal entry, ensuring your financial data remains consistent and verifiable.

**⚙️ Asset-Agnostic Design**

Track anything of value. The ledger handles multiple, distinct asset types in a single system - from fiat currencies and crypto to loyalty points and inventory items.

**🔀 Compound (N:N) Transactions**

Go beyond simple A-to-B transfers. Natively supports multi-legged transactions to model complex events (many-to-many) in one atomic operation. Perfect for marketplace payouts, payroll, split payments, and applying service fees.

**📜 Immutable Append-Only Log**

Transactions are recorded permanently and cannot be altered. Corrections are made via new, reversing entries, which maintains a full and transparent audit trail essential for compliance.

## Technical Features

**🕵️‍♂️ Optimistic Concurrency**

Achieves high throughput via **account-level optimistic concurrency**. Instead of locking, the system uses a versioning mechanism to ensure data integrity, allowing conflicting transactions to fail safely and be retried.

**🏗️ Domain-Driven Design**

The codebase is built around core business concepts (Assets, Accounts, Transactions). This DDD approach makes the system intuitive to understand, maintain, and extend.

**🔌 REST API**

The ledger is exposed via a clean and stateless REST API. To enable seamless system-level integration, the API is fully documented using the OpenAPI Specification. This allows teams to explore endpoints via Swagger UI and auto-generate client libraries for any language or framework.

**🚧 Backoffice (TBC)**

A dedicated UI for administrative monitoring and manual journal entries is on the project roadmap.

**✅ Comprehensive Testing**

Rigorously tested for reliability with a full suite of **unit**, **integration**, and **functional** tests that validate everything from isolated functions to complete business workflows.

## Use Cases

### 1. Core Banking

A platform for users to store and transfer digital currency.

- Assets: USD
- Accounts: UserWallet_Alice, UserWallet_Bob, CorporateRevenue

Example: Alice sends $50 to Bob, and the platform charges a $1 fee.

```
Transaction: P2P Transfer with Fee
  Operations:
    Debit:  Accounts.UserWallet_Alice   USD 51.00
    Credit: Accounts.UserWallet_Bob     USD 50.00
    Credit: Accounts.CorporateRevenue   USD 1.00
```

### 2. Marketplace Payouts

An e-commerce platform that processes sales and pays out to its vendors.

- Assets: BRL
- Accounts: PendingSales, VendorPayable_Jane, MarketplaceFees

Example: A customer buys a product for $100, with the marketplace taking a 15% commission.

```
Transaction: Sale Payout
  Operations:
    Debit:  Accounts.PendingSales         USD 100.00
    Credit: Accounts.VendorPayable_Jane   USD 85.00
    Credit: Accounts.MarketplaceFees      USD 15.00
```

### 3. Supply Chain & Inventory

A system to track the movement of physical goods from a supplier to a warehouse.

- Assets: PRODUCT_SKU_XYZ
- Accounts: SupplierStock, InTransit, Warehouse_A

Example: 200 units of a product are shipped from the supplier to Warehouse A.

```
Transaction: Goods In Transit
  Operations:
    Debit:  Accounts.InTransit        PRODUCT_SKU_XYZ 200
    Credit: Accounts.SupplierStock    PRODUCT_SKU_XYZ 200
```

## Development Environment

In order to develop for this project you must have Docker and Docker Compose installed.

1. Clone the repository

```
git clone git@github.com:gabrielribeirof/open-ledger.git
cd open-ledger
```

2. Set up environment variables

```
make set-env
```

3. Star the services

```
make up
```

4. Access the services

- Core API: http://localhost:3000
  - Core API Swagger: http://localhost:3000/swagger

5. Explore makefile commands

```
make help
```

And inside each `/apps` child folder.

## Inspirations and Acknowledgments

Beyond the goal of creating a functional product, this project also serves as a practical exercise in implementing specific software engineering techniques observed in high-quality, real-world applications.

Special credit goes to the following projects, which served as significant sources of inspiration:

- [PicPay - Backend Challenge](https://github.com/PicPay/picpay-desafio-backend): This challenge provides valuable insights into the architectural patterns and requirements for building a high-volume transactional system. It was an excellent reference for designing robust and scalable solutions.
- [Midaz by LerianStudio](https://github.com/LerianStudio/midaz): As a comprehensive, open-source Core Ledger, Midaz provided a clear and powerful reference for the core domain of this project. Its approach to multi-asset accounting and cloud-native design was a major inspiration.