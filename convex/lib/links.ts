import { mutation ,query } from "../_generated/server";
import { v } from "convex/values";

// Get links by user ID
export const getLinkByUserId = query({
    args: {userId: v.string()},
    returns: v.array(
        v.object({
            _id: v.id("links"),
            _creationTime: v.number(),
            userId: v.string(),
            title: v.string(),
            url: v.string(),
            order: v.number(),
        }),
    ),
    handler: async ({db}, args) => {
        return await db
            .query("links")
            .withIndex("by_user_and_order", (q) => q.eq("userId", args.userId))
            .order("asc")
            .collect();
    },
});

// Get links byy user slug ( username or Clerk Id )
export const getLinkBySlug = query({
    args: { slug: v.string() },
    returns: v.array(
        v.object({
            _id: v.id("links"),
            _creationTime: v.number(),
            userId: v.string(),
            title: v.string(),
            url: v.string(),
            order: v.number(),
        }),
    ),
    handler: async ({db}, args) => {
        const usernameRecord = await db
            .query("usernames")
            .withIndex("by_username", (q) => q.eq("username", args.slug))
            .unique();

        let userId: string;
        if(usernameRecord){
            userId = usernameRecord.userId;
        } else {
            userId = args.slug;
        }

        return await db
            .query("links")
            .withIndex("by_user_and_order", (q) => q.eq("userId", userId))
            .order("asc")
            .collect();
    },
});

// Update Order 
export const updateLinkOrder = mutation({
    args: { linkIds: v.array(v.id("links"))},
    returns: v.null(),
    handler: async ({db, auth}, {linkIds}) => {
        const identity = await auth.getUserIdentity();
        if(!identity) throw new Error("Not authenticated");

        const links = await Promise.all(linkIds.map((linkId) => db.get(linkId)));

        const validLinks = links
            .map((link, index) => ({ link, originalIndex: index }))
            .filter(({link}) => link && link.userId === identity.subject)
            .map(({link, originalIndex}) => ({
                link: link as NonNullable<typeof link>,
                originalIndex,
            }));
        
        await Promise.all(
            validLinks.map(({ link, originalIndex }) => 
                db.patch(link._id, { order: originalIndex}),
            ),
        );
        return null;
    },
});

// Update Link 
export const updateLink = mutation({
    args:{
        linkId: v.id('links'),
        title: v.string(),
        url: v.string(),
    },
    returns: v.null(),
    handler: async({ db, auth }, args ) => {
        const identity = await auth.getUserIdentity();
        if(!identity) throw new Error("Not authenticated");

        const link = await db.get(args.linkId);
        if(!link || link.userId !== identity.subject)
            throw new Error("Unauthorized");

        await db.patch(args.linkId, {
            title: args.title,
            url: args.url,
        });
        return null;
    },
});

// Delete Link 
export const deleteLink = mutation({
    args:{
        linkId: v.id('links'),
    },
    returns: v.null(),
    handler: async({ db, auth }, args ) => {
        const identity = await auth.getUserIdentity();
        if(!identity) throw new Error("Not authenticated");

        const link = await db.get(args.linkId);
        if(!link || link.userId !== identity.subject)
            throw new Error("Unauthorized");

        await db.delete(args.linkId);
        return null;
    },
});

// get number of links by user id 
export const getLinkCountByUserId = query({
    args: { userId: v.string() },
    returns: v.number(),
    handler: async({ db }, args ) => {
        const links = await db
            .query("links")
            .withIndex("by_user_and_order", (q) => q.eq("userId", args.userId))
            .collect();
        return links.length;
    },
});

// Create a Link
export const createLink = mutation({
    args: {
        title: v.string(),
        url: v.string(), 
    },
    returns: v.id("links"),
    handler: async ({ db, auth}, args) => {
        const identity = await auth.getUserIdentity();
        if(!identity) throw new Error("Not authernticated");

        return await db.insert("links", {
            userId: identity.subject,
            title: args.title,
            url: args.url,
            order: Date.now(), // use this for sorting by default order by create time ( newest first )
        })
    }
})