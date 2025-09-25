import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";

export default function Landing() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-22 max-sm:p-2 items-center">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Welcome to Planora</h1>
        <p className="sm:text-lg">
          Keep your tasks, deadlines, and teamwork in one organized space. From
          planning to delivery, our app helps you stay focused and achieve more
          with less stress.
        </p>
        <Button className="self-start cursor-pointer" size="lg">
          Get Started
        </Button>
      </div>
      <div className="flex justify-center">
        <Image
          className="rounded-lg"
          src="/images/hero-image.png"
          alt="Hero Image"
          width={600}
          height={300}
        />
      </div>
    </div>
  );
}
