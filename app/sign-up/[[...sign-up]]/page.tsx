import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fcfaf8] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-[#1c140d]">
            Join Our Community
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Create your Boost Health Initiative account
          </p>
        </div>
        <div className="flex justify-center">
          <SignUp 
            appearance={{
              elements: {
                formButtonPrimary: 'bg-[#f37c1b] hover:bg-orange-500',
                footerActionLink: 'text-[#f37c1b] hover:text-orange-500',
                card: 'shadow-2xl',
              }
            }}
            redirectUrl="/"
          />
        </div>
      </div>
    </div>
  );
} 