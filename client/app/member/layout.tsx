import UserLayout from '@/components/layout/UserLayout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <UserLayout type="member">{children}</UserLayout>;
}
