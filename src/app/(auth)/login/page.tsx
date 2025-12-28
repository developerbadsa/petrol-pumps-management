import PageHero from '@/components/shared/PageHero';
import Footer from '@/components/layout/Footer';

import heroBg from '@/assets/newsfeed-img/banner.png';
import LoginSection from '@/components/auth/LoginSection';

export default function LoginPage() {
  return (
    <div>
      <PageHero
        title="Login"
        subtitle="Lorem ipsum dolor sit amet consectetur. Neque aliquam amet commodo sollicitudin"
        backgroundImage={heroBg}
        height="compact"
      />

      <LoginSection />

      <Footer />
    </div>
  );
}
