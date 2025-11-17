import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Award, CheckCircle, Video, FileText, TestTube, ArrowLeft } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const AcademyDetail = () => {
  const { id } = useParams();

  // Mock data - in real app, fetch based on id
  const course = {
    id: 1,
    title: "Espresso Fundamentals",
    category: "Espresso",
    level: "Beginner",
    description: "Learn the complete fundamentals of espresso brewing from machine setup to pulling perfect shots",
    duration: "6 weeks",
    hasCertificate: true,
    price: 299,
    instructor: {
      name: "Marcus Chen",
      title: "Master Barista & SCA Certified Trainer",
      bio: "With over 15 years of experience and multiple championship titles, Marcus brings expert knowledge and practical insights to every lesson.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    },
    objectives: [
      "Understand espresso extraction principles and variables",
      "Master proper machine setup and maintenance",
      "Develop consistent tamping and dosing techniques",
      "Learn to dial in grind size for optimal extraction",
      "Identify and troubleshoot common espresso problems",
      "Pull consistently excellent espresso shots",
    ],
    fullDescription: "Master the art of espresso extraction with our comprehensive fundamentals course. Learn everything from machine setup and maintenance to dialing in the perfect shot. This course covers grind size, dosing, tamping pressure, extraction time, and temperature control. You'll understand the science behind espresso while developing hands-on skills through practical exercises. By the end, you'll be confident in pulling consistent, delicious espresso shots every time.",
    classes: [
      {
        number: 1,
        title: "Introduction to Espresso",
        description: "Learn the history and fundamentals of espresso coffee",
        materials: ["Video", "Document"],
      },
      {
        number: 2,
        title: "Machine Setup & Maintenance",
        description: "Proper setup and daily maintenance routines for espresso machines",
        materials: ["Video", "Document", "Test"],
      },
      {
        number: 3,
        title: "Grinding & Dosing",
        description: "Master grind size selection and precise dosing techniques",
        materials: ["Video", "Document"],
      },
      {
        number: 4,
        title: "Tamping Techniques",
        description: "Develop consistent tamping pressure and level techniques",
        materials: ["Video", "Test"],
      },
      {
        number: 5,
        title: "Extraction Theory",
        description: "Understanding extraction variables and their effects on flavor",
        materials: ["Video", "Document"],
      },
      {
        number: 6,
        title: "Dialing In Your Shot",
        description: "Step-by-step process for achieving perfect extraction",
        materials: ["Video", "Document", "Test"],
      },
      {
        number: 7,
        title: "Troubleshooting Common Problems",
        description: "Identify and fix common espresso extraction issues",
        materials: ["Video", "Document"],
      },
      {
        number: 8,
        title: "Final Assessment",
        description: "Demonstrate your espresso skills and knowledge",
        materials: ["Document", "Test"],
      },
    ],
    materials: [
      "Comprehensive video library (6+ hours)",
      "Downloadable extraction guide and reference charts",
      "Espresso troubleshooting worksheet",
      "Grind size calibration guide",
      "Machine maintenance checklist",
      "Certificate of completion",
    ],
    features: [
      "Lifetime access",
      "All course materials included",
      "Certificate of completion",
      "Community access",
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(32,50%,30%)] via-[hsl(32,50%,25%)] to-[hsl(32,50%,20%)]">
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 pb-24">
        {/* Back Button */}
        <Link to="/academy">
          <Button 
            variant="ghost" 
            className="mb-6 text-[hsl(40,80%,75%)] hover:text-[hsl(40,100%,94%)] hover:bg-[hsl(32,40%,40%)]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Courses
          </Button>
        </Link>

        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 mb-6 text-sm">
          <Badge variant="secondary" className="bg-[hsl(32,30%,40%)] text-[hsl(40,80%,85%)]">
            {course.category}
          </Badge>
          <Badge variant="secondary" className="bg-[hsl(32,30%,40%)] text-[hsl(40,80%,85%)]">
            {course.level}
          </Badge>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[hsl(40,100%,94%)] mb-4">
            {course.title}
          </h1>
          <p className="text-lg text-[hsl(40,60%,75%)] mb-4">
            {course.description}
          </p>
          <div className="flex items-center gap-4 text-[hsl(40,80%,75%)]">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>{course.duration}</span>
            </div>
            {course.hasCertificate && (
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                <span>Certificate Included</span>
              </div>
            )}
          </div>
        </div>

        {/* Instructor Card */}
        <Card className="bg-[hsl(32,40%,35%)]/80 border-[hsl(40,30%,45%)] backdrop-blur-sm mb-6">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={course.instructor.avatar} />
                <AvatarFallback>MC</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-[hsl(40,100%,94%)]">
                  {course.instructor.name}
                </h3>
                <p className="text-[hsl(40,70%,70%)] mb-2">{course.instructor.title}</p>
                <p className="text-[hsl(40,60%,75%)] text-sm">{course.instructor.bio}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing Card */}
        <Card className="bg-[hsl(32,40%,35%)]/80 border-[hsl(40,30%,45%)] backdrop-blur-sm mb-8">
          <CardContent className="p-8 text-center">
            <div className="text-5xl font-bold text-[hsl(40,80%,65%)] mb-2">
              ${course.price}
            </div>
            <p className="text-[hsl(40,60%,75%)] mb-6">One-time payment</p>
            <Button size="lg" className="w-full bg-[hsl(40,70%,60%)] text-[hsl(32,80%,20%)] hover:bg-[hsl(40,70%,55%)] mb-6">
              Enroll Now
            </Button>
            <div className="space-y-3 text-left">
              {course.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-[hsl(40,80%,75%)]">
                  <CheckCircle className="w-5 h-5 text-[hsl(40,80%,65%)]" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="objectives" className="w-full">
          <TabsList className="w-full grid grid-cols-4 bg-[hsl(32,30%,40%)] mb-6">
            <TabsTrigger 
              value="objectives"
              className="data-[state=active]:bg-[hsl(40,70%,60%)] data-[state=active]:text-[hsl(32,80%,20%)] text-[hsl(40,80%,85%)]"
            >
              Objectives
            </TabsTrigger>
            <TabsTrigger 
              value="description"
              className="data-[state=active]:bg-[hsl(40,70%,60%)] data-[state=active]:text-[hsl(32,80%,20%)] text-[hsl(40,80%,85%)]"
            >
              Description
            </TabsTrigger>
            <TabsTrigger 
              value="classes"
              className="data-[state=active]:bg-[hsl(40,70%,60%)] data-[state=active]:text-[hsl(32,80%,20%)] text-[hsl(40,80%,85%)]"
            >
              Class List
            </TabsTrigger>
            <TabsTrigger 
              value="materials"
              className="data-[state=active]:bg-[hsl(40,70%,60%)] data-[state=active]:text-[hsl(32,80%,20%)] text-[hsl(40,80%,85%)]"
            >
              Materials
            </TabsTrigger>
          </TabsList>

          <TabsContent value="objectives">
            <Card className="bg-[hsl(32,40%,35%)]/80 border-[hsl(40,30%,45%)] backdrop-blur-sm">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-[hsl(40,100%,94%)] mb-6">
                  Learning Objectives
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {course.objectives.map((objective, index) => (
                    <Card key={index} className="bg-[hsl(32,30%,40%)] border-[hsl(40,30%,50%)]">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-[hsl(40,80%,65%)] flex-shrink-0 mt-0.5" />
                          <p className="text-[hsl(40,80%,85%)]">{objective}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="description">
            <Card className="bg-[hsl(32,40%,35%)]/80 border-[hsl(40,30%,45%)] backdrop-blur-sm">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-[hsl(40,100%,94%)] mb-4">
                  Course Description
                </h2>
                <p className="text-[hsl(40,70%,80%)] leading-relaxed">
                  {course.fullDescription}
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="classes">
            <Card className="bg-[hsl(32,40%,35%)]/80 border-[hsl(40,30%,45%)] backdrop-blur-sm">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-[hsl(40,100%,94%)] mb-6">
                  Class List
                </h2>
                <div className="space-y-4">
                  {course.classes.map((classItem) => (
                    <Card key={classItem.number} className="bg-[hsl(32,30%,40%)] border-[hsl(40,30%,50%)]">
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[hsl(32,40%,35%)] flex items-center justify-center text-[hsl(40,80%,75%)] font-bold">
                            {classItem.number}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-[hsl(40,100%,94%)] mb-1">
                              {classItem.title}
                            </h3>
                            <p className="text-[hsl(40,60%,75%)] text-sm mb-3">
                              {classItem.description}
                            </p>
                            <div className="flex items-center gap-3">
                              {classItem.materials.map((material, idx) => (
                                <div key={idx} className="flex items-center gap-1 text-[hsl(40,70%,70%)] text-xs">
                                  {material === "Video" && <Video className="w-4 h-4" />}
                                  {material === "Document" && <FileText className="w-4 h-4" />}
                                  {material === "Test" && <TestTube className="w-4 h-4" />}
                                  <span>{material}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="materials">
            <Card className="bg-[hsl(32,40%,35%)]/80 border-[hsl(40,30%,45%)] backdrop-blur-sm">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-[hsl(40,100%,94%)] mb-6">
                  Materials Included
                </h2>
                <div className="space-y-3">
                  {course.materials.map((material, index) => (
                    <div key={index} className="flex items-center gap-3 text-[hsl(40,80%,85%)]">
                      <CheckCircle className="w-5 h-5 text-[hsl(40,80%,65%)]" />
                      <span>{material}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AcademyDetail;
