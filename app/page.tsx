import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-black p-8 transition-colors duration-300">
      <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-gray-100 mb-4">
        Welcome to Memorize
      </h1>
      <p className="text-lg text-center text-gray-700 dark:text-gray-300 mb-6 max-w-2xl">
        A professional learning platform designed for neuro-cognitive mastery.
      </p>
      <div className="flex space-x-4 mb-6">
        <Button asChild>
          <a href="/login">
            Get Started
          </a>
        </Button>
        <Button variant="outline" asChild>
          <a href="/about">
            Learn More
          </a>
        </Button>
      </div>
      <ThemeToggle />
    </div>
  );
}
