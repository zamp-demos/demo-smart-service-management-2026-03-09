import React, { useState } from 'react';
import {
    ChevronDown,
    ChevronRight,
    CheckCircle2,
    Edit3,
    RefreshCw,
    X,
    Save,
    AlertTriangle,
    TrendingUp,
    FileText,
    Zap,
    ArrowRight,
    ArrowLeftRight,
    ArrowLeft,
} from 'lucide-react';

const INSIGHTS_DATA = [
{
    id: "INS-HSBC-001",
    status: "Pending Approval",
    category: "Active Cross-Process",
    direction: "Service Mgmt → Disputes",
    severity: "high",
    title: "PAs requesting merchant credit status updates in Service Mgmt — credits never posting, converting to chargebacks 18 days later",

    description: "Service Management is fielding 'where is my refund?' queries from Programme Administrators who were told by the merchant that a credit is being processed. In 41% of these cases, that credit never posts to the card account. The same transaction then surfaces as a formal chargeback 2–3 weeks later — with the PA required to restart the entire evidence-gathering process from scratch, having lost valuable days in the filing window and having no record of their prior merchant contact documented in the disputes system.",

    dataPoints: [
      "387 'merchant credit status' service queries raised in Q4 2025 across HSBC commercial card programmes",
      "159 of those (41%) resulted in a formal chargeback filing within 18 days of the original service query",
      "In 92% of those 159 converted cases, the PA had been explicitly told by the Service Management team that the credit was 'in progress' — creating a false sense of resolution",
      "Average chargeback cycle time for these converted cases: 34 days — vs. 22 days for standard chargebacks filed without prior service query",
      "Top offending merchants: 3 SaaS vendors and 2 travel management companies with documented slow-refund processes — accounting for 67% of all converted cases",
      "Filing window consumed at point of chargeback initiation: average 26 days already elapsed — leaving 94 days of the 120-day window remaining"
    ],

    currentSOP: "Service Management SOP: When a PA inquires about a pending merchant credit, check the transaction status in the Auth Platform. If credit shows as 'processing' or 'pending,' inform the PA and close the ticket. No auto-follow-up trigger. No escalation path to Disputes. No documentation of the merchant's credit promise in any shared system. Ticket is marked resolved upon PA acknowledgment.",

    recommendedChange: "Amend Service Management SOP: For all merchant credit status queries, record the merchant's credit promise in the case log and set a mandatory 10-day auto-follow-up. If the credit has not posted to the account by Day 10, automatically generate a pre-populated dispute packet containing: the original transaction record, merchant contact log, credit promise documentation, and all PA correspondence. Route this to Disputes as a 'Credit Non-Fulfilment — Fast Track' case with the filing clock flagged. Amend Disputes SOP: Accept fast-tracked credit non-fulfilment cases with the pre-built evidence package already attached. Skip standard PA intake interview. File chargeback under Reason Code 4853 (Services Not Rendered / Credit Not Processed) immediately — the 10 days of merchant-side follow-up by Service Management constitutes the required good-faith resolution attempt.",

    impact: "Eliminates the 18-day blind spot between failed credit promise and chargeback initiation. Projected cycle time reduction from 34 days to 14 days on converted cases. Evidence is captured at the point of the credit promise rather than reconstructed weeks later. Estimated recovery acceleration: £420K/year in faster credit recoveries across affected programmes."
  },


  {
    id: "INS-HSBC-002",
    status: "Pending Approval",
    category: "Active Cross-Process",
    direction: "Service Mgmt ↔ Disputes",
    severity: "high",
    title: "Chargebacks on recently-removed approved vendors — Disputes seeing disputes that Service Mgmt caused by processing vendor list changes mid-billing cycle",

    description: "When a Programme Administrator requests removal of a vendor from their programme's approved vendor list through Service Management, the change is applied immediately to the list — but the recurring charges from that vendor (SaaS subscriptions, maintenance contracts, annual licence renewals) continue billing at the merchant's end, because the vendor approval change does not cancel the underlying contractual billing relationship. The PA then disputes these charges through the Disputes process, unaware that the recurring billing was never cancelled at source — only the internal approval tag was removed. Disputes processes these as standard unauthorised transaction claims, which they almost always lose.",

    dataPoints: [
      "214 disputes filed in Q4 2025 on transactions from vendors that had been removed from programme approved lists within the prior 30 days",
      "78% of these were recurring subscription or contract charges that were not cancelled at the merchant level — only the internal vendor approval was removed",
      "Average dispute value in this category: £4,200 — significantly higher than the portfolio average of £1,100, because these are typically annual licence or contract charges",
      "Service Management processed the vendor removal without flagging active recurring charges to the PA in every single one of these 214 cases",
      "Chargeback win rate on this case type: only 38% — because the charges are technically legitimate; the merchant holds a valid billing agreement that was never terminated"
    ],

    currentSOP: "Service Management SOP: Process vendor removal from the programme's approved vendor list upon PA request. Confirm removal to PA by email. No automated check for active recurring charges tied to the vendor across programme cards. No advisory to the PA about potential pending charges. Disputes SOP: Investigate unauthorised transaction claims through the standard pathway. No cross-reference performed against the Service Management vendor list change log before opening a dispute investigation.",

    recommendedChange: "Amend Service Management SOP: Upon any vendor removal request, auto-scan the Auth Platform for active recurring charges from that vendor across all cards in the programme (rolling 60-day window). If active recurring charges are found, surface a mandatory advisory to the PA before confirming the removal: 'This vendor has [X] active recurring charges totalling £[Y]/month on this programme. Removing from the approved list will not cancel these charges. To stop billing, you must also cancel the agreement directly with the vendor or request a block. Would you like us to raise a block request alongside the approval removal?' Amend Disputes SOP: For any unauthorised transaction dispute, auto-cross-reference the vendor against the Service Management vendor list change log for the past 60 days. If the vendor was removed within that window and has active recurring charges, re-route to Service Management for source-level resolution rather than filing a low-probability chargeback. Notify PA that the dispute pathway is unlikely to succeed and that direct vendor cancellation is the correct resolution.",

    impact: "Prevents approximately 167 low-win-rate chargebacks per quarter from being filed on charges the bank cannot recover. Saves PAs from a 3-week dispute process that ends in failure. Estimated cost avoidance: £185K/year in dispute processing costs on cases that were never going to succeed, plus reputational improvement from catching the problem at source before the PA experiences the failed outcome."
  },


  {
    id: "INS-HSBC-003",
    status: "Pending Approval",
    category: "Efficiency — Parallel Intelligence",
    direction: "Disputes → Service Mgmt",
    severity: "high",
    title: "Dispute resolution data reveals which merchants respond to direct outreach vs. which require formal chargebacks — Service Mgmt is escalating cases to Disputes that it could resolve itself in 3 days",

    description: "The Disputes process has accumulated resolution data across hundreds of merchants over time — which merchants issue credits quickly when contacted directly, which ones have documented internal refund portals, which ones stonewall and require a formal Mastercard chargeback to act. This merchant intelligence sits locked inside the Disputes workflow and is never surfaced back to Service Management, which handles all first-touch merchant queries from PAs. As a result, Service Management escalates every unresolved merchant query to Disputes after 7 days by default — including cases involving merchants that Disputes would simply resolve through a direct phone call or email to a known contact, the same step Service Management could have taken at day 2.",

    dataPoints: [
      "Disputes holds resolution data on 1,847 unique merchants transacting across HSBC's commercial card portfolio",
      "312 of those merchants (17%) consistently issue credits within 5 business days when contacted directly using a specific documented pathway — no formal chargeback required",
      "Service Management currently escalates all unresolved merchant queries to Disputes after 7 days regardless of merchant behaviour history or resolution likelihood",
      "For the 312 'fast-response' merchants, 74% of cases escalated to Disputes were resolved through direct merchant contact — the identical step Service Management could have taken at Day 2",
      "Average Disputes cycle time for these 'direct resolution' cases: 12 days. Estimated resolution time if handled at Service Management level: 3 days. Gap: 9 days per case."
    ],

    currentSOP: "Service Management SOP: If a PA's merchant query is unresolved after 7 days, escalate to Disputes as a standard merchant investigation. No merchant behaviour data available to Service Management to inform the resolution approach. Disputes SOP: For all escalated merchant queries, follow the standard investigation pathway regardless of whether the merchant has a documented direct-resolution history. No feedback loop returning merchant intelligence to Service Management.",

    recommendedChange: "Create a shared 'Merchant Intelligence Registry' populated and maintained by Disputes from their resolution data. Tag each merchant with one of three resolution classifications: 'Direct Resolution — High Probability' (credit issued within 5 days via direct contact), 'Formal Chargeback Required' (merchant consistently ignores direct outreach), or 'Contested — Case-by-Case.' Amend Service Management SOP: Before escalating any merchant-related query past Day 2, check the Registry. For merchants tagged 'Direct Resolution — High Probability,' Service Management to attempt direct merchant contact using the documented contact method and resolution pathway from the Registry. Escalate to Disputes only if direct outreach fails after 5 business days, or if the merchant is tagged 'Formal Chargeback Required.' Disputes to update Registry after every case resolution.",

    impact: "Projected deflection of approximately 230 cases per quarter from Disputes back to Service Management for faster, lower-cost resolution. Cycle time reduction from 12 days to 3 days for direct-resolution cases. Frees Disputes team capacity for complex, high-value, contested cases where their expertise is genuinely required. Estimated efficiency gain: £290K/year from faster resolution and reduced Disputes operating cost per case."
  },


  {
    id: "INS-HSBC-004",
    status: "Pending Approval",
    category: "Active Cross-Process",
    direction: "Service Mgmt → Disputes",
    severity: "medium",
    title: "Card replacement requests in Service Mgmt are not cross-checked against Disputes — open disputes on old card numbers are going stale and timing out",

    description: "When a Programme Administrator requests a card replacement through Service Management — whether for a lost card, a compromised card, or routine reissuance — the replacement is processed and the old card number is deactivated. But if there are open chargeback disputes linked to that old card number, nobody in the end-to-end process notifies the Disputes team. The old card number used as the dispute reference becomes inactive. Merchant representment responses can bounce or fail to map. The dispute sits in limbo, appearing active in the system but receiving no meaningful progress, until someone manually catches the card number mismatch — by which point the representment window may have closed entirely.",

    dataPoints: [
      "89 open disputes in Q4 2025 were linked to card numbers that had been replaced via a Service Management request during the active dispute lifecycle",
      "Average delay before the card number mismatch was identified by the Disputes team: 11 days",
      "23 of these 89 disputes (26%) timed out past the Mastercard representment window entirely — resulting in automatic case losses with no recovery",
      "Total value of disputes auto-lost due to card replacement mismatch: £67,400 in Q4 2025 alone",
      "In 100% of these cases, Service Management had no visibility into whether the card being replaced had an open dispute — no such check exists in the current SOP"
    ],

    currentSOP: "Service Management SOP: Process card replacement or reissuance upon PA request. Issue new card number, deactivate old card number. Send confirmation to PA. No automated check against the Disputes system for open cases on the old card number before or after processing the replacement. Disputes SOP: Track all disputes by the card number on file at the time of case creation. No automated alert triggered when the underlying card number linked to an open dispute is deactivated or replaced in another system.",

    recommendedChange: "Amend Service Management SOP: Before processing any card replacement or reissuance, perform an automated cross-check against the Disputes system for open cases on that card number. If open disputes are found, surface a mandatory alert to the Service Manager: 'Card [****XXXX] has [N] open disputes with a combined value of £[Y]. Processing the replacement will change the card reference. Disputes team has been notified and will update all active case records before deactivation.' Disputes SOP: Upon receiving a card number change notification from Service Management, immediately update all active dispute records with the old-to-new card number mapping and notify the merchant/acquirer of the updated reference. Auto-flag any open dispute within 10 days of a representment or filing deadline as 'Priority — Card Change Impact' for immediate review.",

    impact: "Eliminates £67K+ per quarter in disputes auto-lost to card replacement timing gaps. Prevents 23+ cases per quarter from expiring unnoticed. Ensures full dispute continuity through card lifecycle changes. The fix is a two-step automated cross-check — no manual intervention required once implemented."
  },


  {
    id: "INS-HSBC-005",
    status: "Pending Approval",
    category: "Efficiency — Process Redesign",
    direction: "Service Mgmt ↔ Disputes",
    severity: "high",
    title: "FX-related transaction queries in Service Mgmt are the #1 predictor of subsequent FX disputes — but Service Mgmt already holds all the information needed to prevent the dispute entirely",

    description: "Programme Administrators frequently contact Service Management confused about cross-border transaction amounts — the amount billed to the card does not match what the cardholder expected, due to FX conversion rates, Dynamic Currency Conversion (DCC) markups applied at the point of sale, or multi-day settlement FX drift. Service Management currently explains the FX mechanics and closes the ticket. But 34% of these PAs subsequently file a formal dispute on the same transaction, citing 'amount differs from expected' — triggering a full Disputes investigation on a case the bank almost never wins, because the charges are technically correct under card network rules.",

    dataPoints: [
      "621 FX-related service queries raised in Q4 2025 across HSBC commercial card programmes",
      "211 of those PAs (34%) subsequently filed a formal dispute on the same transaction — average gap between service query and dispute filing: 6 days",
      "Top confusion drivers identified: DCC markup not disclosed at point of sale (42% of cases), multi-day settlement FX drift between authorisation and settlement rate (31%), cross-border assessment fees not visible on the original authorisation receipt (27%)",
      "Chargeback win rate on FX amount discrepancy cases: only 28% — because the charges are technically correct per Mastercard scheme rules",
      "Average dispute processing cost per FX discrepancy case: £145 — applied to cases HSBC wins less than 1 in 3 times"
    ],

    currentSOP: "Service Management SOP: For FX-related transaction queries, explain the conversion rate, DCC markup, and settlement process to the PA verbally or by email. Close the ticket upon PA acknowledgment. No structured breakdown document provided. No flag applied to the transaction in any shared system. No advisory to PA about chargeback win probability if they proceed. Disputes SOP: Process FX discrepancy disputes through the standard investigation pathway. No cross-reference with prior FX service queries on the same transaction before accepting the case.",

    recommendedChange: "Amend Service Management SOP: For all FX-related transaction queries, go beyond verbal explanation. Generate and deliver to the PA a structured 'FX Transaction Breakdown Document' covering: original currency amount at the point of sale, conversion rate applied (with source and timestamp), DCC markup percentage if applicable, cross-border assessment fee line item, and a final reconciliation showing exactly how the authorisation amount became the settled amount. Apply a 'FX — Explained & Documented' tag to the transaction in the shared case management system. Amend Disputes SOP: Before accepting any FX discrepancy dispute, perform an automated check for the 'FX — Explained & Documented' tag on the disputed transaction. If the tag exists, route back to Service Management for a second-touch resolution using the breakdown document. Proactively notify the PA that the formal chargeback win probability is under 30% and present the breakdown document as the alternative resolution. Only accept the case as a formal dispute if the PA explicitly requests to proceed after receiving this advisory.",

    impact: "Projected prevention of approximately 140 low-win-rate FX disputes per quarter. Estimated cost avoidance: £81K/year in dispute processing on cases the bank was statistically unlikely to win. PA experience improvement: PA receives a clear, documented explanation upfront rather than discovering the charge is legitimate after a 3-week investigation. Chargeback team freed from processing predictably unsuccessful cases."
  },


  {
    id: "INS-HSBC-006",
    status: "Pending Approval",
    category: "Active Cross-Process",
    direction: "Service Mgmt → Disputes",
    severity: "medium",
    title: "Temporary card suspensions in Service Mgmt create a dispute blind spot — pre-suspension authorisations settling post-suspension are being disputed as unauthorised",

    description: "Programme Administrators occasionally request temporary card suspensions through Service Management — triggered by employee travel policy changes, budget freezes, or suspected internal misuse investigations. The suspension is applied to the card immediately. However, transactions that were authorised before the suspension effective date but have not yet settled continue to settle post-suspension, because settlement follows the authorisation — it cannot be blocked retroactively. These transactions appear on the statement as charges during a 'suspended' period. PAs dispute them as unauthorised. Disputes opens a full investigation. Weeks later, the team concludes the charges are legitimate pre-suspension authorisations — having consumed 16 days of investigator time per case to reach a conclusion that could have been communicated to the PA in 30 seconds at the point of suspension.",

    dataPoints: [
      "147 disputes filed in Q4 2025 on transactions that were authorised before the suspension effective date but settled after it",
      "Chargeback win rate on these cases: 12% — because the merchant holds a valid authorisation code predating the suspension, which is a complete defence under Mastercard rules",
      "Average dispute processing time per case before reaching the 'legitimate pre-suspension authorisation' conclusion: 16 days",
      "In 100% of these cases, Service Management confirmed the suspension without advising the PA about pending settlements that would still post",
      "Total investigator time wasted in Q4 on pre-suspension authorisation disputes: estimated 340 hours across the Disputes team"
    ],

    currentSOP: "Service Management SOP: Process the temporary card suspension immediately upon PA request. Confirm the suspension effective date to the PA. No automated check for in-flight authorisations (authorised but not yet settled) on cards in the programme. No advisory to the PA that some transactions authorised before the suspension date may still settle. Disputes SOP: Investigate all disputes citing 'unauthorised transaction during suspension period' through the standard investigation pathway regardless of whether the transaction predates the suspension.",

    recommendedChange: "Amend Service Management SOP: Upon any temporary suspension request, auto-scan the Auth Platform for pending authorisations (status: authorised, not yet settled) on the cards in scope. If pending authorisations exist, surface this information to the PA before confirming the suspension: 'The following [X] transactions were authorised before the suspension date and will still settle within 2–3 business days. These are legitimate charges and cannot be blocked by the suspension. [Transaction list].' Apply a 'Pre-Suspension Auth — Pending Settlement' tag to each identified transaction in the shared system. Amend Disputes SOP: For any dispute on a transaction flagged during a suspension period, auto-check the authorisation timestamp against the suspension effective date and look for the 'Pre-Suspension Auth' tag. If the authorisation predates the suspension, auto-resolve as 'Pre-Suspension Authorisation — Legitimate' and send the PA a structured explanation with the authorisation timestamp and suspension timeline — without opening a full investigation.",

    impact: "Eliminates approximately 147 unwinnable disputes per quarter. Recovers an estimated 340 investigator hours per quarter for the Disputes team. Prevents the PA experience of receiving a 16-day investigation outcome that tells them what could have been communicated in 30 seconds at the point of the suspension request."
  },


  {
    id: "INS-HSBC-007",
    status: "Pending Approval",
    category: "Efficiency — Pattern Intelligence",
    direction: "Disputes → Service Mgmt",
    severity: "medium",
    title: "Programmes with 3.4x higher early-lifecycle dispute rates correlate with PAs who skipped the onboarding walkthrough — the disputes are billing descriptor confusion, not genuine unauthorised transactions",

    description: "Disputes data reveals that new cardholders on certain programmes generate a dispute rate of 4.8% in their first 90 days on the card — more than three times the portfolio average of 1.4% on programmes where the PA completed a full onboarding walkthrough. Cross-referencing with Service Management records shows that 100% of the high-dispute-rate programmes are led by PAs who declined the optional onboarding walkthrough at the time of programme setup. The walkthrough covers approved merchant categories, spend policies, and — critically — billing descriptor education. The disputes themselves are overwhelmingly 'unrecognised merchant' cases. 82% of those resolve as 'legitimate charge — descriptor confusion.' The bank is processing hundreds of preventable disputes per year because a 15-minute onboarding session was optional and not taken.",

    dataPoints: [
      "New cardholder dispute rate in first 90 days — portfolio average across all programmes: 2.1%",
      "Programmes where PA completed the onboarding walkthrough: 1.4% dispute rate in the first 90 days",
      "Programmes where PA skipped the onboarding walkthrough: 4.8% dispute rate — 3.4x higher than walkthrough-complete programmes",
      "Top dispute categories for early-lifecycle cases: 'unrecognised merchant' (47%), 'amount discrepancy' (28%), 'not authorised by cardholder' (18%)",
      "82% of 'unrecognised merchant' early-lifecycle disputes resolve as 'legitimate charge — billing descriptor did not match the trading name the cardholder recognised'"
    ],

    currentSOP: "Service Management SOP: Offer the onboarding walkthrough to the PA as an optional step during new programme setup. If the PA declines, proceed with standard programme activation. No mandatory follow-up. No notification to Disputes that a new programme has been activated without walkthrough completion. Disputes SOP: Process early-lifecycle disputes through the standard investigation pathway regardless of programme age or whether the PA completed onboarding. No differentiation applied to cases from programmes in their first 90 days.",

    recommendedChange: "Amend Service Management SOP: Make the billing descriptor education module mandatory for all new PA onboardings — structured as a 15-minute session covering the top 20 billing descriptors most commonly appearing on cards in the programme's spend category. For existing high-dispute programmes (identified via this analysis), trigger a 'Programme Health Check' — proactive outreach to the PA offering a tailored refresher walkthrough with programme-specific descriptor mapping based on the actual disputed merchants. Apply a 'Walkthrough Complete' flag to the programme record. Amend Disputes SOP: Flag all disputes from cardholders within their first 90 days on a programme. Before initiating the standard investigation, auto-check whether the disputed transaction matches known descriptor confusion patterns for that programme's merchant categories. If a match is found, route to Service Management for PA education resolution rather than a formal chargeback process — the outcome will be 'legitimate charge' in 82% of cases regardless.",

    impact: "Projected reduction of early-lifecycle dispute rate from 4.8% to approximately 2.0% across affected programmes. Estimated prevention of 310 disputes per year. The cost of prevention is a one-time 15-minute onboarding session. The cost of not preventing is an average £145 dispute investigation on a case that closes as 'legitimate charge.'"
  },


  {
    id: "INS-HSBC-008",
    status: "Pending Approval",
    category: "Active Cross-Process",
    direction: "Service Mgmt ↔ Disputes",
    severity: "high",
    title: "Spend limit increases processed in Service Mgmt — followed by large disputed transactions within 14 days — pattern is consistent with compromised PA credentials, not legitimate limit changes",

    description: "Service Management processes PA requests to increase individual card or programme-level spend limits. In a subset of cases, a limit increase processed through Service Management is followed — within 14 days — by one or more large-value transactions that are subsequently disputed by the PA as unauthorised. Cross-process analysis of these cases reveals a pattern consistent with compromised PA credentials: an attacker with access to the PA's email account requests a limit increase, makes high-value purchases up to the new limit, and the legitimate PA later discovers the charges and disputes them. Service Management is processing these limit changes without secondary authentication. Disputes is investigating the resulting fraud claims without checking whether a limit change preceded the disputed transactions.",

    dataPoints: [
      "34 cases in Q4 2025 where a Service Management limit increase was followed by a disputed high-value transaction on the same programme within 14 days",
      "Average disputed transaction value in these cases: £12,800 — more than 6x the portfolio average transaction value of £1,100",
      "In 27 of the 34 cases (79%), the PA who filed the dispute explicitly stated they did not request or authorise the preceding limit increase",
      "Total disputed value across these 34 cases: £435,200 in Q4 2025 alone",
      "In 100% of these cases, Service Management processed the limit increase based solely on an email from the PA's registered address — no secondary authentication or callback verification was performed"
    ],

    currentSOP: "Service Management SOP: Process limit increase requests received via the PA's registered email address. Send a confirmation email to the same address. Treat email confirmation as sufficient authentication for all limit changes regardless of size. No downstream alert to Disputes, Fraud, or any monitoring function when a limit increase is processed. Disputes SOP: Investigate high-value unauthorised transaction claims through the standard fraud investigation pathway. No automated cross-reference performed against recent Service Management limit modifications on the same programme before opening the investigation.",

    recommendedChange: "Amend Service Management SOP: For all limit increase requests that exceed £5,000 in absolute increase, or that represent more than 50% of the current card or programme limit, require mandatory secondary authentication before processing: either an outbound callback to the PA's registered phone number, or written confirmation from a second named authorised contact on the programme record who is different from the requestor. Upon processing any limit increase (regardless of size), automatically notify the Disputes and Fraud Monitoring teams: 'Limit increase processed on Programme [X] — monitoring window active for 14 days. Flag any high-value transactions for secondary review during this period.' Amend Disputes SOP: Any dispute filed within 14 days of a limit increase on the same programme automatically triggers the fraud investigation pathway rather than the standard chargeback pathway. Cross-check the limit increase request against the PA's communication history for anomalies. Immediately notify Service Management to freeze further limit changes on the programme pending investigation outcome.",

    impact: "Early detection and disruption of compromised PA credential attacks before the full limit is exploited. Projected prevention of £300K+ per year in fraudulent high-value transactions. Secondary authentication adds approximately 30 seconds of friction to legitimate limit change requests — a proportionate control for a process that currently has none."
  }
];

