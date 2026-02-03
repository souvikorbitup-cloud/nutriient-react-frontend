import { NavLink } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-[#2b2b2b] to-[#1f1f1f] text-white relative z-0">
      <div className="app-container mx-auto px-4 py-16">
        {/* TOP LINKS */}
        <div className="grid gap-10 grid-cols-2 lg:grid-cols-4">
          {/* Explore */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="font-medium tracking-widest mb-4 pb-1 inline-block relative">
              Explore
              <span className="absolute h-0.5 w-6 bg-primary left-0 bottom-0"></span>
            </h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <NavLink to="/quiz">Take Health Assessment</NavLink>
              </li>
              <li>
                <NavLink to="/about-us">About Us</NavLink>
              </li>
              <li>
                <NavLink to="/terms-conditions">Terms & Conditions</NavLink>
              </li>
              <li>
                <NavLink to="/privacy-policy">Privacy Policy</NavLink>
              </li>
              <li>
                <NavLink to="/shipping-policy">Shipping Policy</NavLink>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-medium tracking-widest mb-4 pb-1 inline-block relative">
              Support
              <span className="absolute h-0.5 w-6 bg-primary left-0 bottom-0"></span>
            </h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <NavLink to="/login">Signin</NavLink>
              </li>
              <li>
                <NavLink to="/faq">FAQ</NavLink>
              </li>
              <li>
                <NavLink to="/contact-us">Contact Us</NavLink>
              </li>
              <li>
                <NavLink to="/refund-return-policy">Refund & Return</NavLink>
              </li>
              <li>
                <NavLink to="/">Track Your Order</NavLink>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-medium tracking-widest mb-4 pb-1 inline-block relative">
              Connect
              <span className="absolute h-0.5 w-6 bg-primary left-0 bottom-0"></span>
            </h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-center gap-2">
                <a
                  href="http://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fab fa-facebook-f" /> Facebook
                </a>
              </li>
              <li className="flex items-center gap-2">
                <a
                  href="http://instragram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fab fa-instagram" /> Instagram
                </a>
              </li>
              <li className="flex items-center gap-2">
                <a
                  href="http://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fab fa-youtube" /> Youtube
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="font-medium tracking-widest mb-4 pb-1 inline-block relative">
              Contact
              <span className="absolute h-0.5 w-6 bg-primary left-0 bottom-0"></span>
            </h4>

            <ul className="space-y-4 text-sm text-gray-300">
              <li className="flex items-center gap-3">
                <i className="fas fa-phone-alt" />
                Call/Customer Care - +918582841933
              </li>

              <li className="flex items-center gap-3">
                <i className="fab fa-whatsapp" />
                WhatsApp - +918582841933
              </li>

              <li className="flex items-center gap-3">
                <i className="fas fa-envelope" />
                Mail - info@nutrient.in
              </li>
            </ul>
          </div>
        </div>

        {/* DISCLAIMER */}
        <div className="mt-14 border border-gray-400 p-6 text-sm text-gray-200 leading-relaxed">
          <p>
            <strong>*</strong> Diet and Supplements are not meant to be a
            substitute for the advice provided by your doctor or other
            healthcare professional. Statements regarding supplements on our
            website have not been evaluated by the Food and Drug Administration
            or any government authority and are not intended to diagnose, treat,
            cure, or prevent any disease.
          </p>
        </div>

        {/* BOTTOM BAR */}
        <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-gray-300">
          <p>© {new Date().getFullYear()} Nutrient. All rights reserved.</p>

          <div className="flex gap-3 text-xl">
            <i className="fab fa-cc-paypal" />
            <i className="fab fa-cc-apple-pay" />
            <i className="fab fa-cc-visa" />
            <i className="fab fa-cc-mastercard" />
            <i className="fab fa-cc-amex" />
          </div>
        </div>
      </div>
    </footer>
  );
}
