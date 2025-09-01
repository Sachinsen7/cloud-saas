# Environment Variables Setup

To fix the 500 error in the video upload API, you need to create a `.env.local` file in the `saas-pro` directory with the following environment variables:

## Required Environment Variables

### Database

```
DATABASE_URL="postgresql://username:password@localhost:5432/your_database_name"
```

### Clerk Authentication

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
CLERK_SECRET_KEY="your_clerk_secret_key"
```

### Cloudinary

```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloudinary_cloud_name"
CLOUDINARY_API_KEY="your_cloudinary_api_key"
CLOUDINARY_API_SECRET="your_cloudinary_api_secret"
```

## How to Set Up

1. **Create a `.env.local` file** in the `saas-pro` directory
2. **Copy the above variables** and replace the placeholder values with your actual credentials
3. **Restart your development server** after adding the environment variables

## Where to Get These Values

### Database (Neon DB)

- Sign up at [neon.tech](https://neon.tech)
- Create a new project
- Copy the connection string from your dashboard

### Clerk

- Sign up at [clerk.com](https://clerk.com)
- Create a new application
- Get your keys from the API Keys section

### Cloudinary

- Sign up at [cloudinary.com](https://cloudinary.com)
- Get your credentials from your dashboard

## Troubleshooting

If you still get a 500 error after setting up environment variables:

1. Check the console logs in your terminal for specific error messages
2. Ensure all environment variables are properly set
3. Verify your database connection string is correct
4. Make sure your Clerk and Cloudinary credentials are valid

## Example .env.local file

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/your_database_name"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="123456789012345"
CLOUDINARY_API_SECRET="abcdefghijklmnopqrstuvwxyz"
```
