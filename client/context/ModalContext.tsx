// 「集中管理所有登入/註冊相關 Modal 的開關狀態。」

'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type ModalContextType = {
  // 登入相關
  isLoginOpen: boolean;
  openLogin: () => void;
  closeLogin: () => void;

  isEmailLoginOpen: boolean;
  openEmailLogin: () => void;
  closeEmailLogin: () => void;

  isRegisterOpen: boolean;
  openRegister: () => void;
  closeRegister: () => void;

  isForgotPasswordOpen: boolean;
  openForgotPassword: () => void;
  closeForgotPassword: () => void;

  isPasswordSentOpen: boolean;
  openPasswordSent: () => void;
  closePasswordSent: () => void;
};

const ModalContext = createContext<ModalContextType>({} as ModalContextType);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isEmailLoginOpen, setIsEmailLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [isPasswordSentOpen, setIsPasswordSentOpen] = useState(false);

  return (
    <ModalContext.Provider
      value={{
        // Login
        isLoginOpen,
        openLogin: () => setIsLoginOpen(true),
        closeLogin: () => setIsLoginOpen(false),

        // EmailLogin
        isEmailLoginOpen,
        openEmailLogin: () => setIsEmailLoginOpen(true),
        closeEmailLogin: () => setIsEmailLoginOpen(false),

        // Register
        isRegisterOpen,
        openRegister: () => setIsRegisterOpen(true),
        closeRegister: () => setIsRegisterOpen(false),

        // ForgotPassword
        isForgotPasswordOpen,
        openForgotPassword: () => setIsForgotPasswordOpen(true),
        closeForgotPassword: () => setIsForgotPasswordOpen(false),

        // PasswordSent
        isPasswordSentOpen,
        openPasswordSent: () => setIsPasswordSentOpen(true),
        closePasswordSent: () => setIsPasswordSentOpen(false),
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);
