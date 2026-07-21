import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import AdminSidebar from './AdminSidebar';
import AdminTopBar from './AdminTopBar';

async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  if (!token) return null;
  try {
    const secret = new TextEncoder().encode(process.env.SESSION_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload as { id: string; email: string; name: string; role: string };
  } catch {
    return null;
  }
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();

  if (!session || !['admin', 'super_admin'].includes(session.role)) {
    redirect('/auth/login?redirect=/admin');
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar userName={session.name} userEmail={session.email} />

      {/* Main content */}
      <div className="flex-1 lg:ml-64 min-w-0">
        <AdminTopBar session={session} />
        <main className="p-4 sm:p-6 lg:p-8 mt-14 lg:mt-0">
          {children}
        </main>
      </div>
    </div>
  );
}
