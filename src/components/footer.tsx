"use client"
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="bg-gray-100 dark:bg-gray-900 border-t mt-12"
      aria-label="Site footer"
      role="contentinfo"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-1 text-center md:text-left">
            <h3 className="text-xl sm:text-3xl font-bold text-primary mb-3 sm:mb-4">
              Mehkova
            </h3>
            <p className="text-muted-foreground text-xs sm:text-base">
              Premium fashion and jewelry <br /> for the modern individual.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-1 text-center md:text-left">
            <h4 className="text-sm font-semibold text-foreground mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-muted-foreground hover:text-primary">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="md:col-span-1 text-center md:text-left">
            <h4 className="text-sm font-semibold text-foreground mb-4">
              Legal
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-sm text-muted-foreground hover:text-primary">
                  Returns & Refunds
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-center text-xs sm:text-sm text-muted-foreground">
            © {currentYear} Mehkova. Built by Oluwafunmike Adeyeye. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
