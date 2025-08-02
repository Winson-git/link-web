export interface LinkAnalyticsData {
    linkId: string;
    linkTitle: string;
    linkUrl: string;
    totalClicks: number;
    uniqueUsers: number;
    countriesReached: number;
    dailyData: Array<{
        date: string;
        clicks: number;
        uniqueUsers: number;
        countries: number;
    }>;
    countryData: Array<{
        country: string;
        clicks: number;
        percentage: number;
    }>;
}

interface TinybirdLinkAnalyticsRow {
    date: string;
    linkTitle: string;
    linkUrl: string;
    total_clicks: number;
    unique_users: number;
    countries_reached: number;
}

interface TinybirdCountryAnalyticsRow {
    counrty: string;
    total_clicks: number;
    unique_users: number;
    percentage: number;
}

export async function fetchLinkAnalytics(
    userId: string,
    linkId: string,
    daysBack: number = 30,
): Promise<LinkAnalyticsData | null> {
    // Check if tinybird is configured
    if (!process.env.TINYBIRD_TOKEN || !process.env.TINYBIRD_HOST) {
        return{
            linkId,
            linkTitle: "sample link",
            linkUrl: "https://google.com",
            totalClicks: 0,
            uniqueUsers: 0,
            countriesReached: 0,
            dailyData: [],
            countryData: [],
        };
    }

    try {
        // Try fast materialized endpoint first
        let tinybirdResponse = await fetch(
            `${process.env.TINYBIRD_HOST}/v0/pipes/fast_link_analytics.json?profileUserId=${userId}&linkId=${linkId}&days_back=${daysBack}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.TINYBIRD_TOKEN}`,
                },
                next: { revalidate: 0 },
            },
        );

        // Fallback to orginal endpoint if materialized data not available
        if (!tinybirdResponse.ok){
            console.log("Fast link analytics failed, falling back to orignal");
            tinybirdResponse = await fetch(
                `${process.env.TINYBIRD_HOST}/v0/pipes/link_analytics.json?profileUserId=${userId}&linkId=${linkId}&days_back=${daysBack}`,
                {
                    headers: {
                        Authorization: `Bearer ${process.env.TINYBIRD_TOKEN}`,
                    },
                    next: { revalidate: 0 },
                },
            );
        }

        if (!tinybirdResponse.ok){
            console.error("Tinybird request failed:", await tinybirdResponse.text());
            throw new Error("Failed to fetch link analytics");
        }

        const data = await tinybirdResponse.json();

        // Handle empty respone
        if (!data.data || data.data.length == 0){
            return null;
        }

        // Provess the daily data
        const dailyData = data.data.map((row: TinybirdLinkAnalyticsRow) => ({
            date: row.date,
            clicks: row.total_clicks || 0,
            uniqueUsers: row.unique_users || 0,
            countries: row.countries_reached || 0,
        }))

        //  Calculate totals
        const totalClicks = dailyData.reduce(
            (sum: number, day: { clicks: number }) => sum + day.clicks,
            0,
        );
        const unique_users = Math.max(
            ...dailyData.map((day: { uniqueUsers: number }) => day.uniqueUsers),
            0,
        );
        const countriesReached = Math.max(
            ...dailyData.map((day: { countries: number }) => day.countries),
            0,
        );  

        // Get link info from first row
        const firstRow = data.data[0] as TinybirdLinkAnalyticsRow;

        // Fetch country-level data from the country analytics endpoint
        let countryData : Array<{
            country: string;
            clicks: number;
            percentage: number;
        }> = [];

        try {
            const counrtyResponse = await fetch(
                `${process.env.TINYBIRD_HOST}/v0/pipes/country_link_analytics.json?profileUserId=${userId}&linkId=${linkId}&days_back=${daysBack}`,
                {
                    headers: {
                        Authorization: `Bearer ${process.env.TINYBIRD_TOKEN}`,
                    },
                    next: { revalidate: 0 },
                },
            );

            if (!counrtyResponse.ok){
                const counrtyResult = await counrtyResponse.json();

                if(counrtyResult.data && counrtyResult.data.length > 0){
                    countryData = counrtyResult.data.map(
                        (row: TinybirdCountryAnalyticsRow) => ({
                            country: row.counrty || "Unknown",
                            clicks: row.total_clicks || 0,
                            percentage: row.percentage || 0,
                        }),
                    )
                }
            }
        } catch (countryError) {
            console.error("Failed to fetch country data:", countryError)
        }

        return {
            linkId,
            linkTitle: firstRow.linkTitle || "Unknown",
            linkUrl: firstRow.linkUrl || "https://example.com",
            totalClicks: totalClicks,
            uniqueUsers: unique_users,
            countriesReached: countriesReached,
            dailyData: dailyData.reverse(), // reverse to show the most recent data first
            countryData: countryData,
        };

    } catch (tinybirdError) {
        console.error("Failed to fetch link analytics:", tinybirdError);
        return null;
    }
}