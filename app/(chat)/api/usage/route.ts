import { auth } from "@/app/(auth)/auth";
import { entitlementsByUserType } from "@/lib/ai/entitlements";
import { getApiUsageCountByUserId } from "@/lib/db/queries";
import type { ApiUsageSummary } from "@/lib/types";

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    const data: ApiUsageSummary = {
      used: 0,
      maxApiCalls: entitlementsByUserType.guest.maxApiCallsPerDay,
      userType: "guest",
      isAuthenticated: false,
    };
    return Response.json(data);
  }

  const userType = session.user.type;
  const used = await getApiUsageCountByUserId({
    id: session.user.id,
    endpoint: "chat",
    differenceInHours: 24,
  });

  const data: ApiUsageSummary = {
    used,
    maxApiCalls: entitlementsByUserType[userType].maxApiCallsPerDay,
    userType,
    isAuthenticated: userType === "regular",
  };

  return Response.json(data);
}
