import FeaturesSection from "@/components/FeaturesSection"
import HeroSection from "@/components/HeroSection"
import HowItWorksSection from "@/components/HowItWorksSection"

const page = () => {
    return (
        <div className="grow mx-auto px-6">
            <HeroSection />
            <FeaturesSection />
            <HowItWorksSection />
        </div>
    )
}

export default page