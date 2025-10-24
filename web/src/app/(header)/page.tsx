import FeaturesSection from "@/components/FeaturesSection"
import HeroSection from "@/components/HeroSection"
import HowItWorksSection from "@/components/HowItWorksSection"
import ProblemStatementSection from "@/components/ProblemStatementSection"

const page = () => {
    return (
        <div className="grow mx-auto w-7xl px-6">
            <HeroSection />
            {/*<ProblemStatementSection />*/}
            <FeaturesSection />
            <HowItWorksSection />
        </div>

    )
}

export default page