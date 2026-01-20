import { Link } from 'react-router-dom';
import { Check, Pencil } from 'lucide-react';

export default function Pricing() {
  const plans = [
    {
      name: 'Free',
      price: '₹0',
      period: 'forever',
      description: 'Perfect for getting started',
      features: [
        'Basic drawing tools',
        'Up to 5 canvases',
        'Limited exports (PNG only)',
        'Public sharing',
        'Community support',
      ],
      cta: 'Get Started',
      popular: false,
    },
    {
      name: 'Pro',
      price: '₹499',
      period: 'per month',
      description: 'For individuals and small teams',
      features: [
        'Unlimited canvases',
        'Real-time collaboration',
        'Version history',
        'All export formats (PNG, SVG, PDF)',
        'Cloud storage',
        'Priority support',
        'Custom templates',
        'Advanced drawing tools',
      ],
      cta: 'Start Pro Trial',
      popular: true,
    },
    {
      name: 'Business',
      price: '₹1,499',
      period: 'per month',
      description: 'For growing businesses',
      features: [
        'Everything in Pro',
        'Team workspaces',
        'Advanced analytics',
        'Custom branding',
        'Admin controls',
        'API access',
        'SSO integration',
        'Dedicated support',
        'Training sessions',
      ],
      cta: 'Start Business Trial',
      popular: false,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'contact us',
      description: 'For large organizations',
      features: [
        'Everything in Business',
        'Custom integrations',
        'Advanced security',
        'Unlimited team members',
        'SLA guarantee',
        'On-premise deployment',
        'White-label solution',
        'Dedicated account manager',
        'Custom contract terms',
      ],
      cta: 'Contact Sales',
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <nav className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Pencil className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-slate-900">EZdraw</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="px-4 py-2 text-slate-700 hover:text-slate-900 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-slate-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Choose the perfect plan for your needs. All plans include a 14-day free trial.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all hover:shadow-2xl ${
                plan.popular
                  ? 'border-blue-600 scale-105'
                  : 'border-slate-200 hover:border-blue-300'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-600 text-white text-sm font-semibold rounded-full">
                  Most Popular
                </div>
              )}

              <div className="p-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                <p className="text-slate-600 text-sm mb-6">{plan.description}</p>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                  </div>
                  <p className="text-slate-600 text-sm">{plan.period}</p>
                </div>

                <Link
                  to="/signup"
                  className={`block w-full py-3 text-center font-semibold rounded-lg transition-colors ${
                    plan.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  {plan.cta}
                </Link>

                <ul className="mt-8 space-y-4">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-slate-600 mb-6">
            Need a custom solution? We're here to help.
          </p>
          <Link
            to="/signup"
            className="inline-block px-8 py-4 bg-slate-900 text-white text-lg font-medium rounded-lg hover:bg-slate-800 transition-colors"
          >
            Contact Our Sales Team
          </Link>
        </div>

        <div className="mt-16 bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">
                Can I switch plans at any time?
              </h3>
              <p className="text-slate-600 text-sm">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately and we'll prorate any payment differences.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-slate-600 text-sm">
                We accept all major credit cards, debit cards, and digital payment methods through our secure payment processor.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">
                Is there a free trial?
              </h3>
              <p className="text-slate-600 text-sm">
                Yes! All paid plans come with a 14-day free trial. No credit card required to start.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">
                What happens to my data if I cancel?
              </h3>
              <p className="text-slate-600 text-sm">
                Your data remains accessible for 30 days after cancellation. You can export all your canvases during this period.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
