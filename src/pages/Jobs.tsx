import { Briefcase, MapPin, Clock, DollarSign } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Jobs = () => {
  const mockJobs = [
    {
      id: 1,
      title: "Barista",
      company: "Artisan Coffee House",
      location: "Downtown",
      type: "Full-time",
      salary: "$15-18/hr",
      description: "Looking for an experienced barista with latte art skills",
      posted: "2 days ago",
    },
    {
      id: 2,
      title: "Head Barista",
      company: "The Bean Scene",
      location: "City Center",
      type: "Full-time",
      salary: "$20-25/hr",
      description: "Lead our team and create exceptional coffee experiences",
      posted: "1 week ago",
    },
    {
      id: 3,
      title: "Coffee Roaster",
      company: "Premium Roasters Co.",
      location: "Industrial District",
      type: "Full-time",
      salary: "$45k-60k/year",
      description: "Experienced roaster needed for specialty coffee production",
      posted: "3 days ago",
    },
    {
      id: 4,
      title: "Part-time Barista",
      company: "Roast & Toast",
      location: "Suburb",
      type: "Part-time",
      salary: "$14-16/hr",
      description: "Weekend shifts available for passionate coffee enthusiasts",
      posted: "5 days ago",
    },
  ];

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 pb-24">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Coffee Jobs</h1>
          <p className="text-muted-foreground">Find your next opportunity in the coffee industry</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input placeholder="Search jobs..." className="md:col-span-2" />
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Job type..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="fulltime">Full-time</SelectItem>
              <SelectItem value="parttime">Part-time</SelectItem>
              <SelectItem value="contract">Contract</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {mockJobs.map((job) => (
            <Card key={job.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2 mb-2">
                      <Briefcase className="w-5 h-5 text-primary" />
                      {job.title}
                    </CardTitle>
                    <CardDescription className="text-base font-medium text-foreground">
                      {job.company}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">{job.type}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{job.description}</p>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    {job.salary}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {job.posted}
                  </div>
                </div>
                <Button className="w-full md:w-auto">Apply Now</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Jobs;
