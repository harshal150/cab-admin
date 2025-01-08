import { FC, useState } from 'react';
import { Field, ErrorMessage } from 'formik';
import { Button, Modal } from 'react-bootstrap'; // Import React-Bootstrap components

const MerchantOnboardingStep4: FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<string>(''); // Track selected plan
  const [expanded, setExpanded] = useState<boolean>(false);
  const [customFeatures, setCustomFeatures] = useState<boolean[]>(
    new Array(20).fill(false).map((_, index) => index < 3) // First 3 features are pre-selected
  );
  const [isHovered, setIsHovered] = useState<number | null>(null); // State to track hovered card
  const [showModal, setShowModal] = useState<boolean>(false); // Modal visibility state
  const [selectedPlanName, setSelectedPlanName] = useState<string>(''); // Store selected plan name to display in text field

  const handlePlanSelect = (plan: string) => {
    setSelectedPlan(plan);
  };

  const handleContinueWithSelected = () => {
    setSelectedPlanName(selectedPlan); // Set the selected plan name
    setShowModal(false); // Close modal
  };

  const handleFeatureToggle = (index: number) => {
    const updatedFeatures = [...customFeatures];
    updatedFeatures[index] = !updatedFeatures[index];
    setCustomFeatures(updatedFeatures);
  };

  const calculateCustomPrice = () => {
    const basePrice = 3000; // Base price for the custom plan
    const additionalFeatures = customFeatures.filter(feature => feature).length - 3; // Subtract 3 mandatory features
    return basePrice + additionalFeatures * 1000;
  };

  // Features object
  const featuresList = [
    { title: "Streamlined Payment Processing", description: "Accept payments quickly and easily with our user-friendly interface." },
    { title: "Multi-Channel Support", description: "Integrate payments across various platforms including web, mobile, and in-store." },
    { title: "Real-Time Analytics", description: "Get insights into sales trends and customer behavior with real-time data." },
    { title: "Automated Billing", description: "Automate your billing process to save time and reduce errors." },
    { title: "Fraud Detection", description: "Advanced algorithms to detect and prevent fraudulent transactions." },
    { title: "Customer Management", description: "Manage customer profiles, preferences, and purchase history." },
    { title: "Integration with Accounting Software", description: "Seamlessly integrate with popular accounting software for easy financial management." },
    { title: "Mobile Payments", description: "Allow customers to pay using their mobile devices for convenience." },
    { title: "Subscription Management", description: "Manage recurring payments effortlessly for subscription-based businesses." },
    { title: "Customizable Payment Pages", description: "Create and customize payment pages that match your brand." },
    { title: "24/7 Customer Support", description: "Get help whenever you need it with our dedicated support team." },
    { title: "Secure Transactions", description: "Ensure every transaction is safe and secure with top-notch encryption." },
    { title: "Flexible Payment Options", description: "Support for credit cards, debit cards, e-wallets, and more." },
    { title: "Reporting and Insights", description: "Generate reports to track performance and make informed business decisions." },
    { title: "User-Friendly Dashboard", description: "Manage everything from a simple and intuitive dashboard." },
    { title: "Loyalty Program Integration", description: "Integrate with loyalty programs to reward your customers." },
    { title: "Multi-Currency Support", description: "Accept payments in various currencies to cater to a global audience." },
    { title: "Custom API Solutions", description: "Get custom API solutions tailored to your business needs." },
    { title: "Email Notifications", description: "Keep your customers informed with automatic email notifications." },
    { title: "User Role Management", description: "Manage user access and roles for your team effortlessly." },
    { title: "Data Backup and Recovery", description: "Automatic data backup and recovery solutions to safeguard your data." },
    { title: "Website Integration", description: "Easily integrate payment solutions into your existing website." },
  ];

  return (
    <div className='w-100'>
      <div className='pb-10 pb-lg-15'>
        <h2 className='fw-bolder d-flex align-items-center text-dark'>
          Our Plan
          <i
            className='fas fa-exclamation-circle ms-2 fs-7'
            data-bs-toggle='tooltip'
            title='Billing is issued based on your selected account type'
          ></i>
        </h2>
        <div className='text-gray-400 fw-bold fs-6'>
          If you need more info, please check out
          <a href='/dashboard' className='link-primary fw-bolder'>
            {' '}
            Help Page
          </a>
          .
        </div>
      </div>

      {/* Button to open the modal */}
      <Button variant="primary" onClick={() => setShowModal(true)} className="mb-4">
        Choose Plan
      </Button>

      {/* Conditionally display selected plan field */}
      {selectedPlanName && (
        <div className="mb-3">
          <label className="form-label">Selected Plan</label>
          <input
            type="text"
            className="form-control"
            value={selectedPlanName}
            readOnly
          />
        </div>
      )}

      {/* Modal with pricing cards */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="xl" centered>
        <Modal.Header closeButton>
          <Modal.Title>Select Your Plan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='row'>
            {[
              { id: 'basic', name: 'Basic', price: 7000, features: 10 },
              { id: 'premium', name: 'Premium', price: 12000, features: 20 },
              { id: 'advanced', name: 'Advanced', price: 18000, features: 25 }, // New Advanced plan
              { id: 'custom', name: 'Custom', price: calculateCustomPrice(), features: 30 }
            ].map((plan, index) => (
              <div className='col-lg-3 mb-4' key={index}>
                <div
                  className={`card p-3 shadow-lg ${selectedPlan === plan.id ? 'border border-success' : 'border border-light'}`}
                  style={{
                    transition: 'transform 0.4s ease, background-color 0.4s ease',
                    transform: isHovered === index
                      ? 'scale(1.1)' // Zoom in the hovered card
                      : isHovered !== null
                      ? 'scale(0.95)' // Zoom out the non-hovered cards only when a card is hovered
                      : 'scale(1)', // Normal state when no card is hovered
                    background: isHovered === index ? 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)' : 'white',
                    boxShadow: isHovered === index ? '0 8px 20px rgba(0, 0, 0, 0.3)' : '0 4px 10px rgba(0, 0, 0, 0.15)',
                    borderWidth: selectedPlan === plan.id ? '4px' : '1px', // Thicker border for selected plan
                  }}
                  onMouseEnter={() => {
                    setIsHovered(index);
                  }}
                  onMouseLeave={() => {
                    setIsHovered(null);
                  }}
                  onClick={() => handlePlanSelect(plan.id)}
                >
                  <div className='card-body' style={{ background: isHovered === index ? 'inherit' : 'inherit' }}>
                    <h2 className='fw-bolder text-center mb-4' style={{ color: isHovered === index ? 'white' : 'black', fontSize: '1.5rem' }}>
                      {plan.name}
                    </h2>
                    <h4 className='fw-bold text-center mb-4' style={{ color: isHovered === index ? 'white' : 'black' }}>
                      {plan.price} INR
                    </h4>

                    {/* Features List */}
                    <ul className='list-unstyled'>
                      {featuresList.slice(0, 7).map((feature, featureIndex) => (
                        <li key={featureIndex} className='d-flex align-items-center justify-content-between mb-2' style={{ fontSize: '0.9rem', color: isHovered === index ? 'white' : '#333' }}>
                          <span className='fw-bold'>{feature.title}</span>
                          <i
                            className={`bi bi-${featureIndex < plan.features ? 'check' : 'x'}-circle-fill`}
                            style={{
                              color: featureIndex < plan.features 
                                ? isHovered === index 
                                  ? 'lightgreen' 
                                  : 'green' 
                                : isHovered === index 
                                  ? 'lightcoral' 
                                  : 'red', // Lighter colors on hover
                              fontSize: '1.2rem'
                            }}
                          ></i>
                        </li>
                      ))}
                    </ul>

                    {expanded ? (
                      <>
                        <ul className='list-unstyled'>
                          {featuresList.slice(7).map((feature, featureIndex) => (
                            <li key={featureIndex + 7} className='d-flex align-items-center justify-content-between mb-2' style={{ fontSize: '0.9rem', color: isHovered === index ? 'white' : '#333' }}>
                              <span className='fw-bold'>{feature.title}</span>
                              <span>
                                {plan.id === 'custom' ? (
                                  <div>
                                    <input
                                      type="checkbox"
                                      checked={customFeatures[featureIndex + 7]}
                                      onChange={() => handleFeatureToggle(featureIndex + 7)}
                                    />
                                  </div>
                                ) : (
                                  <i
                                    className={`bi bi-${featureIndex + 7 < plan.features ? 'check' : 'x'}-circle-fill`}
                                    style={{
                                      color: featureIndex + 7 < plan.features 
                                        ? isHovered === index 
                                          ? 'lightgreen' 
                                        : 'green' 
                                        : isHovered === index 
                                          ? 'lightcoral' 
                                        : 'red', // Lighter colors on hover
                                      fontSize: '1.2rem'
                                    }}
                                  ></i>
                                )}
                              </span>
                            </li>
                          ))}
                        </ul>
                        <div className='text-center'>
                          <button
                            className='btn btn-outline-light mt-3'
                            style={{
                              borderRadius: '25px',
                              borderColor: isHovered === index ? 'white' : '#ccc',
                              color: isHovered === index ? 'white' : 'black',
                              backgroundColor: isHovered === index ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                            }}
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent triggering the card selection
                              setExpanded(false);
                            }}
                          >
                            See Less
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className='text-center'>
                        <button
                          className='btn btn-outline-light'
                          style={{
                            borderRadius: '25px',
                            borderColor: isHovered === index ? 'white' : '#ddd',
                            color: isHovered === index ? 'white' : '#777',
                            backgroundColor: isHovered === index ? 'rgba(255, 255, 255, 0.2)' : '#f7f7f7',
                          }}
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent triggering the card selection
                            setExpanded(true);
                          }}
                        >
                          Read More
                        </button>
                      </div>
                    )}

                    <button
                      className='btn get-started-button w-100 mt-4'
                      style={{
                        borderRadius: '25px',
                        backgroundColor: isHovered === index ? 'white' : 'transparent',
                        color: isHovered === index ? '#004187' : 'black',
                        fontWeight: 'bold',
                        border: '2px solid',
                        borderColor: isHovered === index ? '#004187' : 'black',
                        overflow: 'hidden',
                        position: 'relative',
                        width: '100%',
                        maxWidth: '250px',
                        margin: '0 auto'
                      }}
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering the card selection
                        handlePlanSelect(plan.id);
                      }}
                    >
                      <span className="button-text">
                        Get&nbsp;Started
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleContinueWithSelected} disabled={!selectedPlan}>
            Continue with Selected
          </Button>
        </Modal.Footer>
      </Modal>

      <div className='text-danger mt-2'>
        <ErrorMessage name='paymentEnvironment' />
      </div>
    </div>
  );
};

export { MerchantOnboardingStep4 };
