export default function Policy() {
  return (
    <>
              {/* Returns & Refunds */}
              <h2 className="text-2xl font-semibold text-gray-900">
                Returns & Refunds Policy
              </h2>

              <p className="text-sm text-gray-600">
                At <span className="font-medium text-gray-800">Atlastech</span>, we aim to
                ensure customer satisfaction. Please review our refund conditions below.
              </p>

              <div className="space-y-3 text-sm text-gray-700">
                <div>
                  <h3 className="font-semibold text-gray-900">Eligibility for Refunds</h3>
                  <ul className="list-disc pl-5">
                    <li>Service not delivered due to a technical issue</li>
                    <li>Product does not match its description</li>
                    <li>Duplicate or incorrect billing</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">Non-Refundable Cases</h3>
                  <ul className="list-disc pl-5">
                    <li>Change of mind after activation</li>
                    <li>Fully used or completed services</li>
                    <li>Downloaded digital products</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">Request Timeframe</h3>
                  <p>
                    Refund requests must be submitted within{" "}
                    <span className="font-medium">14 days</span> of purchase.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">How to Request</h3>
                  <p>
                    Contact us at{" "}
                    <a
                      href="mailto:support@atlastech.com"
                      className="font-medium text-blue-600 hover:underline"
                    >
                      support@atlastech.com
                    </a>{" "}
                    with your order ID and reason.
                  </p>
                </div>
            </div>
</>
  )
}
