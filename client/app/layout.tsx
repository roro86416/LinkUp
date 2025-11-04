import './globals.css';
import { ModalProvider } from '../context/ModalContext';
import HeaderWrapper from './HeaderWrapper'; // ✅ 匯入包 header 的 client component
import Footer from '../components/Footer';
import LoginModal from '../components/modals/LoginModal';
import EmailLoginModal from '../components/modals/EmailLoginModal';
import RegisterModal from '../components/modals/RegisterModal';
import ForgotPasswordModal from '../components/modals/ForgotPasswordModal';
import PasswordSentModal from '../components/modals/PasswordSentModal';

export const metadata = {
  title: 'LinkUp 報名系統',
  description: '活動報名平台',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW">
      <body className="bg-white">
        <ModalProvider>
          {/* ✅ HeaderWrapper 裡會自動判斷是不是首頁 */}
          <HeaderWrapper />

          <main className="w-full justify-center m-0 p-0 min-h-screen">
            {children}
          </main>

          <LoginModal />
          <EmailLoginModal />
          <RegisterModal />
          <ForgotPasswordModal />
          <PasswordSentModal />

          <Footer />
        </ModalProvider>
      </body>
    </html>
  );
}
