import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Star, Heart, ShoppingCart, Filter, Search, ArrowLeft, Loader2 } from 'lucide-react'

export default function GiftResults({ recommendations, sessionId, onBack }) {
  const [filteredGifts, setFilteredGifts] = useState([])
  const [sortBy, setSortBy] = useState('recommended')
  const [filterCategory, setFilterCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [favorites, setFavorites] = useState(new Set())
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (recommendations) {
      setFilteredGifts(recommendations.map(rec => rec.gift))
    }
  }, [recommendations])

  const handleSearch = (term) => {
    setSearchTerm(term)
    filterGifts(term, filterCategory, sortBy)
  }

  const handleCategoryFilter = (category) => {
    setFilterCategory(category)
    filterGifts(searchTerm, category, sortBy)
  }

  const handleSort = (sort) => {
    setSortBy(sort)
    filterGifts(searchTerm, filterCategory, sort)
  }

  const filterGifts = (search, category, sort) => {
    let currentGifts = recommendations ? recommendations.map(rec => rec.gift) : []

    // Filter by search term
    if (search) {
      currentGifts = currentGifts.filter(gift => 
        gift.name_ar.includes(search) || 
        gift.name_en.toLowerCase().includes(search.toLowerCase()) ||
        gift.description_ar.includes(search)
      )
    }

    // Filter by category
    if (category !== 'all') {
      currentGifts = currentGifts.filter(gift => gift.category === category)
    }

    // Sort
    switch (sort) {
      case 'price_low':
        currentGifts.sort((a, b) => a.price - b.price)
        break
      case 'price_high':
        currentGifts.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        currentGifts.sort((a, b) => b.rating - a.rating)
        break
      case 'popular':
        // Assuming 'reviews_count' is a measure of popularity
        currentGifts.sort((a, b) => b.reviews_count - a.reviews_count)
        break
      default: // recommended
        // The recommendations are already sorted by relevance from the backend
        // So we just use the original order of the recommendations array
        currentGifts = recommendations ? recommendations.map(rec => rec.gift) : []
        break
    }

    setFilteredGifts(currentGifts)
  }

  const toggleFavorite = (giftId) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(giftId)) {
      newFavorites.delete(giftId)
    } else {
      newFavorites.add(giftId)
    }
    setFavorites(newFavorites)
  }

  // This function is no longer needed as answers are not directly passed here
  // const getAnswerSummary = () => {
  //   const summary = []
  //   if (answers[1]) summary.push(`نوع المؤسسة: ${getOptionLabel(1, answers[1])}`)
  //   if (answers[2]) summary.push(`المناسبة: ${getOptionLabel(2, answers[2])}`)
  //   if (answers[3]) summary.push(`العدد: ${getOptionLabel(3, answers[3])}`)
  //   if (answers[4]) summary.push(`الميزانية: ${answers[4][0]} ريال`)
  //   return summary
  // }

  // const getOptionLabel = (questionId, value) => {
  //   const question = [
  //     null,
  //     { // Question 1
  //       'government': 'جهة حكومية',
  //       'private_company': 'شركة خاصة',
  //       'educational': 'مؤسسة تعليمية',
  //       'healthcare': 'مؤسسة صحية',
  //       'financial': 'مؤسسة مالية',
  //       'manufacturing': 'شركة تصنيع',
  //       'other': 'أخرى'
  //     },
  //     { // Question 2
  //       'national_day': 'اليوم الوطني السعودي',
  //       'new_year': 'رأس السنة الميلادية',
  //       'ramadan': 'شهر رمضان المبارك',
  //       'eid': 'عيد الفطر أو الأضحى',
  //       'conference': 'مؤتمر أو فعالية',
  //       'appreciation': 'تقدير الموظفين',
  //       'client_gift': 'هدية للعملاء',
  //       'other': 'مناسبة أخرى'
  //     },
  //     { // Question 3
  //       '1-50': '1 - 50 هدية',
  //       '51-100': '51 - 100 هدية',
  //       '101-500': '101 - 500 هدية',
  //       '501-1000': '501 - 1000 هدية',
  //       '1000+': 'أكثر من 1000 هدية'
  //     }
  //   ]
  //   return question[questionId]?.[value] || value
  // }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50 saudi-pattern">
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="mb-6 arabic-text"
        >
          <ArrowLeft className="w-4 h-4 ml-2" />
          العودة للاستبيان
        </Button>

        {/* Results Summary */}
        <Card className="mb-8 border-green-100">
          <CardHeader>
            <CardTitle className="text-2xl text-green-900 arabic-text">نتائج مخصصة لمؤسستك</CardTitle>
            <CardDescription className="text-green-700 arabic-text">
              بناءً على إجاباتك، وجدنا {filteredGifts.length} هدية مناسبة لاحتياجاتك
            </CardDescription>
          </CardHeader>
          {/* <CardContent>
            <div className="flex flex-wrap gap-2">
              {getAnswerSummary().map((item, index) => (
                <Badge key={index} variant="secondary" className="arabic-text">
                  {item}
                </Badge>
              ))}
            </div>
          </CardContent> */}
        </Card>

        {/* Filters and Search */}
        <Card className="mb-8 border-green-100">
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute right-3 top-3 h-4 w-4 text-green-500" />
                <Input
                  placeholder="البحث في الهدايا..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pr-10 arabic-text"
                />
              </div>
              
              <Select value={filterCategory} onValueChange={handleCategoryFilter}>
                <SelectTrigger className="arabic-text">
                  <SelectValue placeholder="الفئة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الفئات</SelectItem>
                  <SelectItem value="traditional">تراثية</SelectItem>
                  <SelectItem value="modern">عصرية</SelectItem>
                  <SelectItem value="office">مكتبية</SelectItem>
                  <SelectItem value="luxury">فاخرة</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={handleSort}>
                <SelectTrigger className="arabic-text">
                  <SelectValue placeholder="ترتيب حسب" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recommended">الأكثر ملاءمة</SelectItem>
                  <SelectItem value="price_low">السعر: من الأقل للأعلى</SelectItem>
                  <SelectItem value="price_high">السعر: من الأعلى للأقل</SelectItem>
                  <SelectItem value="rating">الأعلى تقييماً</SelectItem>
                  <SelectItem value="popular">الأكثر شعبية</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="arabic-text">
                <Filter className="w-4 h-4 ml-2" />
                المزيد من الفلاتر
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Gift Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGifts.map((gift) => (
            <Card key={gift.id} className="border-green-100 hover:shadow-lg transition-all duration-300 group">
              <div className="relative">
                <div className="aspect-square bg-green-100 rounded-t-lg flex items-center justify-center">
                  {/* Use actual image from backend if available */}
                  {gift.image_url ? (
                    <img src={`http://localhost:5000${gift.image_url}`} alt={gift.name_ar} className="w-full h-full object-cover rounded-t-lg" />
                  ) : (
                    <div className="text-green-600 text-6xl">🎁</div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 left-2 p-2"
                  onClick={() => toggleFavorite(gift.id)}
                >
                  <Heart 
                    className={`w-5 h-5 ${favorites.has(gift.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} 
                  />
                </Button>
                {gift.original_price > gift.price && (
                  <Badge className="absolute top-2 right-2 bg-red-500 text-white">
                    خصم {Math.round(((gift.original_price - gift.price) / gift.original_price) * 100)}%
                  </Badge>
                )}
              </div>
              
              <CardContent className="p-4">
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${i < Math.floor(gift.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                    />
                  ))}
                  <span className="text-sm text-gray-600 mr-1">({gift.reviews_count})</span>
                </div>
                
                <h3 className="font-semibold text-green-900 mb-2 arabic-text line-clamp-2">
                  {gift.name_ar}
                </h3>
                
                <p className="text-sm text-green-700 mb-3 arabic-text line-clamp-2">
                  {gift.description_ar}
                </p>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {gift.features && gift.features.slice(0, 2).map((feature, index) => (
                    <Badge key={index} variant="outline" className="text-xs arabic-text">
                      {feature}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="arabic-text">
                    <span className="text-lg font-bold text-green-900">{gift.price} ريال</span>
                    {gift.original_price > gift.price && (
                      <span className="text-sm text-gray-500 line-through mr-2">{gift.original_price} ريال</span>
                    )}
                  </div>
                  <Button size="sm" className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white arabic-text">
                    <ShoppingCart className="w-4 h-4 ml-1" />
                    اطلب الآن
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredGifts.length === 0 && !isLoading && (
          <Card className="border-green-100 text-center py-12">
            <CardContent>
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-green-900 mb-2 arabic-text">لم نجد هدايا مطابقة</h3>
              <p className="text-green-700 arabic-text">جرب تغيير معايير البحث أو الفلاتر</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}


