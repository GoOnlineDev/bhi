export default {
    providers: [
      {
        domain: process.env.NODE_ENV === 'production' 
          ? 'https://clerk.boosthealthinitiative.com'
          : process.env.CLERK_ISSUER_URL || 'https://clerk.boosthealthinitiative.com',
        applicationID: "convex",
      },
    ]
  };