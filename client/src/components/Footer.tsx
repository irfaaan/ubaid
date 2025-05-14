import { Link } from "wouter";
import { SmartphoneIcon } from "lucide-react";
import { FaTwitter, FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 rounded-full gradient-bg flex items-center justify-center mr-3">
                <SmartphoneIcon className="text-white" size={20} />
              </div>
              <span className="font-bold text-xl">GalaxyAdvisor</span>
            </div>
            <p className="text-sm text-white/80 mb-4">
              Your trusted source for Samsung Galaxy advice, comparisons, and upgrade recommendations.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-[#1428A0] transition-colors">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-white hover:text-[#1428A0] transition-colors">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-white hover:text-[#1428A0] transition-colors">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-white hover:text-[#1428A0] transition-colors">
                <FaYoutube size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Explore</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-white/80 hover:text-[#1428A0] transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/compare" className="text-white/80 hover:text-[#1428A0] transition-colors">Compare Phones</Link>
              </li>
              <li>
                <Link href="/best-upgrades" className="text-white/80 hover:text-[#1428A0] transition-colors">Best Upgrades</Link>
              </li>
              <li>
                <Link href="/feature-guides" className="text-white/80 hover:text-[#1428A0] transition-colors">Feature Guides</Link>
              </li>
              <li>
                <Link href="/sell-your-phone" className="text-white/80 hover:text-[#1428A0] transition-colors">Sell Your Phone</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Popular Comparisons</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/compare" className="text-white/80 hover:text-[#1428A0] transition-colors">S24 vs S24+</Link>
              </li>
              <li>
                <Link href="/compare" className="text-white/80 hover:text-[#1428A0] transition-colors">S24 vs A54</Link>
              </li>
              <li>
                <Link href="/compare" className="text-white/80 hover:text-[#1428A0] transition-colors">Z Fold5 vs S24 Ultra</Link>
              </li>
              <li>
                <Link href="/compare" className="text-white/80 hover:text-[#1428A0] transition-colors">S23 vs S24</Link>
              </li>
              <li>
                <Link href="/compare" className="text-white/80 hover:text-[#1428A0] transition-colors">A53 vs A54</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-white/80 hover:text-[#1428A0] transition-colors">About Us</Link>
              </li>
              <li>
                <Link href="/" className="text-white/80 hover:text-[#1428A0] transition-colors">Contact</Link>
              </li>
              <li>
                <Link href="/" className="text-white/80 hover:text-[#1428A0] transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/" className="text-white/80 hover:text-[#1428A0] transition-colors">Terms of Service</Link>
              </li>
              <li>
                <Link href="/" className="text-white/80 hover:text-[#1428A0] transition-colors">FAQ</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center text-sm text-white/60">
          <p>© {new Date().getFullYear()} GalaxyAdvisor. All rights reserved. Not affiliated with Samsung Electronics.</p>
          <p className="mt-2">Samsung and Galaxy are registered trademarks of Samsung Electronics Co., Ltd.</p>
        </div>
      </div>
    </footer>
  );
}
