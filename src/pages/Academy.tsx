import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Award, ArrowRight, Filter } from "lucide-react";

const Academy = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");

  const categories = [
    { id: "all", label: "All Categories" },
    { id: "espresso", label: "Espresso" },
    { id: "brewing", label: "Brewing Methods" },
    { id: "latte", label: "Latte Art" },
    { id: "roasting", label: "Roasting" },
    { id: "tasting", label: "Tasting & Quality" },
    { id: "business", label: "Business" },
  ];

  const levels = [
    { id: "all", label: "All Levels" },
    { id: "beginner", label: "Beginner" },
    { id: "intermediate", label: "Intermediate" },
    { id: "advanced", label: "Advanced" },
  ];

  const courses = [
    {
      id: 1,
      title: "Espresso Fundamentals",
      description: "Master the art of espresso extraction with our comprehensive fundamentals course. Learn...",
      price: 299,
      level: "beginner",
      duration: "6 weeks",
      category: "espresso",
      image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&h=600&fit=crop",
    },
    {
      id: 2,
      title: "Pour Over Mastery",
      description: "Elevate your pour over technique to professional levels. This course dives deep int...",
      price: 249,
      level: "intermediate",
      duration: "4 weeks",
      category: "brewing",
      image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=600&fit=crop",
    },
    {
      id: 3,
      title: "Latte Art Techniques",
      description: "Transform your lattes into works of art with this intensive course on milk texturing and pouri...",
      price: 199,
      level: "advanced",
      duration: "3 weeks",
      category: "latte",
      image: "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=800&h=600&fit=crop",
    },
    {
      id: 4,
      title: "Coffee Roasting Basics",
      description: "Discover the art and science of coffee roasting. Learn about green coffee selection, roast...",
      price: 349,
      level: "intermediate",
      duration: "5 weeks",
      category: "roasting",
      image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&h=600&fit=crop",
    },
  ];

  const filteredCourses = courses.filter((course) => {
    const categoryMatch = selectedCategory === "all" || course.category === selectedCategory;
    const levelMatch = selectedLevel === "all" || course.level === selectedLevel;
    return categoryMatch && levelMatch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(32,50%,30%)] via-[hsl(32,50%,25%)] to-[hsl(32,50%,20%)]">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-20 pb-24">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[hsl(40,100%,94%)] mb-4">
            Course Catalogue
          </h1>
          <p className="text-lg md:text-xl text-[hsl(40,60%,75%)] max-w-3xl mx-auto">
            Explore our comprehensive library of coffee education courses.
            From beginner fundamentals to advanced techniques.
          </p>
        </div>

        {/* Filters */}
        <Card className="bg-[hsl(32,40%,35%)]/80 border-[hsl(40,30%,45%)] backdrop-blur-sm mb-8">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-[hsl(40,100%,94%)]" />
              <h3 className="text-lg font-semibold text-[hsl(40,100%,94%)]">Filter Courses</h3>
            </div>
            
            {/* Category Filters */}
            <div className="mb-4">
              <p className="text-sm text-[hsl(40,60%,75%)] mb-2">Category</p>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "secondary"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className={selectedCategory === category.id 
                      ? "bg-[hsl(40,70%,60%)] text-[hsl(32,80%,20%)] hover:bg-[hsl(40,70%,55%)]" 
                      : "bg-[hsl(32,30%,40%)] text-[hsl(40,80%,85%)] hover:bg-[hsl(32,30%,45%)]"}
                  >
                    {category.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Level Filters */}
            <div>
              <p className="text-sm text-[hsl(40,60%,75%)] mb-2">Level</p>
              <div className="flex flex-wrap gap-2">
                {levels.map((level) => (
                  <Button
                    key={level.id}
                    variant={selectedLevel === level.id ? "default" : "secondary"}
                    size="sm"
                    onClick={() => setSelectedLevel(level.id)}
                    className={selectedLevel === level.id 
                      ? "bg-[hsl(40,70%,60%)] text-[hsl(32,80%,20%)] hover:bg-[hsl(40,70%,55%)]" 
                      : "bg-[hsl(32,30%,40%)] text-[hsl(40,80%,85%)] hover:bg-[hsl(32,30%,45%)]"}
                  >
                    {level.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCourses.map((course) => (
            <Link key={course.id} to={`/academy/${course.id}`}>
              <Card className="h-full hover:shadow-2xl transition-all hover:scale-[1.02] cursor-pointer bg-[hsl(32,40%,35%)]/80 border-[hsl(40,30%,45%)] backdrop-blur-sm overflow-hidden">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={course.image} 
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 flex gap-2">
                    <Badge className="bg-[hsl(32,50%,30%)] text-[hsl(40,90%,80%)] border-[hsl(40,30%,45%)] capitalize">
                      {course.level}
                    </Badge>
                    <Badge className="bg-[hsl(32,50%,30%)] text-[hsl(40,90%,80%)] border-[hsl(40,30%,45%)] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {course.duration}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-[hsl(40,100%,94%)] mb-2">
                    {course.title}
                  </h3>
                  <p className="text-[hsl(40,60%,75%)] mb-4 line-clamp-2">
                    {course.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-[hsl(40,80%,65%)]">
                      ${course.price}
                    </span>
                    <Button 
                      variant="ghost" 
                      className="text-[hsl(40,80%,75%)] hover:text-[hsl(40,100%,94%)] hover:bg-[hsl(32,40%,40%)] group"
                    >
                      Learn More
                      <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[hsl(40,60%,75%)] text-lg">
              No courses found matching your filters. Try adjusting your selection.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Academy;
