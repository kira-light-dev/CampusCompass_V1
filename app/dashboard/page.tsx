import { DashboardLayout } from "@/components/dashboard-layout"
import { WelcomeSection } from "@/components/home/welcome-section"
import { QuickActions } from "@/components/home/quick-actions"
import { ProgressOverview } from "@/components/home/progress-overview"

export default function DashboardPage() {
    return (
        <DashboardLayout>
            <div className="space-y-6">
                <WelcomeSection />
                <div>
                    <h3 className="mb-4 text-lg font-semibold text-foreground">
                        Quick Actions
                    </h3>
                    <QuickActions />
                </div>
                <div>
                    <h3 className="mb-4 text-lg font-semibold text-foreground">
                        Progress Overview
                    </h3>
                    <ProgressOverview />
                </div>
            </div>
        </DashboardLayout>
    )
}
