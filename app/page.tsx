import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { auth } from "@clerk/nextjs/server";
import { ArrowRight, BarChart3, CheckCircle, icons, Palette, Shield, Smartphone, Users, Zap } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

const features = [
  {
    icon: <Palette className="size-8" />,
    title: "Fully Customizable",
    description: "Design your link page with our intuitive drag-and-drop editor. Choose from a variety of themes, colors, and fonts to match your brand.",
  },
  {
    icon: <BarChart3 className="size-8" />,
    title: "Analytics Dashboard",
    description: "Track clicks, views, and engagement metrics with our built-in analytics. Gain insights into your audience and optimize your content.",
  },
  {
    icon: <Smartphone className="size-8" />,
    title: "Mobile Optimized",
    description: "Your link page looks great on any device. Our responsive design ensures a seamless experience for your visitors, whether on desktop or mobile.",
  },
  {
    icon: <Zap className="size-8" />,
    title: "Fast and Reliable",
    description: "Experience lightning-fast loading times and 99.9% uptime. Our infrastructure is built to handle high traffic and ensure your links are always accessible.",
  },
  {
    icon: <Shield className="size-8" />,
    title: "Secure and Private",
    description: "We prioritize your security and privacy. All links are served over HTTPS, and we never sell your data. Your information is safe with us.",
  },
  {
    icon: <Users className="size-8" />,
    title: "Collaborative Features",
    description: "Invite team members to collaborate on your link page. Share access with colleagues, friends, or clients to manage links together.",
  }
]

const testimonials = [
  {
    name: "Jane Doe",
    role: "Influencer",
    content: "This tool has transformed how I share my content. It's so easy to use and looks amazing!",
    rating: 5
  },
  {
    name: "John Smith",
    role: "Business Owner",
    content: "A must-have for any business looking to streamline their online presence. Highly recommend!",
    rating: 5
  },
  {
    name: "Alice Johnson",
    role: "Content Creator",
    content: "I love the customization options! My link page perfectly reflects my brand.",
    rating: 5
  }
];

export default async function Home() {

  const { userId } = await auth();

  if (userId){
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">

      {/* Header Section */}
      <Header isFixed={true} />

      {/* Hero section */}
      <section className="px-4 py-20 lg:px-8 lg:py-32">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8">
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight">
                One Link, 
                <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                  {" "}
                  Infinite Possibilities
                </span>
              </h1>
              <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto"></div>
            </div>

            <p className="text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Create a single link that connects all your social media profiles, websites, and more. 
              Perfect for sharing on social media, email signatures, and anywhere else you want to showcase your online presence.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-8 py-6 h-auto"
              >
                <Link href="/dashboard" className="flex items-center gap-2">
                  Start Building Free
                  <ArrowRight className="size-5" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white text-lg px-8 py-6 h-auto"
              >
                <Link href="#features">See How It Works</Link>
              </Button>
            </div>

            <div className="pt-12">
              <p className="text-sm text-gray-500 mb-4">
                Trusted by 10,000+ users worldwide, including influencers, businesses, and creators.
              </p>
              <div className="flex justify-center items-center gap-8 opacity-50">
                <div className="text-2xl font-bold text-gray-400">Creator</div>
                <div className="text-2xl font-bold text-gray-400">Business</div>
                <div className="text-2xl font-bold text-gray-400">Influencer</div>
                <div className="text-2xl font-bold text-gray-400">Artist</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-4 lg:px-8 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Everything You Need in One Place
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to enhance your online presence and engagement.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"> 
            {features.map((feature, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-xl shadow-gray-200/50 hover:shadow-2xl transition-all duration-300">
                <div className="text-purple-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="px-4 lg:px-8 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Loved by Creators
            </h2>
            <p className="text-xl text-gray-600">
              See what our users are saying about us
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-xl shadow-gray-200/50 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <icons.Star key={i} className="size-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  &ldquo;{testimonial.content}&rdquo;
                </p>
                <div>
                  <div className="semi-bold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="px-4 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-12 lg:p-16 text-center text-white shadow-2xl">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Ready to Elevate Your Online Presence?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of creators, businesses, and influencers who trust us to manage their online links.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                asChild
                size="lg"
                className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-6 h-auto font-semibold"
              >
                <Link href="/dashboard" className="flex items-center gap-2">
                  Get Started Free
                  <ArrowRight className="size-5" />
                </Link>
              </Button>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm backdrop-opacity-80">
              <div className="flex items-center gap-2">
                <CheckCircle className="size-4" />
                Free to start
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="size-4" />
                No credit card required
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="size-4" />
                Setup in minutes
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-white/20 px-4 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="text-2xl font-bold text-gray-900">Link Web</div>
              <p className="text-gray-600">
                Your all-in-one link management solution. Create, customize, and share your links effortlessly.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Product</h4>
              <div className="space-y-2 text-gray-600">
                <div>Features</div>
                <div>Pricing</div>
                <div>Analytic</div>
                <div>Intergrations</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
              <div className="space-y-2 text-gray-600">
                <div>About</div>
                <div>Blog</div>
                <div>Careers</div>
                <div>Contact</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Support</h4>
              <div className="space-y-2 text-gray-600">
                <div>Help Center</div>
                <div>Documentation</div>
                <div>Community</div>
                <div>Status</div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-12 pt-6 text-center text-sm text-gray-500">
            <p>
              &copy; {new Date().getFullYear()} Link Web. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    
    </div>
  );
}
