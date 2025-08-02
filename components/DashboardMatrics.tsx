import { AnalyticsData } from "@/lib/analytics-server"
import { Protect } from "@clerk/nextjs";
import { Calendar, Clock, ExternalLink, Globe, Link, Lock, MousePointer, TrendingUp, User } from "lucide-react";

interface DashboardMatricsProps {
    analytics: AnalyticsData
}

const DashboardMatrics = ({ analytics }: DashboardMatricsProps) => {
  
  const formatDate = (dateString: string | null ) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
  };

  const formatReferrer = (referrer: string | null ) => {
    if(!referrer || referrer === "direct") return "Direct";
    try {
        const url = new URL(referrer);
        return url.hostname.replace("www.", "");
    } catch {
        return referrer;
    }
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 lg:p-8 mb-8">
        <div className="max-w-7xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-xl shadow-gray-200/50">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Analytic Overview</h2>
                    <p className="text-gray-600">Last 30 days performance metrics</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                    {/* Total Clicks */}
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-blue-500 rounded-xl">
                                <MousePointer className="size-6 text-white" />
                            </div>
                            <div className="text-blue-500">
                                <TrendingUp className="size-5" />
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-blue-600 mb-1">Total Clicks</p>
                            <p className="text-3xl font-bold text-blue-900">
                                {analytics.totalClicks.toLocaleString()}
                            </p>
                        </div>
                    </div>

                    {/* Unique Vistors */}
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-purple-500 rounded-xl">
                                <User className="size-6 text-white" />
                            </div>
                            <div className="text-purple-500">
                                <TrendingUp className="size-5" />
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-purple-600 mb-1">Unique Vistors</p>
                            <p className="text-3xl font-bold text-purple-900">
                                {analytics.uniqueVistors.toLocaleString()}
                            </p>
                        </div>
                    </div>
                    
                    {/* Countries Reach */}
                    <Protect plan='ultra' fallback={
                        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200 opacity-75">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-green-500/50 rounded-xl">
                                    <Globe className="size-6 text-white/75" />
                                </div>
                                <div className="text-green-500/75">
                                    <Lock className="size-5" />
                                </div>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-green-600/75 mb-1">Countries</p>
                                <p className="text-xl font-bold text-green-900/75">
                                    Upgrade to Ultra
                                </p>
                            </div>
                        </div>
                        }
                    >
                        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-green-500 rounded-xl">
                                    <MousePointer className="size-6 text-white" />
                                </div>
                                <div className="text-green-500">
                                    <TrendingUp className="size-5" />
                                </div>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-green-600 mb-1">Countries</p>
                                <p className="text-3xl font-bold text-green-900">
                                    {analytics.countriesReach.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </Protect>

                    {/* Total Link clicked */}
                    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-2xl border border-indigo-200">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-indigo-500 rounded-xl">
                                <Link className="size-6 text-white" />
                            </div>
                            <div className="text-indigo-500">
                                <ExternalLink className="size-5" />
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-indigo-600 mb-1">Links Clicked</p>
                            <p className="text-3xl font-bold text-indigo-900">
                                {analytics.totalLinksClicked.toLocaleString()}
                            </p>
                        </div>
                    </div>

                    {/*  Activity Period */}
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-2xl border border-orange-200">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-orange-500 rounded-xl">
                                <Calendar className="size-6 text-white" />
                            </div>
                            <div className="text-orange-500">
                                <Clock className="size-5" />
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-orange-600 mb-1">Last Activity</p>
                            <p className="text-lg font-bold text-orange-900">
                                {formatDate(analytics.lastClick)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Additional Metrics */}
                {(analytics.topLinkTitle || analytics.topReferrer ) && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Top Performing Link */}
                        {analytics.topLinkTitle && (
                            <div className="bg-gradient-to-r from-slate-50 to-slate-200 p-6 rounded-2xl border border-slate-200">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-2 bg-slate-500 rounded-lg">
                                        <ExternalLink className="size-4 text-white" />
                                    </div>
                                    <h3 className="font-semibold text-shadow-slate-900">Top Performing Link</h3>
                                </div>
                                <p className="text-slate-700 font-medium truncate">
                                    {analytics.topLinkTitle}
                                </p>
                            </div>
                        )}

                        {/* Top Referrer */}
                        {analytics.topReferrer && (
                            <div className="bg-gradient-to-r from-slate-50 to-slate-200 p-6 rounded-2xl border border-slate-200">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-2 bg-slate-500 rounded-lg">
                                        <ExternalLink className="size-4 text-white" />
                                    </div>
                                    <h3 className="font-semibold text-shadow-slate-900">Top Referrer</h3>
                                </div>
                                <p className="text-slate-700 font-medium truncate">
                                    {formatReferrer(analytics.topReferrer)}
                                </p>
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>
    </div>
  )
}

export default DashboardMatrics