import PromptBox from "@/components/PromptBox"

const page = () => {
    return (
        <div className='grow relative h-full bg-background flex flex-col gap-10 justify-center items-center'>
            <svg className='w-full h-full absolute z-1' viewBox='0 0 160 90' preserveAspectRatio="none">
                <g stroke="#bbb" strokeOpacity="0.2" strokeWidth="0.3" fill="none">
                    <path d="M0,25 C40,20 80,40 160,50" />
                    <path d="M0,30 C50,22 85,45 160,52" />
                    <path d="M0,35 C45,25 75,55 160,55" />
                    <path d="M0,40 C55,30 85,50 160,58" />
                    <path d="M0,45 C43,35 78,53 160,60" />
                    <path d="M0,50 C52,33 82,60 160,62" />
                    <path d="M0,55 C47,37 80,57 160,65" />
                    <path d="M0,60 C50,40 83,60 160,67" />
                    <path d="M0,65 C53,38 81,62 160,70" />
                </g>
            </svg>
            <div className="text-4xl z-2 text-foreground">Let's build something <span className="text-primary font-medium">AMAZING</span> today</div>
            <PromptBox placeholder="What kind of form would you like to create today?" />
        </div>
    )
}

export default page