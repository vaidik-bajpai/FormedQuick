import { TextShimmer } from "./ui/text-shimmer"

const CoverScreenModal = ({text}: {text: string}) => {
    return (
        <div className="fixed inset-0 flex flex-col justify-center items-center z-3 backdrop-blur">
            <TextShimmer duration={1} className="text-2xl">
                {text}
            </TextShimmer>
        </div>
    )
}

export default CoverScreenModal