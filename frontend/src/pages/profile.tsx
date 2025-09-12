import { useState } from "react";
import { User, Settings, BookOpen, MessageSquare, Upload, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { AppLayout } from "../components/layout/AppLayout";

export default function Profile() {
  const [profileData, setProfileData] = useState({
    name: "Alex Johnson",
    email: "alex.johnson@university.edu",
    bio: "Computer Science student passionate about AI and machine learning.",
    university: "Stanford University",
    studyLevel: "Graduate"
  });

  const [preferences, setPreferences] = useState({
    aiPersonality: "friendly",
    responseLength: "detailed",
    studyReminders: true,
    emailNotifications: false
  });

  const handleProfileUpdate = () => {
    // Simulate save
    alert("Profile updated successfully!");
  };

  const handlePreferencesUpdate = () => {
    // Simulate save
    alert("Preferences updated successfully!");
  };

  const stats = [
    { label: "Study Frames", value: "12", icon: BookOpen },
    { label: "Messages Sent", value: "847", icon: MessageSquare },
    { label: "Days Active", value: "23", icon: Settings },
    { label: "Materials Uploaded", value: "34", icon: Upload }
  ];

  return (
    <AppLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Profile Settings</h1>
          <p className="text-foreground-muted">Manage your account settings and study preferences</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-card border-card-border">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg mx-auto mb-2">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="text-2xl font-bold text-card-foreground">{stat.value}</div>
                <div className="text-sm text-foreground-muted">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-card border-card-border">
            <TabsTrigger value="profile" className="data-[state=active]:bg-accent">Profile</TabsTrigger>
            <TabsTrigger value="preferences" className="data-[state=active]:bg-accent">AI Preferences</TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-accent">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card className="bg-card border-card-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">Personal Information</CardTitle>
                <CardDescription className="text-foreground-muted">
                  Update your basic profile information and study details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-6">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="/placeholder-avatar.jpg" />
                    <AvatarFallback className="text-xl bg-primary text-primary-foreground">
                      {profileData.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline">Change Photo</Button>
                    <p className="text-sm text-foreground-muted mt-2">
                      JPG, GIF or PNG. Max size 2MB.
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-card-foreground">Full Name</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                      className="bg-input border-input-border focus:border-input-focus"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-card-foreground">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                      className="bg-input border-input-border focus:border-input-focus"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="university" className="text-card-foreground">University</Label>
                    <Input
                      id="university"
                      value={profileData.university}
                      onChange={(e) => setProfileData(prev => ({ ...prev, university: e.target.value }))}
                      className="bg-input border-input-border focus:border-input-focus"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="studyLevel" className="text-card-foreground">Study Level</Label>
                    <select
                      id="studyLevel"
                      value={profileData.studyLevel}
                      onChange={(e) => setProfileData(prev => ({ ...prev, studyLevel: e.target.value }))}
                      className="w-full h-10 px-3 rounded-md bg-input border border-input-border focus:border-input-focus text-card-foreground"
                    >
                      <option value="Undergraduate">Undergraduate</option>
                      <option value="Graduate">Graduate</option>
                      <option value="PhD">PhD</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button 
                    onClick={handleProfileUpdate}
                    className="bg-primary hover:bg-primary-hover text-primary-foreground"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <Card className="bg-card border-card-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">AI Assistant Preferences</CardTitle>
                <CardDescription className="text-foreground-muted">
                  Customize how your AI study assistant behaves and responds
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-card-foreground">AI Personality</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {["Friendly", "Professional", "Casual"].map((personality) => (
                        <label key={personality} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            name="personality"
                            value={personality.toLowerCase()}
                            checked={preferences.aiPersonality === personality.toLowerCase()}
                            onChange={(e) => setPreferences(prev => ({ ...prev, aiPersonality: e.target.value }))}
                            className="w-4 h-4"
                          />
                          <span className="text-card-foreground">{personality}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-card-foreground">Response Length</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {["Concise", "Detailed", "Comprehensive"].map((length) => (
                        <label key={length} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            name="responseLength"
                            value={length.toLowerCase()}
                            checked={preferences.responseLength === length.toLowerCase()}
                            onChange={(e) => setPreferences(prev => ({ ...prev, responseLength: e.target.value }))}
                            className="w-4 h-4"
                          />
                          <span className="text-card-foreground">{length}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-border">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-card-foreground">Study Reminders</Label>
                        <p className="text-sm text-foreground-muted">Get notified about study sessions</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences.studyReminders}
                        onChange={(e) => setPreferences(prev => ({ ...prev, studyReminders: e.target.checked }))}
                        className="w-4 h-4"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-card-foreground">Email Notifications</Label>
                        <p className="text-sm text-foreground-muted">Receive updates via email</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences.emailNotifications}
                        onChange={(e) => setPreferences(prev => ({ ...prev, emailNotifications: e.target.checked }))}
                        className="w-4 h-4"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button 
                    onClick={handlePreferencesUpdate}
                    className="bg-primary hover:bg-primary-hover text-primary-foreground"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card className="bg-card border-card-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">Security Settings</CardTitle>
                <CardDescription className="text-foreground-muted">
                  Manage your account security and privacy settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword" className="text-card-foreground">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      className="bg-input border-input-border focus:border-input-focus"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-card-foreground">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      className="bg-input border-input-border focus:border-input-focus"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-card-foreground">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      className="bg-input border-input-border focus:border-input-focus"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-card-foreground font-medium">Two-Factor Authentication</h4>
                      <p className="text-sm text-foreground-muted">Add an extra layer of security to your account</p>
                    </div>
                    <Badge variant="secondary">Not Enabled</Badge>
                  </div>
                  <Button variant="outline">Enable 2FA</Button>
                </div>

                <div className="flex justify-between">
                  <Button variant="destructive">Delete Account</Button>
                  <Button className="bg-primary hover:bg-primary-hover text-primary-foreground">
                    <Save className="h-4 w-4 mr-2" />
                    Update Password
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}