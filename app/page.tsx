import { TeaserSection }    from '@/components/home/TeaserSection'
import { AboutSection }     from '@/components/home/AboutSection'
import { FeaturesCarousel } from '@/components/home/FeaturesCarousel'
import { VsSection }        from '@/components/home/VsSection'
import { CommunitySection } from '@/components/CommunitySection'
import { HomeAnimations }   from '@/components/home/HomeAnimations'

export default function HomePage() {
  return (
    <>
      <TeaserSection />
      <AboutSection />
      <FeaturesCarousel />
      <VsSection />
      <CommunitySection />
      <HomeAnimations />
    </>
  )
}
