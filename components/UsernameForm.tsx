"use client";

import { useUser } from "@clerk/clerk-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { AlertCircle, CheckCircle, Copy, ExternalLink, Loader2, User } from "lucide-react";
import { Button } from "./ui/button";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { getBaseUrl } from "@/convex/lib/getBaseUrl";
import { toast } from "sonner";

const formSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(20, "Username must be at most 20 characters long")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
})

const UsernameForm = () => {

    const { user } = useUser(); 
    const [debouncedUsername, setDebouncedUsername] = useState("");

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
        },
    });

    const watchUsername = form.watch("username");

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedUsername(watchUsername);
        }, 500); 
        return () => {
            clearTimeout(handler);
        };
    }, [watchUsername]);

    const currentSlug = useQuery(
        api.lib.usernames.getUserSlug,
        user?.id ? { userId : user.id } : "skip",
    )

    const availabilityCheck = useQuery(
        api.lib.usernames.checkUsernameAvailability,
        debouncedUsername.length >= 3 ? { username: debouncedUsername } : "skip",
    )

    const setUsername = useMutation(api.lib.usernames.setUsername);

    const getStatus = () => {
        if(!debouncedUsername || debouncedUsername.length < 3 ) return null;
        if(debouncedUsername !== watchUsername) return "checking";
        if(!availabilityCheck) return "checking";
        if(debouncedUsername === currentSlug) return "current";
        return availabilityCheck.available ? "available" : "unavailable";
    }

    const status = getStatus();

    const hasCustomUsername = currentSlug && currentSlug !== user?.id;

    const isSubmitDisabled = status !== "available" || form.formState.isSubmitting;

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!user?.id) return;
        try {
            // console.log("Submit form", values)
            const result = await setUsername({ username: values.username });
            if(result.success){
                form.reset();
            } else {
                form.setError("username", {message: result.error})
            }
        } catch (error){
            form.setError("username", {
                message: "Failed to update. Please try again",
            });
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Customize Your Link</h3>
                <p className="text-gray-600 text-sm">Choose a custom username for your link-in-bio page. This will be your public URL.</p>
            </div>

            {/* Current username status */}
            {hasCustomUsername && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <User className="size-4 text-green-600"/>
                            <span className="text-sm font-medium text-green-900">
                                Current Username
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-mono text-green-800 bg-white px-2 py-1 rounded text-sm">
                                {currentSlug}
                            </span>
                            <Link 
                                href={`/u/${currentSlug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-green-600 hover:text-green-700 transition-colors"
                            >
                                <ExternalLink className="size-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Url preview */}
            <div className="bg-gray-50 broder border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-gray-500 rounded-full">
                    </div>
                        <span className="text-sm font-medium text-gray-700">
                            Your Link Preview
                        </span>
                </div>
                <div className="flex items-center">
                    <Link
                        href={`/u/${currentSlug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 font-mono text-gray-800 bg-white h-10 px-3 py-2 rounded-l border-l border-y hover:bg-gray-50 transition-colors truncate"
                    >
                        {getBaseUrl()}/u/${currentSlug}
                    </Link>
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(`${getBaseUrl()}/u/${{currentSlug}}`);
                            toast.success("Copied to clipboard");
                        }}
                        className="flex items-center justify-center w-10 h-10 bg-white border rounded-r hover:bg-gray-50 transition-colors"
                        title="Copy to clipboard"
                    >
                        <Copy className="size-4 text-gray-500" />
                    </button>
                </div>
            </div>

            {/* Form */}
            <Form {...form}>
                <form 
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                >
                    <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Input
                                        placeholder="enter your username"
                                        {...field}
                                        className="pr-10"
                                    />
                                    <div className=" absolute right-3 top-1/2 transform -translate-y-1/2">
                                        {status === "checking" && (
                                            <Loader2 className="size-4 animate-spin text-gray-400" />
                                        )}
                                        {status === "available" && (
                                            <CheckCircle className="size-4 text-green-500" />
                                        )}
                                         {status === "current" && (
                                            <User className="size-4 text-blue-500" />
                                        )}
                                         {status === "unavailable" && (
                                            <AlertCircle className="size-4 text-red-500" />
                                        )}
                                    </div>
                                </div>
                            </FormControl>
                            <FormDescription>
                                Your username can contain letters, numbers, hyphens, and underscores.
                            </FormDescription>
                            {status === "available" &&(
                                <p className="text-sm text-green-600">Username is available</p>
                            )}
                            {status === "current" &&(
                                <p className="text-sm text-blue-600">This is your current usernam</p>
                            )}
                            {status === "unavailable" &&(
                                <p className="text-sm text-red-600">
                                    {availabilityCheck?.error || "Username is already taken"}
                                </p>
                            )}
                            <FormMessage />
                        </FormItem>
                    )}/>

                    <Button 
                        type="submit"
                        className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
                        disabled={isSubmitDisabled}
                    >
                        {form.formState.isSubmitting ? (
                            <>
                                <Loader2 className="size-4 animate-spin" />
                                Updating...
                            </>
                        ):(
                            "Update Username"
                        )}
                    </Button>
                </form>
            </Form>
        </div>
    )
}

export default UsernameForm

