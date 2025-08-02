export interface AnalyticsData {
    totalClicks: number;
    uniqueVistors: number;
    countriesReach: number;
    totalLinksClicked: number;
    topLinkTitle: string | null;
    topReferrer: string | null;
    firstClick: string | null;
    lastClick: string | null;
}

export async function fetchAnalytics(
    userId: string,
    daysBack: number = 30,
): Promise<AnalyticsData> {
    if (!process.env.TINYBIRD_TOKEN || !process.env.TINYBIRD_HOST) {
        return {
            totalClicks: 0,
            uniqueVistors: 0,
            countriesReach: 0,
            totalLinksClicked: 0,
            topLinkTitle: null,
            topReferrer: null,
            firstClick: null,
            lastClick: null,
        };
    }

    try {
        // Use orignal profile_summary endpoint to keep topK functuonality
        const tinybirdResponse = await fetch(
            `${process.env.TINYBIRD_HOST}/v0/pipes/profile_summary.json?profileUserId=${userId}&days_back=${daysBack}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.TINYBIRD_TOKEN}`,
                }, 
                next: { revalidate: 0 }, // Cache for 0 sec 
            },
        );

        if (!tinybirdResponse.ok){
            console.error("Tinybird request failed:", await tinybirdResponse.text());
            throw new Error("Failed to fetch analytics");
        }

        const data = await tinybirdResponse.json();

        // Handle empty response
        if(!data.data || data.data.length === 0){
            return {
                totalClicks: 0,
                uniqueVistors: 0,
                countriesReach: 0,
                totalLinksClicked: 0,
                topLinkTitle: null,
                topReferrer: null,
                firstClick: null,
                lastClick: null,
            };
        }

        const analytics = data.data[0];

        return {
            totalClicks: analytics.total_clicks || 0,
            uniqueVistors: analytics.unique_users || 0,
            countriesReach: analytics.countries_reached || 0,
            totalLinksClicked: analytics.total_links_clicked || 0,
            topLinkTitle: analytics.top_link_title?.[0] || null,
            topReferrer: analytics.top_referrer?.[0] || null,
            firstClick:  analytics.first_click || null,
            lastClick:  analytics.last_click || null,
        };
    } catch (tinybirdError){
        console.error('Tinybird error:', tinybirdError);
        // Return empty data if tinybird fails
        return {
            totalClicks: 0,
            uniqueVistors: 0,
            countriesReach: 0,
            totalLinksClicked: 0,
            topLinkTitle: null,
            topReferrer: null,
            firstClick: null,
            lastClick: null,
        };
    }
}