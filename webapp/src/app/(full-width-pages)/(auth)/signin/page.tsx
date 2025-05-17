import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đăng nhập",
  description: "Trải nghiệm ngay sự tiện lợi của đặt chỗ giữ xe thông minh – tiết kiệm thời gian, giảm stress!",
};

export default function SignIn() {
  return <SignInForm />;
}
