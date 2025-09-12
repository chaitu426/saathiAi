import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Container from "@/components/global/container";
import { OrbitingCircles } from "@/components/ui/orbiting-circles";
import Icons from "@/components/global/icons";
import { Bounce, toast } from "react-toastify";
import useAuthStore from "../stores/useAuthStore";
import {useNavigate} from "react-router-dom";

export default function DetailsPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    course: "",
    branch: "",
    year: "",
    learning_goals: "",
  });
  const { userdetails, loading, error } = useAuthStore();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await userdetails(formData);

    if(res){
      toast.success("data stored", {
        position: "top-right",
        autoClose: 5000,
        theme: "dark",
        transition: Bounce,
      });
      navigate(`/chat/${res.id}`);
    }else{
      toast.error(error || "Details submission failed", {
        position: "top-right",
        autoClose: 5000,
        theme: "dark",
        transition: Bounce,
      });
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-full min-h-screen py-12">
       <div className="absolute top-1/8 left-1/2 -z-10 bg-gradient-to-r from-sky-500 to-blue-600 w-1/2 lg:w-3/4 -translate-x-1/2 h-1/4 -translate-y-1/2 inset-0 blur-[4rem] lg:blur-[10rem] animate-image-glow"></div>
       <div className="hidden lg:block absolute -top-1/8 left-1/2 -z-20 bg-blue-600 w-1/4 -translate-x-1/2 h-1/4 -translate-y-1/2 inset-0 blur-[10rem] animate-image-glow"></div>

      <Container className="hidden lg:flex absolute inset-0 top-0 flex-col items-center justify-center w-full h-lg -z-10">
        <OrbitingCircles speed={0.5} radius={600}>
          <Icons.circle1 className="size-4 text-foreground/70" />
          <Icons.circle2 className="size-1 text-foreground/80" />
        </OrbitingCircles>
        <OrbitingCircles speed={0.25} radius={400}>
          <Icons.circle2 className="size-1 text-foreground/50" />
          <Icons.circle1 className="size-4 text-foreground/60" />
          <Icons.circle2 className="size-1 text-foreground/90" />
        </OrbitingCircles>
        <OrbitingCircles speed={0.1} radius={500}>
          <Icons.circle2 className="size-1 text-foreground/50" />
          <Icons.circle2 className="size-1 text-foreground/90" />
          <Icons.circle1 className="size-4 text-foreground/60" />
          <Icons.circle2 className="size-1 text-foreground/90" />
        </OrbitingCircles>
      </Container>

      <div className="relative z-20 w-full max-w-md">
        <Card className="bg-background/80 backdrop-blur-lg border border-border shadow-2xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl text-card-foreground">
              Student Details
            </CardTitle>
            <CardDescription className="text-foreground-muted">
              Tell us a bit about your academic background
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="course" className="text-card-foreground">
                  Course
                </Label>
                <Input
                  id="course"
                  name="course"
                  type="text"
                  placeholder="B.Tech"
                  value={formData.course}
                  onChange={handleInputChange}
                  required
                  className="bg-input border-border focus:border-input-focus"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="branch" className="text-card-foreground">
                  Branch
                </Label>
                <Input
                  id="branch"
                  name="branch"
                  type="text"
                  placeholder="Computer Science"
                  value={formData.branch}
                  onChange={handleInputChange}
                  required
                  className="bg-input border-border focus:border-input-focus"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="year" className="text-card-foreground">
                  Year
                </Label>
                <Input
                  id="year"
                  name="year"
                  type="text"
                  placeholder="3rd"
                  value={formData.year}
                  onChange={handleInputChange}
                  required
                  className="bg-input border-border focus:border-input-focus"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="learning_goals" className="text-card-foreground">
                  Learning Goals
                </Label>
                <Input
                  id="learning_goals"
                  name="learning_goals"
                  type="text"
                  placeholder="For university exam"
                  value={formData.learning_goals}
                  onChange={handleInputChange}
                  required
                  className="bg-input border-border focus:border-input-focus"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-white hover:bg-primary-hover text-black"
                disabled={loading}
              >
                {loading ? "saving details..." : "save details"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
