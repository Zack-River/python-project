import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Slider } from '@/components/ui/slider.jsx'
import { ArrowLeft, ArrowRight, Building, Users, Calendar, Palette, DollarSign, Target, CheckCircle, Loader2 } from 'lucide-react'

const questions = [
  {
    id: 1,
    type: 'radio',
    question: 'ما هو نوع مؤسستكم؟',
    options: [
      { value: 'government', label: 'جهة حكومية', icon: Building },
      { value: 'private_company', label: 'شركة خاصة', icon: Users },
      { value: 'educational', label: 'مؤسسة تعليمية', icon: Building },
      { value: 'healthcare', label: 'مؤسسة صحية', icon: Building },
      { value: 'financial', label: 'مؤسسة مالية', icon: DollarSign },
      { value: 'manufacturing', label: 'شركة تصنيع', icon: Building },
      { value: 'other', label: 'أخرى', icon: Building }
    ]
  },
  {
    id: 2,
    type: 'radio',
    question: 'ما هي المناسبة التي تريدون الهدية من أجلها؟',
    options: [
      { value: 'national_day', label: 'اليوم الوطني السعودي', icon: Calendar },
      { value: 'new_year', label: 'رأس السنة الميلادية', icon: Calendar },
      { value: 'ramadan', label: 'شهر رمضان المبارك', icon: Calendar },
      { value: 'eid', label: 'عيد الفطر أو الأضحى', icon: Calendar },
      { value: 'conference', label: 'مؤتمر أو فعالية', icon: Users },
      { value: 'appreciation', label: 'تقدير الموظفين', icon: Target },
      { value: 'client_gift', label: 'هدية للعملاء', icon: Users },
      { value: 'other', label: 'مناسبة أخرى', icon: Calendar }
    ]
  },
  {
    id: 3,
    type: 'radio',
    question: 'كم عدد الهدايا المطلوبة تقريباً؟',
    options: [
      { value: '1-50', label: '1 - 50 هدية', icon: Users },
      { value: '51-100', label: '51 - 100 هدية', icon: Users },
      { value: '101-500', label: '101 - 500 هدية', icon: Users },
      { value: '501-1000', label: '501 - 1000 هدية', icon: Users },
      { value: '1000+', label: 'أكثر من 1000 هدية', icon: Users }
    ]
  },
  {
    id: 4,
    type: 'slider',
    question: 'ما هي الميزانية المتوقعة لكل هدية؟ (بالريال السعودي)',
    min: 10,
    max: 1000,
    step: 10,
    defaultValue: [100]
  },
  {
    id: 5,
    type: 'radio',
    question: 'ما هو النوع المفضل للهدايا؟',
    options: [
      { value: 'traditional', label: 'هدايا تراثية سعودية', icon: Building },
      { value: 'modern', label: 'هدايا عصرية وتقنية', icon: Target },
      { value: 'office', label: 'أدوات مكتبية', icon: Building },
      { value: 'luxury', label: 'هدايا فاخرة', icon: DollarSign },
      { value: 'practical', label: 'هدايا عملية ومفيدة', icon: Target },
      { value: 'mixed', label: 'مزيج من الأنواع', icon: Palette }
    ]
  },
  {
    id: 6,
    type: 'radio',
    question: 'ما هي الألوان المفضلة؟',
    options: [
      { value: 'saudi_colors', label: 'الألوان السعودية (أخضر وذهبي)', icon: Palette },
      { value: 'neutral', label: 'ألوان محايدة (أبيض، رمادي، بيج)', icon: Palette },
      { value: 'dark', label: 'ألوان داكنة (أسود، بني داكن)', icon: Palette },
      { value: 'bright', label: 'ألوان زاهية ومتنوعة', icon: Palette },
      { value: 'company_colors', label: 'ألوان الشركة/المؤسسة', icon: Palette }
    ]
  },
  {
    id: 7,
    type: 'radio',
    question: 'هل تريدون إضافة شعار الشركة/المؤسسة على الهدايا؟',
    options: [
      { value: 'yes_logo', label: 'نعم، شعار الشركة/المؤسسة', icon: CheckCircle },
      { value: 'yes_text', label: 'نعم، نص أو رسالة مخصصة', icon: CheckCircle },
      { value: 'both', label: 'الشعار والنص معاً', icon: CheckCircle },
      { value: 'no', label: 'لا، بدون تخصيص', icon: CheckCircle }
    ]
  }
]

