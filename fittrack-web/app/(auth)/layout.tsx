export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md items-center px-4">
      <div className="card w-full p-6">{children}</div>
    </div>
  );
}
