export function getBaseUrl() {
    // check if we're in a browser environment 
    if(typeof window !== "undefined"){
        return window.location.origin;
    }

    // check if we're in a production enviroment 
    const isProduction = process.env.NODE_ENV === "production";

    if(isProduction){
        // Priority order for production URLs
        // custom url
        if(process.env.NEXT_PUBLIC_APP_URL){
            return process.env.NEXT_PUBLIC_APP_URL;
        }

        // vercel URL 
        if(process.env.VERCEL_URL){
            return `https://${process.env.VERCEL_URL}`;
        }

        // vercel project url
        if(process.env.VERCEL_PROJECT_PRODUCTION_URL){
            return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
        }

        throw new Error(
            "No production URL configured. Please set NEXT_PUBLIC_APP_URL environment variable",
        )
    }

    // default for development
    return "https://localhost:3000";
}