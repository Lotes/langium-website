import { TeaserSection }    from '@/components/home/TeaserSection'
import { AboutSection }     from '@/components/home/AboutSection'
import { FeaturesCarousel } from '@/components/home/FeaturesCarousel'
import { VsSection }        from '@/components/home/VsSection'
import { CommunitySection } from '@/components/CommunitySection'
import { HomeAnimations }   from '@/components/home/HomeAnimations'
import { ForceDarkMode }    from '@/components/home/ForceDarkMode'

export default function HomePage() {
  return (
    <>
      <ForceDarkMode />
      <TeaserSection />
      <AboutSection />
      <FeaturesCarousel />
      <VsSection />
      <CommunitySection />
      <HomeAnimations />
    </>
  )
}
