"use client";

import PromptBox from "@/components/PromptBox";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "../../../api/axiosInstance";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import FormPreview from "@/components/FormPreview";
import { FormSchema } from "@/types/form.types";
import { useState } from "react";
import { useUserStore } from "@/store/user.store";
import { v4 as uuidv4 } from "uuid";
import { useRecentFormsStore } from "@/store/form.store";

const generateFormSchema = z.object({
  prompt: z.string().min(10, "Prompt must be at least 10 characters long").max(5000),
});

const Page = () => {
  const router = useRouter();
  const [id, setID] = useState<string>("");
  const [formSchema, setFormSchema] = useState<FormSchema>();
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const addRecentForm = useRecentFormsStore((state) => state.addRecentForm);
  const clearUser = useUserStore((state) => state.clearUser);

  const form = useForm<z.infer<typeof generateFormSchema>>({
    resolver: zodResolver(generateFormSchema),
    defaultValues: {
      prompt: "",
    },
  });

  async function handleGenerateForm(data: { text: string; files: File[] }) {
    const formData = new FormData();
    formData.append("prompt", data.text);
    data.files.forEach((file) => formData.append("files", file));

    setLoading(true);
    setShowPreview(true);

    try {
      const response = await axios.post("/form/generate", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("form-gen-access-token")}`,
        },
      });

      console.log("form schema generated:", response.data);

      const randomID = uuidv4();
      const generatedForm = response.data.data.form;
      const generatedPrompt = response.data.data.prompt;

      setID(randomID);
      setFormSchema(generatedForm);
      addRecentForm({
        id: randomID,
        schema: generatedForm,
        prompt: generatedPrompt,
      });
      setShowPreview(true);
    } catch (error) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        switch (status) {
          case 401:
            toast("Unauthorized, please log in again");
            clearUser();
            router.push("/signin");
            break;
          default:
            toast(error.response?.data?.message || "Something went wrong, try again later.");
        }
      } else {
        toast("Something went wrong, try again later.");
      }
    } finally {
      setLoading(false);
    }
  }

  function onClose() {
    setShowPreview(false);
    setFormSchema(undefined);
  }

  return (
    <div className="grow relative h-full bg-background flex flex-col gap-10 justify-center items-center py-16">
      <div className="text-4xl text-foreground z-2 text-center">
        Let’s build something <span className="text-primary font-medium">amazing</span> today
      </div>

      <Controller
        name="prompt"
        control={form.control}
        render={({ field }) => (
          <PromptBox
            placeholder="What kind of form would you like to create? You can also upload up to 2 related files."
            value={field.value}
            onChange={field.onChange}
            onSubmit={async ({ text, files }) => {
              if (!text.trim()) {
                toast("Please enter a prompt before submitting");
                return;
              }

              await handleGenerateForm({ text, files });
              form.reset({ prompt: "" });
            }}
          />
        )}
      />

      {showPreview && (formSchema || loading) && (
        <FormPreview id={id} schema={formSchema} onClick={onClose} loading={loading} />
      )}
    </div>
  );
};

export default Page;
