import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

const db = admin.firestore();
const messaging = admin.messaging();

interface Finding {
  id: string;
  title: string;
  severity: "critical" | "high" | "medium" | "low" | "info";
  status: string;
  targetId: string;
  targetName: string;
}

const ALERT_SEVERITIES = new Set(["critical", "high"]);

/**
 * Fires when a new security finding is written to Firestore.
 * Sends FCM push notifications to all admin users for critical/high findings.
 */
export const onFindingCreated = functions.firestore
  .document("findings/{findingId}")
  .onCreate(async (snap, context) => {
    const finding = snap.data() as Finding | undefined;
    if (!finding) return;

    if (!ALERT_SEVERITIES.has(finding.severity) || finding.status !== "open") {
      return;
    }

    // Get all admin users
    const adminsSnap = await db
      .collection("users")
      .where("isAdmin", "==", true)
      .get();

    const tokens: string[] = [];
    adminsSnap.forEach((doc) => {
      const user = doc.data();
      if (Array.isArray(user.fcmTokens)) {
        tokens.push(...user.fcmTokens);
      }
    });

    if (tokens.length === 0) {
      functions.logger.info("No admin FCM tokens found, skipping notification");
      return;
    }

    const severityLabel = finding.severity.toUpperCase();
    const message: admin.messaging.MulticastMessage = {
      tokens,
      notification: {
        title: `[${severityLabel}] Security Finding`,
        body: `${finding.title} — ${finding.targetName}`,
      },
      data: {
        findingId: context.params.findingId,
        severity: finding.severity,
        targetId: finding.targetId,
        type: "security_finding",
      },
      android: {
        priority: finding.severity === "critical" ? "high" : "normal",
      },
      apns: {
        payload: {
          aps: {
            sound: finding.severity === "critical" ? "default" : undefined,
          },
        },
      },
    };

    // Send in batches of 500 (FCM limit)
    for (let i = 0; i < tokens.length; i += 500) {
      const batch = tokens.slice(i, i + 500);
      const response = await messaging.sendEachForMulticast({
        ...message,
        tokens: batch,
      });
      functions.logger.info(
        `FCM batch sent: ${response.successCount} success, ${response.failureCount} failed`
      );
    }
  });
