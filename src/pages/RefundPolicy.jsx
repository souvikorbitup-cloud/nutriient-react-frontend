import React from "react";
import Heading from "../Utils/Heading";
import { NavLink } from "react-router-dom";

const RefundPolicy = () => {
  return (
    <section className="w-full bg-white">
      <div className="app-container mx-auto px-4 py-32">
        {/* Header */}
        <Heading text={"Return and Refund Policy"} />

        {/* Content */}
        <div className="space-y-8 px-6 py-8 sm:px-8 sm:py-10 rounded-md bg-white shadow-sm ring-1 ring-gray-200 mt-3 text-sm leading-relaxed text-gray-600">
          <div>
            <h2 className="font-semibold text-gray-900">Returns</h2>
            <p className="mt-2">
              Our policy lasts 30 days. If 30 days have gone by since your
              purchase, unfortunately, we can’t offer you a refund or exchange.
            </p>
            <p className="mt-2">
              To be eligible for a return, your item must be unused and in the
              same condition that you received it. It must also be in the
              original packaging.
            </p>
            <p className="mt-2">
              To complete your return, we require a receipt or proof of
              purchase.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-gray-900">
              Refunds (if applicable)
            </h2>
            <p className="mt-2">
              Once your return is received and inspected, we will send you an
              email to notify you that we have received your returned item. We
              will also notify you of the approval or rejection of your refund.
            </p>
            <p className="mt-2">
              If you are approved, then your refund will be processed, and a
              credit will automatically be applied to your credit card or
              original method of payment, within 2 days.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-gray-900">
              Late or missing refunds (if applicable)
            </h2>
            <p className="mt-2">
              If you haven’t received a refund yet, first check your bank
              account again. Then contact your credit card company, it may take
              some time before your refund is officially posted.
            </p>
            <p className="mt-2">
              Next contact your bank. There is often some processing time before
              a refund is posted. If you’ve done all of this and you still have
              not received your refund yet, please contact us at
              info@nutriient.in.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-gray-900">
              Exchanges (if applicable)
            </h2>
            <p className="mt-2">
              We only replace items if they are defective or damaged. If you
              need to exchange it for the same item, send us an email at
              info@nutriient.in and send your item to: Digital Hub, Basudevpur,
              Belkulai, Howrah- 711322, West Bengal, India.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-gray-900">Shipping</h2>
            <p className="mt-2">
              To return your product, you should mail your product to: Digital
              Hub, Basudevpur, Belkulai, Howrah- 711322, West Bengal, India.
            </p>
            <p className="mt-2">
              You will be responsible for paying for your own shipping costs for
              returning your item. Shipping costs are non-refundable. If you
              receive a refund, the cost of return shipping will be deducted
              from your refund
            </p>
            <p className="mt-2">
              Depending on where you live, the time it may take for your
              exchanged product to reach you may vary.
            </p>
            <p className="mt-2">
              If you are shipping an item, you should consider using a trackable
              shipping service. We don’t guarantee that we will receive your
              returned item.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-gray-900">CONTACT US</h2>
            <p className="mt-2">
              To issue a refund or cancelation of your order please send a mail
              to info@nutriient.in or contact via our contact us page.{" "}
              <NavLink
                to="/contact-us"
                className="text-primary hover:text-secondary"
              >
                Contac Us
              </NavLink>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RefundPolicy;
