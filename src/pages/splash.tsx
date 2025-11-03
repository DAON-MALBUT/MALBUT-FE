import MobileLayout from '@/layouts/mobile';

export default function SplashPage() {
  return (
    <MobileLayout showNavBar={false}>
      <div className="flex flex-col items-center justify-center h-full">
        <img src="/icon/splash.svg" alt="Daon Logo" className="w-64 h-64 mb-6" />
      </div>
    </MobileLayout>
  );
}