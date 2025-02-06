import React from 'react';
import { Button } from 'flowbite-react';

export default function NavbarLoggedout() {
  return (
    <div className="flex md:order-2 gap-3 md:gap-0 rtl:gap-reverse items-center">
      <Button 
        href="/register"
        color="primary" 
        className="mr-2 bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 text-white"
      >
        Sign Up
      </Button>
      
      <Button 
        href="/login"
        color="success"
        className="bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 text-white"
      >
        Sign In
      </Button>
    </div>
  );
}
