import React from 'react';
import { ExternalLink, Globe, Wordpress, Palette, ShoppingCart, Mail, Server } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';

const SolutionsPage: React.FC = () => {
  const solutions = [
    {
      id: 1,
      title: 'Online Marketing',
      description: 'Boost your online presence with comprehensive digital marketing tools and strategies to reach your target audience effectively.',
      icon: <Globe className="w-8 h-8 text-blue-600" />,
      link: 'https://aklam.io/uWRzFF',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      id: 2,
      title: 'WordPress',
      description: 'Create powerful websites with WordPress hosting solutions, themes, and plugins for complete content management.',
      icon: <Wordpress className="w-8 h-8 text-blue-800" />,
      link: 'https://aklam.io/uWRzFF',
      gradient: 'from-blue-600 to-blue-800'
    },
    {
      id: 3,
      title: 'Website Design Service',
      description: 'Professional website design services to create stunning, responsive websites that convert visitors into customers.',
      icon: <Palette className="w-8 h-8 text-purple-600" />,
      link: 'https://aklam.io/uWRzFF',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      id: 4,
      title: 'Website & Online Store Builder',
      description: 'Build beautiful websites and e-commerce stores with drag-and-drop tools, no coding required.',
      icon: <ShoppingCart className="w-8 h-8 text-green-600" />,
      link: 'https://aklam.io/cz53WQ',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      id: 5,
      title: 'Email & Office',
      description: 'Professional email solutions and office productivity tools to streamline your business communications.',
      icon: <Mail className="w-8 h-8 text-orange-600" />,
      link: 'https://aklam.io/uc8RLt',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      id: 6,
      title: 'Web Hosting',
      description: 'Reliable, fast, and secure web hosting solutions with 99.9% uptime guarantee for your websites and applications.',
      icon: <Server className="w-8 h-8 text-indigo-600" />,
      link: 'https://aklam.io/oVwszb',
      gradient: 'from-indigo-500 to-purple-500'
    }
  ];

  const handleSolutionClick = (link: string, title: string) => {
    // Track the click for analytics if needed
    console.log(`Clicked on ${title} solution`);
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Business Solutions
          </h1>
          <p className="text-xl md:text-2xl text-indigo-100 mb-8 max-w-3xl mx-auto">
            Discover powerful third-party solutions to enhance your online presence and grow your business
          </p>
          <div className="flex items-center justify-center space-x-2 text-indigo-200">
            <Globe className="w-5 h-5" />
            <span className="text-sm">Powered by IONOS</span>
          </div>
        </div>
      </div>

      {/* Solutions Grid */}
      <div className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything you need to succeed online
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From marketing to hosting, these solutions will help you build, grow, and manage your online presence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {solutions.map((solution) => (
              <Card 
                key={solution.id} 
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-lg overflow-hidden"
              >
                <div className={`h-2 bg-gradient-to-r ${solution.gradient}`} />
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-white transition-colors duration-300">
                      {solution.icon}
                    </div>
                    <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300">
                      {solution.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-gray-600 mb-6 leading-relaxed">
                    {solution.description}
                  </CardDescription>
                  <Button
                    onClick={() => handleSolutionClick(solution.link, solution.title)}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 group-hover:shadow-lg"
                  >
                    <span>Explore Solution</span>
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to take your business online?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Choose the right solution for your needs and start building your digital presence today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => window.open('https://aklam.io/uWRzFF', '_blank', 'noopener,noreferrer')}
              className="bg-white text-indigo-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors duration-300"
            >
              Get Started Today
            </Button>
            <Button
              variant="outline"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="border-white text-white hover:bg-white hover:text-indigo-600 font-medium py-3 px-8 rounded-lg transition-colors duration-300"
            >
              View All Solutions
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolutionsPage;