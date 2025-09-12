import { Check, Star, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started with AI-powered learning",
    features: [
      "5 chat messages per day",
      "1 study frame",
      "Basic material upload (PDF, images)",
      "Community support",
      "Basic AI explanations"
    ],
    cta: "Start Free",
    popular: false,
    color: "border-border"
  },
  {
    name: "Pro",
    price: "$12",
    period: "month",
    description: "Best for serious students and researchers",
    features: [
      "Unlimited chat messages",
      "Unlimited study frames",
      "Advanced material analysis",
      "YouTube & webpage integration",
      "Priority AI responses",
      "Export conversations",
      "Custom AI personalities",
      "Advanced search & organization",
      "Email support"
    ],
    cta: "Upgrade to Pro",
    popular: true,
    color: "border-primary ring-2 ring-primary"
  },
  {
    name: "Team",
    price: "$25",
    period: "month per user",
    description: "Ideal for study groups, classrooms, and institutions",
    features: [
      "Everything in Pro",
      "Up to 10 team members",
      "Shared study frames & materials",
      "Team collaboration tools",
      "Advanced analytics & insights", 
      "Admin dashboard & controls",
      "Single sign-on (SSO)",
      "Priority phone support",
      "Custom integrations"
    ],
    cta: "Start Team Plan",
    popular: false,
    color: "border-border"
  }
];

const faqs = [
  {
    question: "Can I switch between plans?",
    answer: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing differences."
  },
  {
    question: "What happens to my data if I cancel?",
    answer: "Your study frames and materials remain accessible for 30 days after cancellation. You can export your data or reactivate your subscription during this period."
  },
  {
    question: "Is there a student discount?",
    answer: "Yes! Students with a valid .edu email address get 50% off Pro and Team plans. Verify your student status during checkout."
  },
  {
    question: "How does the AI material analysis work?",
    answer: "Our AI can read and analyze PDFs, images, videos, and web content to provide contextual explanations and answer questions about your specific materials."
  },
  {
    question: "Can I use StudyBuddy offline?",
    answer: "StudyBuddy requires an internet connection for AI features. However, you can view previously loaded conversations and materials offline."
  }
];

export default function Pricing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">StudyBuddy</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/#features" className="text-foreground-muted hover:text-foreground transition-colors">Features</Link>
              <Link to="/#testimonials" className="text-foreground-muted hover:text-foreground transition-colors">Reviews</Link>
              <Link to="/pricing" className="text-foreground font-medium">Pricing</Link>
              <Link to="/login" className="text-foreground-muted hover:text-foreground transition-colors">Sign In</Link>
              <Link to="/signup">
                <Button className="bg-primary hover:bg-primary-hover text-primary-foreground">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-foreground-muted max-w-3xl mx-auto mb-8">
            Choose the perfect plan for your learning journey. Start free and scale as you grow.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-foreground-muted">
            <Check className="h-4 w-4 text-success" />
            <span>No hidden fees</span>
            <span className="text-border">•</span>
            <Check className="h-4 w-4 text-success" />
            <span>Cancel anytime</span>
            <span className="text-border">•</span>
            <Check className="h-4 w-4 text-success" />
            <span>30-day money back guarantee</span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-20">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative bg-card border-card-border ${plan.color} transition-all hover:shadow-lg`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground px-4 py-1 text-sm">
                    <Star className="h-3 w-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold text-card-foreground">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-5xl font-bold text-card-foreground">{plan.price}</span>
                  <span className="text-foreground-muted ml-1">/{plan.period}</span>
                </div>
                <CardDescription className="text-foreground-muted mt-3 text-base">
                  {plan.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <ul className="space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-success/10 flex items-center justify-center mt-0.5">
                        <Check className="h-3 w-3 text-success" />
                      </div>
                      <span className="text-card-foreground text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link to="/signup" className="block">
                  <Button 
                    className={`w-full mt-6 ${
                      plan.popular 
                        ? 'bg-primary hover:bg-primary-hover text-primary-foreground shadow-lg' 
                        : ''
                    }`}
                    variant={plan.popular ? "default" : "outline"}
                    size="lg"
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Student Discount Banner */}
        <div className="bg-gradient-primary rounded-2xl p-8 text-center mb-20 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-white mb-2">🎓 Student Discount Available</h2>
            <p className="text-white/90 mb-4">
              Get 50% off Pro and Team plans with your valid .edu email address
            </p>
            <Button variant="secondary" size="lg" className="bg-white text-primary hover:bg-white/90">
              Verify Student Status
            </Button>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary opacity-50"></div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {faqs.map((faq, index) => (
              <Card key={index} className="bg-card border-card-border">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-card-foreground mb-3">{faq.question}</h3>
                  <p className="text-foreground-muted text-sm leading-relaxed">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-20 p-12 bg-background-subtle rounded-2xl">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to Transform Your Learning?
          </h2>
          <p className="text-xl text-foreground-muted mb-8 max-w-2xl mx-auto">
            Join thousands of students already learning smarter with StudyBuddy's AI assistance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="bg-primary hover:bg-primary-hover text-primary-foreground px-8">
                Start Free Trial
              </Button>
            </Link>
            <Link to="/chat/demo">
              <Button variant="outline" size="lg" className="px-8">
                Try Demo First
              </Button>
            </Link>
          </div>
          <p className="text-sm text-foreground-muted mt-4">
            No credit card required • Free forever plan available
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-background-subtle">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <Link to="/" className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-foreground">StudyBuddy</span>
              </Link>
              <p className="text-foreground-muted text-sm">
                Your AI-powered learning companion for academic success.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-foreground mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-foreground-muted">
                <li><Link to="/#features" className="hover:text-foreground transition-colors">Features</Link></li>
                <li><Link to="/pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
                <li><Link to="/chat/demo" className="hover:text-foreground transition-colors">Try Demo</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-foreground mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-foreground-muted">
                <li><a href="#" className="hover:text-foreground transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Documentation</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-foreground mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-foreground-muted">
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 text-center text-foreground-muted text-sm">
            <p>&copy; 2024 StudyBuddy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}