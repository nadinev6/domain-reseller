import React, { useState } from 'react';
import { Check, Star, Zap, Crown, Shield, Headphones, Palette, Gift } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';
import { useCurrency } from '../context/CurrencyContext';
import { useAuth } from '../context/AuthContext';
import { AnimatedShinyText } from '../components/magicui/animated-shiny-text';

const PricingPage: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const { formatPrice } = useCurrency();
  const { user } = useAuth();

  const monthlyPrice = 20; // ZAR 20
  const annualPrice = 180; // ZAR 180 (equivalent to ZAR 15/month)

  const plans = [
    {
      id: 'monthly',
      name: 'Monthly Subscription',
      price: monthlyPrice,
      period: 'month',
      points: 200,
      monthlyPoints: 20,
      description: 'Perfect for getting started with VibePage',
      popular: false,
      features: [
        '200 points immediately',
        '+20 points each month',
        'Priority support',
        '4 free social media cards per month',
        'Landing page templates',
        'Pay per domain registration',
        'Multi-currency support',
        'Basic analytics'
      ],
      perks: [
        { icon: <Headphones className="w-4 h-4" />, text: 'Priority support' },
        { icon: <Palette className="w-4 h-4" />, text: 'Landing page templates' },
        { icon: <Gift className="w-4 h-4" />, text: '4 free cards monthly' },
        { icon: <Star className="w-4 h-4" />, text: '+20 points monthly' }
      ]
    },
    {
      id: 'annual',
      name: 'Annual Subscription',
      price: annualPrice,
      period: 'year',
      points: 1800,
      monthlyPoints: 200,
      description: 'Best value with enhanced features and savings',
      popular: true,
      features: [
        '1800 points immediately',
        '+200 points with each domain',
        'Enhanced priority support',
        '50 free social media cards',
        'All landing page templates',
        'Pay per domain with points',
        'Advanced analytics',
      ],
      perks: [
        { icon: <Crown className="w-4 h-4" />, text: 'Enhanced priority support' },
        { icon: <Zap className="w-4 h-4" />, text: 'Beta feature access' },
        { icon: <Palette className="w-4 h-4" />, text: '50 free cards included' },
        { icon: <Star className="w-4 h-4" />, text: '1800 points upfront' }
      ]
    }
  ];

  const selectedPlan = plans.find(plan => plan.id === billingCycle);

  const handleSubscribe = (planId: string) => {
    if (!user) {
      alert('Please sign in to subscribe to a plan.');
      return;
    }
    
    // TODO: Implement actual subscription logic
    alert(`Subscription to ${planId} plan coming soon! We'll notify you when payment processing is available.`);
  };

  const pointsFeatures = [
    {
      icon: <Star className="w-5 h-5 text-yellow-500" />,
      title: 'Earn Points',
      description: 'Get points with every domain purchase and monthly subscription'
    },
    {
      icon: <Gift className="w-5 h-5 text-purple-500" />,
      title: 'Redeem Rewards',
      description: 'Use points for domain purchases, premium templates, and exclusive features'
    },
    {
      icon: <Zap className="w-5 h-5 text-blue-500" />,
      title: 'Bonus Multipliers',
      description: 'Annual subscribers get bonus point multipliers on all activities'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose Your VibePage Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Unlock the full potential of VibePage with our subscription plans. Get points, premium features, and priority support.
          </p>
          
          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-white rounded-lg p-1 shadow-sm border">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                billingCycle === 'monthly'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 relative ${
                billingCycle === 'annual'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Annual
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                Save 25%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {plans.map((plan) => (
            <Card 
              key={plan.id}
              className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl flex flex-col ${
                plan.popular 
                  ? 'border-2 border-indigo-500 shadow-lg scale-105' 
                  : 'border border-gray-200 hover:border-indigo-300'
              } ${billingCycle === plan.id ? 'ring-2 ring-indigo-500' : ''}`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center py-2 text-sm font-medium">
                  <AnimatedShinyText className="text-white !mx-0 !max-w-none">
                    🎉 Best Value - Most Popular
                  </AnimatedShinyText>
                </div>
              )}
              
              <CardHeader className={plan.popular ? 'pt-12' : ''}>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  {plan.popular && <Crown className="w-6 h-6 text-yellow-500" />}
                </div>
                <CardDescription className="text-gray-600">
                  {plan.description}
                </CardDescription>
                
                <div className="mt-4 min-h-[60px]">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-gray-900">
                      {formatPrice(plan.price)}
                    </span>
                    <span className="text-gray-500 ml-2">/{plan.period}</span>
                  </div>
                  {plan.id === 'annual' && (
                    <p className="text-sm text-green-600 mt-1">
                      Equivalent to {formatPrice(plan.price / 12)}/month
                    </p>
                  )}
                </div>

                {/* Points Highlight */}
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 mt-4">
                  <div className="flex items-center justify-between min-h-[60px]">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Points Included</p>
                      <p className="text-2xl font-bold text-indigo-600">{plan.points} points</p>
                      {plan.monthlyPoints > 20 && (
                        <p className="text-sm text-green-600">+{plan.monthlyPoints} bonus points</p>
                      )}
                    </div>
                    <Star className="w-8 h-8 text-yellow-500" />
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex-grow flex flex-col">
                {/* Key Perks */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {plan.perks.map((perk, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm">
                      {perk.icon}
                      <span className="text-gray-700">{perk.text}</span>
                    </div>
                  ))}
                </div>

                {/* Features List */}
                <div className="space-y-3 mb-6 flex-grow">
                  <h4 className="font-medium text-gray-900">What's included:</h4>
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-auto min-h-[80px]">
                  <Button
                    onClick={() => handleSubscribe(plan.id)}
                    className={`w-full ${
                      plan.popular
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
                        : 'bg-indigo-600 hover:bg-indigo-700'
                    } text-white`}
                    size="lg"
                  >
                    {user ? 'Subscribe Now' : 'Sign Up to Subscribe'}
                  </Button>

                  {plan.popular && (
                    <p className="text-center text-sm text-gray-500 mt-3">
                      🔥 Limited time: Get 2 months free with annual plan
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Points System Explanation */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-center text-2xl">How the VibePage Points System Works</CardTitle>
            <CardDescription className="text-center">
              Earn points with subscriptions and purchases, then use them for domains and premium features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {pointsFeatures.map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3">Points Value Examples:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">.com domain registration:</span>
                  <span className="font-medium">~300 points</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">.co.za domain registration:</span>
                  <span className="font-medium">~100 points</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Premium card template:</span>
                  <span className="font-medium">50 points</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Priority support ticket:</span>
                  <span className="font-medium">25 points</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
            <CardDescription>
              Click on any question to expand the answer
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible defaultValue="item-0">
              <AccordionItem value="item-0">
                <AccordionTrigger className="text-left">
                  Can I change my plan anytime?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  Yes! You can upgrade or downgrade your plan at any time. Changes take effect at your next billing cycle.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left">
                  Do points expire?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  Points from subscriptions never expire as long as you maintain an active subscription. Bonus points from purchases expire after 12 months.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left">
                  What happens if I cancel?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  You'll retain access to all features until the end of your billing period. Your points will remain available for 30 days after cancellation.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center mt-12 p-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl text-white">
          <h2 className="text-2xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-indigo-100 mb-6 max-w-2xl mx-auto">
            Join thousands of users who are already building their online presence with VibePage. 
            Start with our {billingCycle} plan and unlock premium features today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => handleSubscribe(billingCycle)}
              size="lg"
              className="bg-white text-indigo-600 hover:bg-gray-100"
            >
              <AnimatedShinyText className="text-indigo-600 !mx-0 !max-w-none">
                {user ? 'Subscribe Now' : 'Sign Up & Subscribe'}
              </AnimatedShinyText>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;