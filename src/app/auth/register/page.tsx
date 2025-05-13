"use client";

import Link from "next/link";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { UserRegisterForm } from "@/features/auth/components/RegisterForm/UserRegisterForm";
import { VolunteerCenterRegisterForm } from "@/features/auth/components/RegisterForm/VolunteerCenterRegisterForm";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [selectedTab, setSelectedTab] = useState<string>("user");
  const router = useRouter();
  
  const handleRegisterSuccess = () => {
    // Chuyển hướng đến trang chính sau khi đăng ký thành công
    setTimeout(() => {
      router.push('/');
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-4xl shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Đăng ký tài khoản mới</CardTitle>
          <CardDescription>
            Chọn loại tài khoản phù hợp với nhu cầu của bạn
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs 
            defaultValue="user" 
            value={selectedTab}
            onValueChange={setSelectedTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="user">Người dùng thông thường</TabsTrigger>
              <TabsTrigger value="volunteer-center">Trưởng cơ sở tình nguyện</TabsTrigger>
            </TabsList>
            
            <TabsContent value="user" className="mt-0">
              <UserRegisterForm onSuccess={handleRegisterSuccess} />
            </TabsContent>
            
            <TabsContent value="volunteer-center" className="mt-0">
              <VolunteerCenterRegisterForm onSuccess={handleRegisterSuccess} />
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            Đã có tài khoản?{" "}
            <Link 
              href="/auth/login" 
              className="text-blue-600 hover:underline font-medium"
            >
              Đăng nhập ngay
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
} 