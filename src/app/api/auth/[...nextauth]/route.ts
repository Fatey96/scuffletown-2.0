import NextAuth from 'next-auth';
import { authOptions } from '../../../../../utils/auth';

// Export the NextAuth handler with the GET and POST methods
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; 