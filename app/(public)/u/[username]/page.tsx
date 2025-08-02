import PublicPageContent from "@/components/PublicPageContent";
import { api } from "@/convex/_generated/api";
import { preloadQuery } from "convex/nextjs";

const PubicLinkBioPage = async ({params}: {params: Promise<{username: string}>}) => {

    const { username } = await params; 

    const [preloadedLinks, preloadedCustomizations] = await Promise.all([
        preloadQuery(api.lib.links.getLinkBySlug, {
            slug: username,
        }),
        preloadQuery(api.lib.customizations.getCustomizationsBySlug,{
            slug: username,
        }),
    ]);

    return (
        <PublicPageContent
            username={username}
            preloadedLinks={preloadedLinks}
            preloadedCustomizations={preloadedCustomizations}
        />
    )
}

export default PubicLinkBioPage