import { ChangeEvent } from "react";
import { Button } from "./ui/button";
import { ArrowUpIcon } from "lucide-react";

interface PromptBoxI {
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder: string
}

const PromptBox = ({onChange, placeholder}: PromptBoxI) => {
    return (
        <div className="z-2 w-2xl rounded-xl p-4 border border-border overflow-hidden bg-card text-card-foreground">
            <textarea   
                rows={5}
                className="w-full flex items-center border-none outline-none resize-none"
                placeholder={placeholder}
                onChange={onChange}
            />
            <div className="flex w-full justify-end mt-2">
                <Button variant="outline" size="icon" className="!bg-secondary !text-secondary-foreground">
                    <ArrowUpIcon />
                </Button>
            </div>
        </div>
    )
}

export default PromptBox