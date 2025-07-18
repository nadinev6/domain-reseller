import React from 'react';
import { Palette, Smartphone, MousePointer, Globe, ArrowRight, Sparkles } from 'lucide-react';
import { t } from 'lingo.dev/react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { AnimatedShinyText } from '../components/magicui/animated-shiny-text';

const SocialMediaCardStudio: React.FC = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: <MousePointer className="w-8 h-8 text-indigo-600" />,
      title: <>{t('cardStudio.features.dragDrop')}</>,
      description: t('cardStudio.features.dragDropDesc')
    },
    {
      icon: <Sparkles className="w-8 h-8 text-purple-600" />,
      title: <>{t('cardStudio.features.templates')}</>,
      description: t('cardStudio.features.templatesDesc')
    },
    {
      icon: <Smartphone className="w-8 h-8 text-pink-600" />,
      title: <>{t('cardStudio.features.responsive')}</>,
      description: t('cardStudio.features.responsiveDesc')
    },
    {
      icon: <Globe className="w-8 h-8 text-green-600" />,
      title: <>{t('cardStudio.features.customDomain')}</>,
      description: t('cardStudio.features.customDomainDesc')
    }
  ];

  const examples = [
    {
      title: t('cardStudio.examples.creative.title'),
      description: t('cardStudio.examples.creative.description'),
      image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400',
      gradient: 'from-purple-400 to-pink-400'
    },
    {
      title: t('cardStudio.examples.business.title'),
      description: t('cardStudio.examples.business.description'),
      image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400',
      gradient: 'from-blue-400 to-indigo-400'
    },
    {
      title: t('cardStudio.examples.content.title'),
      description: t('cardStudio.examples.content.description'),
      image: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=400',
      gradient: 'from-orange-400 to-red-400'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          {user && (
            <div className="mb-4">
              <span className="inline-block px-4 py-2 bg-white/20 rounded-full text-sm font-medium">
                {t('dashboard.welcome', { name: user?.user_metadata?.full_name || user?.email })}
              </span>
            </div>
          )}
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-200">
            {t('cardStudio.title')}
          </h1>
          <p className="text-xl md:text-2xl text-indigo-100 mb-8 max-w-3xl mx-auto">
            {t('cardStudio.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/card-studio/editor">
                  <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-100 text-lg px-8 py-3">
                    <AnimatedShinyText className="text-indigo-600 !mx-0 !max-w-none">
                      {t('cardStudio.getStarted')}
                    </AnimatedShinyText>
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
            ) : (
              <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-100 text-lg px-8 py-3">
                <AnimatedShinyText className="text-indigo-600 !mx-0 !max-w-none">
                  {t('cardStudio.signUpToStart')}
                </AnimatedShinyText>
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            )}
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-indigo-600 text-lg px-8 py-3">
              <AnimatedShinyText className="text-indigo-600 hover:text-indigo-600 !mx-0 !max-w-none">
                {t('cardStudio.examples')}
              </AnimatedShinyText>
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything you need to create stunning cards
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our powerful studio gives you all the tools to create professional social media cards that stand out
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Examples Section */}
      <div className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('cardStudio.examples.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('cardStudio.examples.subtitle')}
            </p>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="business">Business</TabsTrigger>
              <TabsTrigger value="creative">Creative</TabsTrigger>
              <TabsTrigger value="personal">Personal</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {examples.map((example, index) => (
                  <Card key={index} className="overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
                    <div className={`h-48 bg-gradient-to-br ${example.gradient} relative overflow-hidden`}>
                      <img 
                        src={example.image} 
                        alt={example.title}
                        className="w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-300"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-white text-center">
                          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                            <Palette className="w-8 h-8" />
                          </div>
                          <h3 className="text-lg font-semibold">{example.title}</h3>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <CardDescription className="text-gray-600">
                        {example.description}
                      </CardDescription>
                      {user ? (
                        <Link to="/card-studio/editor">
                          <Button variant="outline" className="w-full mt-4 group-hover:bg-indigo-50 group-hover:border-indigo-300 transition-colors duration-300">
                            {t('cardStudio.examples.useTemplate')}
                          </Button>
                        </Link>
                      ) : (
                        <Button variant="outline" className="w-full mt-4 group-hover:bg-indigo-50 group-hover:border-indigo-300 transition-colors duration-300">
                          {t('cardStudio.examples.signUpToUse')}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="business">
              <div className="text-center py-12">
                <p className="text-gray-500">{t('cardStudio.examples.comingSoon', { category: 'Business' })}</p>
              </div>
            </TabsContent>

            <TabsContent value="creative">
              <div className="text-center py-12">
                <p className="text-gray-500">{t('cardStudio.examples.comingSoon', { category: 'Creative' })}</p>
              </div>
            </TabsContent>

            <TabsContent value="personal">
              <div className="text-center py-12">
                <p className="text-gray-500">{t('cardStudio.examples.comingSoon', { category: 'Personal' })}</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {t('cardStudio.cta.title')}
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            {t('cardStudio.cta.subtitle')}
          </p>
          {user ? (
            <Link to="/card-studio/editor">
              <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-100 text-lg px-8 py-3">
                <AnimatedShinyText className="text-indigo-600 !mx-0 !max-w-none">
                  {t('cardStudio.cta.startBuilding')}
                </AnimatedShinyText>
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          ) : (
            <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-100 text-lg px-8 py-3">
              <AnimatedShinyText className="text-indigo-600 !mx-0 !max-w-none">
                {t('cardStudio.cta.signUpToStart')}
              </AnimatedShinyText>
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SocialMediaCardStudio;