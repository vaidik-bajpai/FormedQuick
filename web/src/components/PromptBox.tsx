import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { ArrowUpIcon } from "lucide-react";

interface PromptBoxI {
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    value?: string
    placeholder: string
    onSubmit?: () => void
}

const PromptBox = ({onChange, placeholder, value, onSubmit}: PromptBoxI) => {
    const isTextEntered = value ? value.trim().length > 0 : false;

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (isTextEntered) onSubmit?.();
        }
    };

    const router = useRouter()

    return (
        <div 
                className="z-2 w-2xl rounded-xl p-4 border border-border overflow-hidden 
                    bg-card text-card-foreground ring-primary/50 ring-offset-2 
                    focus-within:ring-2 transform 
                    transition-all duration-500 delay-200 ease-in-out
                "
        >
            <textarea   
                rows={5}
                className="w-full flex items-center border-none outline-none resize-none"
                placeholder={placeholder}
                onChange={onChange}
                onKeyDown={handleKeyDown}
                value={value}
            />
            <div className="flex w-full justify-between items-center mt-2">
                <Button className="bg-primary text-primary-foreground font-medium" onClick={() => router.push("/my-forms")}>
                    My forms
                </Button>
                <Button 
                    variant="outline"
                    size="icon" 
                    type="submit" 
                    className={`!bg-secondary !text-secondary-foreground transition-all delay-200 duration-500 `}
                    onClick={() => isTextEntered && onSubmit?.()}
                >
                    <ArrowUpIcon />
                </Button>
            </div>  
        </div>
    )
}

export default PromptBox