export default function Questionnaire({ onComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [isCompleted, setIsCompleted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleAnswer = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const nextQuestion = async () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      setIsCompleted(true)
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch('http://localhost:5000/api/questionnaire', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(answers),
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        if (onComplete) {
          onComplete(data.recommendations, data.session_id)
        }
      } catch (e) {
        console.error('Failed to submit questionnaire:', e)
        setError('حدث خطأ أثناء الحصول على التوصيات. الرجاء المحاولة مرة أخرى.')
      } finally {
        setIsLoading(false)
      }
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100

  if (isCompleted) {
    return (
      <Card className="border-green-100 max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-4">
            {isLoading ? <Loader2 className="w-8 h-8 text-white animate-spin" /> : <CheckCircle className="w-8 h-8 text-white" />}
          </div>
          <CardTitle className="text-2xl text-green-900 arabic-text">
            {isLoading ? 'جاري تحليل إجاباتك...' : 'تم إكمال الاستبيان بنجاح!'}
          </CardTitle>
          <CardDescription className="text-green-700 arabic-text text-lg">
            {isLoading ? 'الرجاء الانتظار قليلاً.' : 'شكراً لك. سيتم الآن تحليل إجاباتك وتقديم أفضل اقتراحات الهدايا المناسبة لمؤسستك.'}
          </CardDescription>
          {error && <p className="text-red-500 mt-4 arabic-text">{error}</p>}
        </CardHeader>
        {!isLoading && !error && (
          <CardContent className="text-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-6 text-lg arabic-text"
              onClick={() => onComplete && onComplete(answers)}
            >
              عرض النتائج
              <ArrowLeft className="w-5 h-5 mr-2" />
            </Button>
          </CardContent>
        )}
      </Card>
    )
  }

  const question = questions[currentQuestion]
  const currentAnswer = answers[question.id]

  return (
    <Card className="border-green-100 max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <CardTitle className="text-lg text-green-900 arabic-text">
            السؤال {currentQuestion + 1} من {questions.length}
          </CardTitle>
          <div className="text-sm text-green-600 arabic-text">
            {Math.round(progress)}% مكتمل
          </div>
        </div>
        <Progress value={progress} className="mb-6" />
        <CardTitle className="text-xl text-green-900 arabic-text text-center">
          {question.question}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {question.type === 'radio' && (
          <RadioGroup 
            value={currentAnswer} 
            onValueChange={(value) => handleAnswer(question.id, value)}
            className="space-y-3"
          >
            {question.options.map((option) => {
              const IconComponent = option.icon
              return (
                <div key={option.value} className="flex items-center space-x-3 space-x-reverse p-3 rounded-lg border border-green-100 hover:bg-green-50 transition-colors">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label 
                    htmlFor={option.value} 
                    className="flex items-center gap-3 cursor-pointer flex-1 arabic-text"
                  >
                    <IconComponent className="w-5 h-5 text-green-600" />
                    {option.label}
                  </Label>
                </div>
              )
            })}
          </RadioGroup>
        )}

        {question.type === 'slider' && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-900 arabic-text">
                {currentAnswer?.[0] || question.defaultValue[0]} ريال سعودي
              </div>
            </div>
            <Slider
              value={currentAnswer || question.defaultValue}
              onValueChange={(value) => handleAnswer(question.id, value)}
              min={question.min}
              max={question.max}
              step={question.step}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-green-600 arabic-text">
              <span>{question.min} ريال</span>
              <span>{question.max} ريال</span>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={prevQuestion}
            disabled={currentQuestion === 0 || isLoading}
            className="arabic-text"
          >
            <ArrowRight className="w-4 h-4 ml-2" />
            السابق
          </Button>
          <Button
            onClick={nextQuestion}
            disabled={!currentAnswer || isLoading}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white arabic-text"
          >
            {isLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
            {currentQuestion === questions.length - 1 ? 'إنهاء' : 'التالي'}
            <ArrowLeft className="w-4 h-4 mr-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

