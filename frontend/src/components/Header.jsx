import {
  SignedIn,
  SignedOut,
  UserButton,
  SignInButton,
} from "@clerk/clerk-react";

export default function Header() {
  return (
    <div className="relative flex items-center bg-gray-300 pb-12 w-full px-8">
      <div className="absolute left-8">
        <SignedOut>
          <SignInButton mode="modal">
            <button className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded transition-colors">
              Sign In
            </button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
      <h1 className="w-full text-center text-4xl font-bold">FitFolio</h1>
    </div>
  );
}