// ─── Pill style helpers ───────────────────────────────────────────────
const getStatusStyle = (status) => {
    if (status === 'Approved') return { background: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0' };
    return { background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' }; // Pending Approval
};

const getSeverityStyle = (severity) => {
    if (severity === 'high') return { background: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca' };
    return { background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' }; // medium
};

const getDirectionStyle = (direction) => {
    if (direction.includes('↔')) return { background: '#e0e7ff', color: '#3730a3', border: '1px solid #c7d2fe' }; // indigo
    if (direction.includes('→') && direction.startsWith('Service')) return { background: '#f3e8ff', color: '#6b21a8', border: '1px solid #e9d5ff' }; // purple
    return { background: '#dbeafe', color: '#1e40af', border: '1px solid #bfdbfe' }; // blue - Disputes → Service Mgmt
};

const getCategoryIcon = (category) => {
    if (category.includes('Cross-Process')) return <Zap size={14} />;
    if (category.includes('Parallel')) return <ArrowLeftRight size={14} />;
    if (category.includes('Redesign')) return <RefreshCw size={14} />;
    if (category.includes('Pattern')) return <TrendingUp size={14} />;
    return <FileText size={14} />;
};

const getDirectionIcon = (direction) => {
    if (direction.includes('↔')) return <ArrowLeftRight size={12} />;
    if (direction.includes('→') && direction.startsWith('Service')) return <ArrowRight size={12} />;
    return <ArrowLeft size={12} />;
};

// ─── InsightCard Component ────────────────────────────────────────────
const InsightCard = ({ insight, onApprove }) => {
    const [expanded, setExpanded] = useState(false);
    const [editing, setEditing] = useState(false);
    const [editData, setEditData] = useState({
        description: insight.description,
        dataPoints: insight.dataPoints.join('\n'),
        currentSOP: insight.currentSOP,
        recommendedChange: insight.recommendedChange,
        impact: insight.impact,
    });

    const isApproved = insight.status === 'Approved';

    const handleSave = () => {
        insight.description = editData.description;
        insight.dataPoints = editData.dataPoints.split('\n').filter(d => d.trim());
        insight.currentSOP = editData.currentSOP;
        insight.recommendedChange = editData.recommendedChange;
        insight.impact = editData.impact;
        setEditing(false);
    };

    const handleCancel = () => {
        setEditData({
            description: insight.description,
            dataPoints: insight.dataPoints.join('\n'),
            currentSOP: insight.currentSOP,
            recommendedChange: insight.recommendedChange,
            impact: insight.impact,
        });
        setEditing(false);
    };

    return (
        <div style={{
            background: '#fff',
            borderRadius: 12,
            border: '1px solid #e5e7eb',
            marginBottom: 16,
            overflow: 'hidden',
            boxShadow: expanded ? '0 4px 12px rgba(0,0,0,0.08)' : '0 1px 3px rgba(0,0,0,0.04)',
            transition: 'box-shadow 0.2s ease',
        }}>
            {/* ── Card Header (always visible) ── */}
            <div
                onClick={() => { if (!editing) setExpanded(!expanded); }}
                style={{
                    padding: '16px 20px',
                    cursor: editing ? 'default' : 'pointer',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 12,
                    userSelect: 'none',
                }}
            >
                <div style={{ marginTop: 2, color: '#6b7280', flexShrink: 0 }}>
                    {expanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Pills row */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8, alignItems: 'center' }}>
                        {/* ID badge */}
                        <span style={{
                            fontFamily: '"SF Mono", "Fira Code", monospace',
                            fontSize: 11,
                            color: '#6b7280',
                            background: '#f3f4f6',
                            padding: '2px 8px',
                            borderRadius: 4,
                            border: '1px solid #e5e7eb',
                        }}>
                            {insight.id}
                        </span>

                        {/* Status pill */}
                        <span style={{
                            fontSize: 11,
                            fontWeight: 600,
                            padding: '2px 10px',
                            borderRadius: 20,
                            ...getStatusStyle(insight.status),
                        }}>
                            {insight.status}
                        </span>

                        {/* Severity pill */}
                        <span style={{
                            fontSize: 11,
                            fontWeight: 600,
                            padding: '2px 10px',
                            borderRadius: 20,
                            textTransform: 'uppercase',
                            ...getSeverityStyle(insight.severity),
                        }}>
                            {insight.severity}
                        </span>

                        {/* Direction pill */}
                        <span style={{
                            fontSize: 11,
                            fontWeight: 500,
                            padding: '2px 10px',
                            borderRadius: 20,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                            ...getDirectionStyle(insight.direction),
                        }}>
                            {getDirectionIcon(insight.direction)}
                            {insight.direction}
                        </span>

                        {/* Category pill */}
                        <span style={{
                            fontSize: 11,
                            fontWeight: 500,
                            padding: '2px 10px',
                            borderRadius: 20,
                            background: '#1f2937',
                            color: '#f9fafb',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                        }}>
                            {getCategoryIcon(insight.category)}
                            {insight.category}
                        </span>
                    </div>

                    {/* Title */}
                    <div style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: '#111827',
                        lineHeight: 1.4,
                    }}>
                        {insight.title}
                    </div>
                </div>
            </div>

            {/* ── Expanded Body ── */}
            {expanded && (
                <div style={{ padding: '0 20px 20px 50px' }}>
                    {/* Description - "What We Found" */}
                    <div style={{ marginBottom: 20 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
                            What We Found
                        </div>
                        {editing ? (
                            <textarea
                                value={editData.description}
                                onChange={e => setEditData({ ...editData, description: e.target.value })}
                                style={{
                                    width: '100%', minHeight: 100, padding: 12, borderRadius: 8,
                                    border: '1px solid #d1d5db', fontSize: 13, lineHeight: 1.6,
                                    fontFamily: 'Inter, sans-serif', resize: 'vertical', color: '#374151',
                                }}
                            />
                        ) : (
                            <div style={{ fontSize: 13, lineHeight: 1.7, color: '#374151' }}>
                                {insight.description}
                            </div>
                        )}
                    </div>

                    {/* Supporting Data */}
                    <div style={{ marginBottom: 20 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
                            Supporting Data
                        </div>
                        {editing ? (
                            <textarea
                                value={editData.dataPoints}
                                onChange={e => setEditData({ ...editData, dataPoints: e.target.value })}
                                placeholder="One data point per line"
                                style={{
                                    width: '100%', minHeight: 140, padding: 12, borderRadius: 8,
                                    border: '1px solid #d1d5db', fontSize: 13, lineHeight: 1.6,
                                    fontFamily: 'Inter, sans-serif', resize: 'vertical', color: '#374151',
                                }}
                            />
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                {insight.dataPoints.map((dp, i) => (
                                    <div key={i} style={{
                                        padding: '8px 12px',
                                        borderLeft: '3px solid #6366f1',
                                        background: '#f5f3ff',
                                        borderRadius: '0 6px 6px 0',
                                        fontSize: 13,
                                        lineHeight: 1.5,
                                        color: '#374151',
                                    }}>
                                        {dp}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* SOP Panels - side by side */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                        {/* Current SOP - red tinted */}
                        <div style={{
                            background: '#fef2f2',
                            border: '1px solid #fecaca',
                            borderRadius: 8,
                            padding: 16,
                        }}>
                            <div style={{ fontSize: 12, fontWeight: 600, color: '#991b1b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                                <X size={14} />
                                Current SOP
                            </div>
                            {editing ? (
                                <textarea
                                    value={editData.currentSOP}
                                    onChange={e => setEditData({ ...editData, currentSOP: e.target.value })}
                                    style={{
                                        width: '100%', minHeight: 120, padding: 10, borderRadius: 6,
                                        border: '1px solid #fecaca', fontSize: 13, lineHeight: 1.6,
                                        fontFamily: 'Inter, sans-serif', resize: 'vertical',
                                        color: '#374151', background: '#fff',
                                    }}
                                />
                            ) : (
                                <div style={{ fontSize: 13, lineHeight: 1.6, color: '#374151' }}>
                                    {insight.currentSOP}
                                </div>
                            )}
                        </div>

                        {/* Recommended Change - green tinted */}
                        <div style={{
                            background: '#f0fdf4',
                            border: '1px solid #bbf7d0',
                            borderRadius: 8,
                            padding: 16,
                        }}>
                            <div style={{ fontSize: 12, fontWeight: 600, color: '#166534', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                                <CheckCircle2 size={14} />
                                Recommended SOP Change
                            </div>
                            {editing ? (
                                <textarea
                                    value={editData.recommendedChange}
                                    onChange={e => setEditData({ ...editData, recommendedChange: e.target.value })}
                                    style={{
                                        width: '100%', minHeight: 120, padding: 10, borderRadius: 6,
                                        border: '1px solid #bbf7d0', fontSize: 13, lineHeight: 1.6,
                                        fontFamily: 'Inter, sans-serif', resize: 'vertical',
                                        color: '#374151', background: '#fff',
                                    }}
                                />
                            ) : (
                                <div style={{ fontSize: 13, lineHeight: 1.6, color: '#374151' }}>
                                    {insight.recommendedChange}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Projected Impact - amber tinted */}
                    <div style={{
                        background: '#fffbeb',
                        border: '1px solid #fde68a',
                        borderRadius: 8,
                        padding: 16,
                        marginBottom: 20,
                    }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: '#92400e', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                            <TrendingUp size={14} />
                            Projected Impact
                        </div>
                        {editing ? (
                            <textarea
                                value={editData.impact}
                                onChange={e => setEditData({ ...editData, impact: e.target.value })}
                                style={{
                                    width: '100%', minHeight: 80, padding: 10, borderRadius: 6,
                                    border: '1px solid #fde68a', fontSize: 13, lineHeight: 1.6,
                                    fontFamily: 'Inter, sans-serif', resize: 'vertical',
                                    color: '#374151', background: '#fff',
                                }}
                            />
                        ) : (
                            <div style={{ fontSize: 13, lineHeight: 1.6, color: '#374151' }}>
                                {insight.impact}
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                        {editing ? (
                            <>
                                <button
                                    onClick={handleCancel}
                                    style={{
                                        display: 'inline-flex', alignItems: 'center', gap: 6,
                                        padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600,
                                        border: '1px solid #d1d5db', background: '#fff', color: '#374151',
                                        cursor: 'pointer',
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    style={{
                                        display: 'inline-flex', alignItems: 'center', gap: 6,
                                        padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600,
                                        border: 'none', background: '#2563eb', color: '#fff',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <Save size={14} />
                                    Save Changes
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => {}}
                                    style={{
                                        display: 'inline-flex', alignItems: 'center', gap: 6,
                                        padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 500,
                                        border: '1px solid #d1d5db', background: '#fff', color: '#6b7280',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <RefreshCw size={14} />
                                    Update
                                </button>
                                <button
                                    onClick={() => !isApproved && setEditing(true)}
                                    disabled={isApproved}
                                    style={{
                                        display: 'inline-flex', alignItems: 'center', gap: 6,
                                        padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600,
                                        border: 'none', background: isApproved ? '#93c5fd' : '#2563eb',
                                        color: '#fff', cursor: isApproved ? 'not-allowed' : 'pointer',
                                        opacity: isApproved ? 0.6 : 1,
                                    }}
                                >
                                    <Edit3 size={14} />
                                    Edit
                                </button>
                                <button
                                    onClick={() => !isApproved && onApprove(insight.id)}
                                    disabled={isApproved}
                                    style={{
                                        display: 'inline-flex', alignItems: 'center', gap: 6,
                                        padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600,
                                        border: 'none', background: isApproved ? '#86efac' : '#16a34a',
                                        color: '#fff', cursor: isApproved ? 'not-allowed' : 'pointer',
                                        opacity: isApproved ? 0.6 : 1,
                                    }}
                                >
                                    <CheckCircle2 size={14} />
                                    {isApproved ? 'Approved' : 'Approve'}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

// ─── Main Insights Page Component ─────────────────────────────────────
const Insights = () => {
    const [insights, setInsights] = useState(INSIGHTS_DATA.map(d => ({ ...d })));
    const [filterSeverity, setFilterSeverity] = useState('all');
    const [filterDirection, setFilterDirection] = useState('all');

    const handleApprove = (id) => {
        setInsights(prev => prev.map(ins =>
            ins.id === id ? { ...ins, status: 'Approved' } : ins
        ));
    };

    const filtered = insights.filter(ins => {
        if (filterSeverity !== 'all' && ins.severity !== filterSeverity) return false;
        if (filterDirection !== 'all') {
            if (filterDirection === 'to-disputes' && !ins.direction.includes('→') && !ins.direction.includes('↔')) return false;
            if (filterDirection === 'to-service' && !ins.direction.includes('←') && !ins.direction.startsWith('Disputes')) return false;
            if (filterDirection === 'bidirectional' && !ins.direction.includes('↔')) return false;
        }
        return true;
    });

    const pendingCount = insights.filter(i => i.status === 'Pending Approval').length;
    const approvedCount = insights.filter(i => i.status === 'Approved').length;
    const highCount = insights.filter(i => i.severity === 'high').length;

    return (
        <div style={{ padding: '24px 0' }}>
            {/* Header */}
            <div style={{ marginBottom: 24 }}>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111827', margin: 0, marginBottom: 4 }}>
                    Cross-Process Insights
                </h2>
                <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>
                    AI-generated insights from patterns detected across Smart Service Management and Dispute Resolution workflows.
                </p>
            </div>

            {/* Stats bar */}
            <div style={{
                display: 'flex', gap: 16, marginBottom: 20, flexWrap: 'wrap',
            }}>
                <div style={{
                    background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8,
                    padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8,
                }}>
                    <AlertTriangle size={16} style={{ color: '#dc2626' }} />
                    <span style={{ fontSize: 13, color: '#374151' }}>
                        <strong>{highCount}</strong> High Severity
                    </span>
                </div>
                <div style={{
                    background: '#fef3c7', border: '1px solid #fde68a', borderRadius: 8,
                    padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8,
                }}>
                    <span style={{ fontSize: 13, color: '#92400e' }}>
                        <strong>{pendingCount}</strong> Pending Approval
                    </span>
                </div>
                <div style={{
                    background: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: 8,
                    padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8,
                }}>
                    <CheckCircle2 size={16} style={{ color: '#16a34a' }} />
                    <span style={{ fontSize: 13, color: '#166534' }}>
                        <strong>{approvedCount}</strong> Approved
                    </span>
                </div>
            </div>

            {/* Filter bar */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Filters:</span>
                <select
                    value={filterSeverity}
                    onChange={e => setFilterSeverity(e.target.value)}
                    style={{
                        padding: '6px 12px', borderRadius: 6, border: '1px solid #d1d5db',
                        fontSize: 13, color: '#374151', background: '#fff', cursor: 'pointer',
                    }}
                >
                    <option value="all">All Severities</option>
                    <option value="high">High Only</option>
                    <option value="medium">Medium Only</option>
                </select>
                <select
                    value={filterDirection}
                    onChange={e => setFilterDirection(e.target.value)}
                    style={{
                        padding: '6px 12px', borderRadius: 6, border: '1px solid #d1d5db',
                        fontSize: 13, color: '#374151', background: '#fff', cursor: 'pointer',
                    }}
                >
                    <option value="all">All Directions</option>
                    <option value="to-disputes">Service Mgmt to Disputes</option>
                    <option value="to-service">Disputes to Service Mgmt</option>
                    <option value="bidirectional">Bidirectional</option>
                </select>
            </div>

            {/* Insight Cards */}
            <div>
                {filtered.map(insight => (
                    <InsightCard
                        key={insight.id}
                        insight={insight}
                        onApprove={handleApprove}
                    />
                ))}
                {filtered.length === 0 && (
                    <div style={{
                        textAlign: 'center', padding: 40, color: '#9ca3af', fontSize: 14,
                    }}>
                        No insights match the current filters.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Insights;
