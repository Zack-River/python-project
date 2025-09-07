import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Gift, Sparkles, Users, Building, CheckCircle, ArrowLeft } from 'lucide-react'
import Questionnaire from './components/Questionnaire.jsx'
import GiftResults from './components/GiftResults.jsx'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState("results")
  const [recommendations, setRecommendations] = useState([
    {
      "gift": {
        "id": 1,
        "name_ar": "مجموعة قهوة عربية فاخرة",
        "description_ar": "مجموعة أنيقة تتضمن دلة قهوة، فناجين، وبن قهوة عربي فاخر، تعكس كرم الضيافة السعودية.",
        "category": "هدايا تقليدية",
        "price": 250,
        "original_price": 300,
        "image_url": "/assets/coffee_set.png",
        "rating": 4.5,
        "reviews_count": 120,
        "features": ["فخمة", "تقليدية", "مناسبة للضيافة"]
      }
    },
    {
      "gift": {
        "id": 2,
        "name_ar": "ساعة حائط بتصميم إسلامي",
        "description_ar": "ساعة حائط خشبية بتصميم إسلامي أنيق، مناسبة للمكاتب والمساجد، تعكس الأصالة والفخامة.",
        "category": "هدايا مكتبية",
        "price": 200,
        "original_price": 220,
        "image_url": "/assets/islamic_clock.png",
        "rating": 4.0,
        "reviews_count": 80,
        "features": ["أنيقة", "دينية", "مناسبة للمكاتب"]
      }
    }
  ])
  const [sessionId, setSessionId] = useState("dummy_session_id")
  const handleQuestionnaireComplete = (recs, id) => {
    setRecommendations(recs)
    setSessionId(id)
    setCurrentPage('results')
  }

  const HomePage = () => (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50 saudi-pattern">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-green-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-saudi rounded-lg flex items-center justify-center">
                <Gift className="w-6 h-6 text-white" />
              </div>
              <div className="arabic-text">
                <h1 className="text-xl font-bold text-green-800">منصة الهدايا الذكية</h1>
                <p className="text-sm text-green-600">للشركات والجهات الحكومية</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-6 arabic-text">
              <a href="#features" className="text-green-700 hover:text-green-900 transition-colors">المميزات</a>
              <a href="#how-it-works" className="text-green-700 hover:text-green-900 transition-colors">كيف يعمل</a>
              <a href="#testimonials" className="text-green-700 hover:text-green-900 transition-colors">آراء العملاء</a>
              <a href="#contact" className="text-green-700 hover:text-green-900 transition-colors">تواصل معنا</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto fade-in">
            <Badge className="mb-6 bg-green-100 text-green-800 hover:bg-green-200 arabic-text">
              <Sparkles className="w-4 h-4 ml-2" />
              مدعوم بالذكاء الاصطناعي
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-green-900 mb-6 arabic-text leading-tight">
              اكتشف الهدية الدعائية
              <span className="text-transparent bg-clip-text gradient-gold"> المثالية </span>
              لشركتك
            </h1>
            <p className="text-xl text-green-700 mb-8 max-w-2xl mx-auto arabic-text leading-relaxed">
              نظام ذكي يساعدك في اختيار أفضل الهدايا الدعائية للشركات والجهات الحكومية 
              بناءً على احتياجاتك وتفضيلاتك الخاصة
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="bg-gradient-saudi hover:bg-green-700 text-white px-8 py-6 text-lg arabic-text"
                onClick={() => setCurrentPage('questionnaire')}
              >
                ابدأ الآن
                <ArrowLeft className="w-5 h-5 mr-2" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-green-300 text-green-700 hover:bg-green-50 px-8 py-6 text-lg arabic-text"
              >
                شاهد العرض التوضيحي
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-green-900 mb-4 arabic-text">لماذا تختار منصتنا؟</h2>
            <p className="text-xl text-green-700 max-w-2xl mx-auto arabic-text">
              نقدم حلولاً متطورة لاختيار الهدايا الدعائية المناسبة لكل مناسبة ومؤسسة
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-green-100 hover:shadow-lg transition-all duration-300 scale-in">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-saudi rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-green-900 arabic-text">ذكاء اصطناعي متقدم</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-green-700 arabic-text text-base leading-relaxed">
                  خوارزميات ذكية تحلل احتياجاتك وتقترح أفضل الهدايا المناسبة لشركتك أو جهتك الحكومية
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-green-100 hover:shadow-lg transition-all duration-300 scale-in">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-green-900" />
                </div>
                <CardTitle className="text-green-900 arabic-text">مخصص للشركات</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-green-700 arabic-text text-base leading-relaxed">
                  مصمم خصيصاً للشركات والجهات الحكومية مع مراعاة البروتوكولات والأنظمة المعمول بها
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-green-100 hover:shadow-lg transition-all duration-300 scale-in">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-saudi rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-green-900 arabic-text">هدايا عالية الجودة</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-green-700 arabic-text text-base leading-relaxed">
                  مجموعة واسعة من الهدايا الدعائية عالية الجودة المناسبة للثقافة السعودية والإسلامية
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-green-900 mb-4 arabic-text">كيف يعمل النظام؟</h2>
            <p className="text-xl text-green-700 max-w-2xl mx-auto arabic-text">
              ثلاث خطوات بسيطة للحصول على أفضل اقتراحات الهدايا
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center slide-in-right">
              <div className="w-20 h-20 bg-gradient-saudi rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                1
              </div>
              <h3 className="text-2xl font-bold text-green-900 mb-4 arabic-text">أجب على الأسئلة</h3>
              <p className="text-green-700 arabic-text text-lg leading-relaxed">
                أجب على مجموعة من الأسئلة البسيطة حول نوع شركتك، المناسبة، والميزانية المتاحة
              </p>
            </div>
            <div className="text-center slide-in-right">
              <div className="w-20 h-20 bg-gradient-gold rounded-full flex items-center justify-center mx-auto mb-6 text-green-900 text-2xl font-bold">
                2
              </div>
              <h3 className="text-2xl font-bold text-green-900 mb-4 arabic-text">احصل على الاقتراحات</h3>
              <p className="text-green-700 arabic-text text-lg leading-relaxed">
                سيقوم الذكاء الاصطناعي بتحليل إجاباتك وتقديم قائمة مخصصة بأفضل الهدايا المناسبة
              </p>
            </div>
            <div className="text-center slide-in-right">
              <div className="w-20 h-20 bg-gradient-saudi rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                3
              </div>
              <h3 className="text-2xl font-bold text-green-900 mb-4 arabic-text">اختر واطلب</h3>
              <p className="text-green-700 arabic-text text-lg leading-relaxed">
                اختر الهدية المناسبة واطلب عرض سعر مفصل أو اطلب الهدية مباشرة
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-saudi">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-6 arabic-text">
              جاهز لاكتشاف الهدية المثالية؟
            </h2>
            <p className="text-xl text-green-100 mb-8 arabic-text leading-relaxed">
              ابدأ الآن واحصل على اقتراحات مخصصة لشركتك في دقائق معدودة
            </p>
            <Button 
              size="lg" 
              className="bg-white text-green-800 hover:bg-green-50 px-8 py-6 text-lg arabic-text"
              onClick={() => setCurrentPage('questionnaire')}
            >
              ابدأ الاستبيان الآن
              <ArrowLeft className="w-5 h-5 mr-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="arabic-text">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-gold rounded-lg flex items-center justify-center">
                  <Gift className="w-5 h-5 text-green-900" />
                </div>
                <h3 className="text-xl font-bold">منصة الهدايا الذكية</h3>
              </div>
              <p className="text-green-200 leading-relaxed">
                نساعد الشركات والجهات الحكومية في اختيار أفضل الهدايا الدعائية باستخدام الذكاء الاصطناعي
              </p>
            </div>
            <div className="arabic-text">
              <h4 className="text-lg font-semibold mb-4">روابط سريعة</h4>
              <ul className="space-y-2 text-green-200">
                <li><a href="#" className="hover:text-white transition-colors">الرئيسية</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">المميزات</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">كيف يعمل</a></li>
                <li><a href="#" className="hover:text-white transition-colors">من نحن</a></li>
              </ul>
            </div>
            <div className="arabic-text">
              <h4 className="text-lg font-semibold mb-4">الخدمات</h4>
              <ul className="space-y-2 text-green-200">
                <li><a href="#" className="hover:text-white transition-colors">هدايا الشركات</a></li>
                <li><a href="#" className="hover:text-white transition-colors">هدايا الجهات الحكومية</a></li>
                <li><a href="#" className="hover:text-white transition-colors">هدايا المناسبات</a></li>
                <li><a href="#" className="hover:text-white transition-colors">التخصيص والنقش</a></li>
              </ul>
            </div>
            <div className="arabic-text">
              <h4 className="text-lg font-semibold mb-4">تواصل معنا</h4>
              <ul className="space-y-2 text-green-200">
                <li>البريد الإلكتروني: info@giftplatform.sa</li>
                <li>الهاتف: +966 11 123 4567</li>
                <li>العنوان: الرياض، المملكة العربية السعودية</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-green-800 mt-8 pt-8 text-center text-green-200 arabic-text">
            <p>&copy; 2024 منصة الهدايا الذكية. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  )

  const QuestionnairePage = () => (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50 saudi-pattern">
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="outline" 
          onClick={() => setCurrentPage('home')}
          className="mb-6 arabic-text"
        >
          <ArrowLeft className="w-4 h-4 ml-2" />
          العودة للرئيسية
        </Button>
        
        <Questionnaire onComplete={handleQuestionnaireComplete} />
      </div>
    </div>
  )

  return (
    <div className="App">
      {currentPage === 'home' && <HomePage />}
      {currentPage === 'questionnaire' && <QuestionnairePage />}
      {currentPage === 'results' && (
        <GiftResults 
          recommendations={recommendations} 
          sessionId={sessionId}
          onBack={() => setCurrentPage('questionnaire')} 
        />
      )}
    </div>
  )
}

export default App

