# Admin User Setup

This directory contains scripts for administering the dealership website.

## Creating an Admin User

To create an admin user for the website, follow these steps:

1. Make sure you have set up your `.env.local` file with the correct `MONGODB_URI` value in the root of your project.

2. Install the required dependencies:
   ```
   npm install mongodb bcryptjs dotenv
   ```

3. Run the script to create an admin user. You have three options:

   **Option 1:** Using npm scripts (recommended):
   ```
   npm run create-admin
   ```

   **Option 2:** From the project root directory:
   ```
   node scripts/createAdmin.js
   ```

   **Option 3:** Using the full path:
   ```
   node /path/to/dealership-website/scripts/createAdmin.js
   ```

4. The script will generate a secure random password and create an admin user in the database. Make sure to save the displayed credentials securely.

## Troubleshooting

If you encounter the error `Cannot find module 'scripts/createAdmin.js'`:

1. Make sure you're running the command from the project root directory (dealership-website)
2. Check that the file exists at `dealership-website/scripts/createAdmin.js`
3. Try using the npm script method: `npm run create-admin`
4. Try using the full path to the script:
   ```
   node C:\Users\YourUsername\path\to\dealership-website\scripts\createAdmin.js
   ```

If you encounter connection errors:

1. Verify your MongoDB connection is running
2. Check that your `.env.local` file contains the correct `MONGODB_URI` value
3. If running MongoDB locally, ensure the MongoDB service is running

### Resetting Admin Password

If you need to reset the password for an existing admin user:

```
npm run reset-admin
```

Or:

```
node scripts/createAdmin.js --reset-password
```

## Security Best Practices

1. Change the default admin email in the script before running it in production.
2. Use a strong, secure NEXTAUTH_SECRET in your environment variables.
3. Store the admin credentials securely, preferably in a password manager.
4. For production deployments, consider using environment variables for the admin details rather than hardcoding them in the script. 