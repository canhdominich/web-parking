import SignUpForm from "@/components/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đăng ký",
  description: "Trải nghiệm ngay sự tiện lợi của đặt chỗ giữ xe thông minh – tiết kiệm thời gian, giảm stress!",
};

export default function SignUp() {
  return <SignUpForm />;
}
