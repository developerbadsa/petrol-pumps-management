# Petrol Pumps Management

Production-ready Next.js App Router backend that matches the Laravel-style API contract used by the frontend.

## Tech Stack
- Next.js 14+ App Router (Route Handlers)
- PostgreSQL + Prisma
- S3-compatible object storage for uploads (AWS S3 / Cloudflare R2)

## Environment Variables
Create a `.env` file with:

```bash
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/petrol_pumps"

# S3 / R2
S3_ENDPOINT="https://<account>.r2.cloudflarestorage.com" # optional for AWS
S3_REGION="auto"
S3_ACCESS_KEY_ID="your-access-key"
S3_SECRET_ACCESS_KEY="your-secret"
S3_BUCKET="petrol-pumps"
S3_PUBLIC_URL="https://pub.example.com" # optional public base URL
```

## Setup

```bash
npm install
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npm run dev
```

## API Examples
All endpoints are under `/api` and use `Authorization: Bearer <token>` for protected routes.

### Register
```bash
curl -X POST https://example.com/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "sadman sakib",
    "email": "rafi@example.com",
    "password": "password123",
    "password_confirmation": "password123",
    "phone_number": "01700000001",
    "username": "sadmansakib",
    "bio": "I am a new user.",
    "address": "tangail, dhaka."
  }'
```

### Login
```bash
curl -X POST https://example.com/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "phone_number": "01712345678",
    "password": "password123"
  }'
```

### Current User
```bash
curl -X GET https://example.com/api/me \
  -H "Authorization: Bearer <token>"
```

### Create Notice (Multipart)
```bash
curl -X POST https://example.com/api/notices \
  -H "Authorization: Bearer <token>" \
  -F "title=New Notice" \
  -F "content=Notice details" \
  -F "publish_date=2024-12-01" \
  -F "attachments[]=@/path/to/file.pdf"
```

### Update Notice (Laravel method override)
```bash
curl -X POST "https://example.com/api/notices/1?_method=PUT" \
  -H "Authorization: Bearer <token>" \
  -F "title=Updated Notice" \
  -F "attachments[]=@/path/to/file.pdf"
```

### Public Approved Gas Stations (Paginated)
```bash
curl -X GET "https://example.com/api/public/gas-stations/approved?page=1&per_page=20"
```

### Create Payment Record (Auto-approve gas station)
```bash
curl -X POST https://example.com/api/payment-records \
  -H "Authorization: Bearer <token>" \
  -F "station_id=1" \
  -F "bank_name=ABC Bank" \
  -F "amount_paid=5000" \
  -F "payment_doc=@/path/to/receipt.pdf"
```

### Submit Member Application
```bash
curl -X POST https://example.com/api/members \
  -F "member_name=Sample Member" \
  -F "member_nid_number=123456789" \
  -F "station_name_address=Station Address" \
  -F "district=Dhaka" \
  -F "member_mobile_number=01700000001" \
  -F "oil_company_name=Example Oil" \
  -F "type_of_business=Dealer" \
  -F "representative_name=Rep" \
  -F "representative_nid_number=987654321" \
  -F "required_documents=@/path/to/docs.pdf" \
  -F "trade_license_number=TL-100" \
  -F "tin_number=TN-100" \
  -F "application_date=2024-12-01" \
  -F "applicant_signature=@/path/to/signature.png"
```

## Getting S3 / R2 Credentials
- **AWS S3**: Create an IAM user with programmatic access, attach a policy granting access to your bucket (e.g., `s3:PutObject`, `s3:GetObject`, `s3:DeleteObject`). Then create an access key and secret, set `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_BUCKET`, and leave `S3_ENDPOINT` empty. `S3_PUBLIC_URL` can be your bucket public URL or CloudFront URL if using a CDN.
- **Cloudflare R2**: Create an R2 bucket, then create an API token with object read/write permissions. Use the R2 endpoint for `S3_ENDPOINT` (the account-specific endpoint from the R2 dashboard), set `S3_REGION=auto`, `S3_ACCESS_KEY_ID` and `S3_SECRET_ACCESS_KEY` from the token, and `S3_BUCKET` to the bucket name. `S3_PUBLIC_URL` should be your R2 public bucket domain or custom domain if configured.
