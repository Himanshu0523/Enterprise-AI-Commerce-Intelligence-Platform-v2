import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t bg-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <h3 className="font-semibold">Storefront</h3>
            <ul className="mt-2 space-y-2 text-sm text-gray-600">
              <li><Link href="/about">About</Link></li>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/faq">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold">Support</h3>
            <ul className="mt-2 space-y-2 text-sm text-gray-600">
              <li><Link href="/shipping-returns">Shipping & Returns</Link></li>
              <li><Link href="/terms">Terms</Link></li>
              <li><Link href="/privacy">Privacy</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold">Follow Us</h3>
            <ul className="mt-2 space-y-2 text-sm text-gray-600">
              <li><a href="#">Instagram</a></li>
              <li><a href="#">Facebook</a></li>
              <li><a href="#">Twitter</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold">Newsletter</h3>
            <p className="mt-2 text-sm text-gray-600">
              Sign up for exclusive offers.
            </p>
            <form className="mt-2 flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 rounded-l border border-gray-300 px-3 py-1 text-sm"
              />
              <button className="rounded-r bg-indigo-600 px-3 py-1 text-sm text-white">
                Subscribe
              </button>
            </form>
          </div>
        </div>
        <div className="mt-8 border-t pt-4 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} Storefront. All rights reserved.
        </div>
      </div>
    </footer>
  );
}