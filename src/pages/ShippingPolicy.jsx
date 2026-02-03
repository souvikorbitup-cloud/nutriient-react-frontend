import React from "react";
import Heading from "../Utils/Heading";

const ShippingPolicy = () => {
  return (
    <section className="w-full bg-white">
      <div className="app-container mx-auto px-4 py-32">
        {/* Header */}
        <Heading text={"Shipping Policy"} />

        {/* Content */}
        <div className="space-y-8 px-6 py-8 sm:px-8 sm:py-10 rounded-md bg-white shadow-sm ring-1 ring-gray-200 mt-3 text-sm leading-relaxed text-gray-600">
          <p>
            Digital Hub ("we" and "us") is the operator of
            (https://nutriient.in) ("Website" and Brand Name “Nutriient India”).
            By placing an order through this Website you will be agreeing to the
            terms below. These are provided to ensure both parties are aware of
            and agree upon this arrangement to mutually protect and set
            expectations on our service.
          </p>

          <div>
            <h2 className="font-semibold text-gray-900">1. General</h2>
            <p className="mt-2">
              Subject to stock availability. We try to maintain accurate stock
              counts on our website but from time-to-time there may be a stock
              discrepancy and we will not be able to fulfill all your items at
              time of purchase. In this instance, we will fulfill the available
              products to you, and contact you about whether you would prefer to
              await restocking of the backordered item or if you would prefer
              for us to process a refund.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-gray-900">2. Shipping Costs</h2>
            <p className="mt-2">
              Shipping costs are calculated during checkout based on weight,
              dimensions and destination of the items in the order. Payment for
              shipping will be collected with the purchase. This price will be
              the final price for shipping cost to the customer.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-gray-900">3. Returns</h2>
            <div className="pl-2">
              <h3 className="mt-2 font-semibold text-gray-800">
                3.1 Return Due to Change of Mind
              </h3>
              <p className="mt-2">
                Nutriient India will happily accept returns due to change of
                mind as long as a request to return is received by us within 15
                days of receipt of item and are returned to us in original
                packaging, unused and in resellable condition. Return shipping
                will be paid at the customers expense and will be required to
                arrange their own shipping.
              </p>
              <p className="mt-2">
                Once returns are received and accepted, refunds will be
                processed to store credit for a future purchase. We will notify
                you once this has been completed through email. (Nutriient
                India) will refund the value of the goods returned but will NOT
                refund the value of any shipping paid.
              </p>

              <h3 className="mt-2 font-semibold text-gray-800">
                3.2 Warranty Returns
              </h3>
              <p className="mt-2">
                Nutriient India will happily honor any valid warranty claims,
                provided a claim is submitted within 90 days of receipt of
                items. Customers will be required to pre-pay the return
                shipping, however we will reimburse you upon successful warranty
                claim. Upon return receipt of items for warranty claim, you can
                expect Nutriient India to process your warranty claim within 7
                days.
              </p>
              <p className="mt-2 font-semibold">
                Once warranty claim is confirmed, you will receive the choice
                of:
              </p>
              <ul className="space-y-1">
                {[
                  "(a) refund to your payment method",
                  "(b) a refund in store credit",
                  "(c) a replacement item sent to you (if stock is available)",
                ].map((item, i) => (
                  <li key={i} className="flex gap-2 pl-1.5">
                    <span className="text-primary">●</span>
                    <span className="text-[#444] font-normal">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <h2 className="font-semibold text-gray-900">4. Delivery Terms</h2>
            <div className="pl-2">
              <h3 className="mt-2 font-semibold text-gray-800">
                4.1 Transit Time Domestically
              </h3>
              <p className="mt-2">
                In general, domestic shipments are in transit for 2 - 7 days
              </p>
              <p className="mt-2">
                When you register for an Account, we may ask for your contact
                information, including items such as name, company name,
                address, email address, and telephone number.
              </p>

              <h3 className="mt-2 font-semibold text-gray-800">
                4.4 Change of Delivery Address
              </h3>
              <p className="mt-2">
                Orders placed before 06 PM - IST will be dispatched the same
                day, otherwise, within the next business day. Our warehouse
                operates on Monday - Friday during standard business hours,
                except on national holidays at which time the warehouse will be
                closed. In these instances, we take steps to ensure shipment
                delays will be kept to a minimum. For change of delivery address
                requests, we are able to change the address at any time before
                the order has been dispatched.
              </p>

              <h3 className="mt-2 font-semibold text-gray-800">
                4.5 P.O. Box Shipping
              </h3>
              <p className="mt-2">
                Nutriient India will ship to P.O. box addresses using postal
                services only. We are unable to offer couriers services to these
                locations.
              </p>

              <h3 className="mt-2 font-semibold text-gray-800">
                4.6 Military Address Shipping
              </h3>
              <p className="mt-2">
                We are able to ship to military addresses using USPS. We are
                unable to offer this service using courier services
              </p>
            </div>
          </div>

          <div>
            <h2 className="font-semibold text-gray-900">
              5. Tracking Notifications
            </h2>
            <p className="mt-2">
              Upon dispatch, customers will receive a tracking link from which
              they will be able to follow the progress of their shipment based
              on the latest updates made available by the shipping provider.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-gray-900">
              6. Parcels Damaged in Transit
            </h2>
            <p className="mt-2">
              I If you find a parcel is damaged in-transit, if possible, please
              reject the parcel from the courier and get in touch with our
              customer service. If the parcel has been delivered without you
              being present, please contact customer service with next steps.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-gray-900">7. Duties & Taxes</h2>
            <div className="pl-2">
              <h3 className="mt-2 font-semibold text-gray-800">7.1 GST Tax</h3>
              <p className="mt-2">
                GST tax has already been applied to the price of the goods as
                displayed on the website
              </p>
            </div>
          </div>

          <div>
            <h2 className="font-semibold text-gray-900">8. Cancellations</h2>
            <p className="mt-2">
              If you change your mind before you have received your order, we
              are able to accept cancellations at any time before the order has
              been dispatched. If an order has already been dispatched, please
              refer to our refund policy.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-gray-900">9. Insurance</h2>
            <p className="mt-2">
              Parcels are insured for loss and damage up to the value as stated
              by the courier.
            </p>
            <div className="pl-2">
              <h3 className="mt-2 font-semibold text-gray-800">
                9.1 Damaged In-Transit
              </h3>
              <p className="mt-2">
                We will process a refund or replacement as soon as the courier
                has completed their investigation into the claim.
              </p>
              <h3 className="mt-2 font-semibold text-gray-800">
                9.2 Lost In-Transit
              </h3>
              <p className="mt-2">
                We will process a refund or replacement as soon as the courier
                has conducted an investigation and deemed the parcel lost.
              </p>
            </div>
          </div>

          <div>
            <h2 className="font-semibold text-gray-900">
              10. Customer Service
            </h2>
            <p className="mt-2">
              For all customer service enquiries, please submit an enquiry at
              https://nutriient.in/contact
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShippingPolicy;
