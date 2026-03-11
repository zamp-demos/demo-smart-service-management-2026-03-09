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
    Filter,
    Briefcase,
    Shield,
} from 'lucide-react';

const INSIGHTS_DATA = [
    {
      id: "INS-HSBC-001",
      status: "Pending Approval",
      scope: "cross-process",
      category: "Active Cross-Process",
      direction: "Service Mgmt → Disputes",
      severity: "high",
      title: `PAs requesting merchant credit status updates in Service Mgmt — credits never posting, converting to chargebacks 18 days later`,
      description: `Service Management is fielding ‘where is my refund?’ queries from Programme Administrators who were told by the merchant that a credit is being processed. In 41% of these cases, that credit never posts to the card account. The same transaction then surfaces as a formal chargeback 2–3 weeks later — with the PA required to restart the entire evidence-gathering process from scratch, having lost valuable days in the filing window and having no record of their prior merchant contact documented in the disputes system.`,
      dataPoints: [
        `387 ‘merchant credit status’ service queries raised in Q4 2025 across HSBC commercial card programmes`,
        `159 of those (41%) resulted in a formal chargeback filing within 18 days of the original service query`,
        `In 92% of those 159 converted cases, the PA had been explicitly told by the Service Management team that the credit was ‘in progress’ — creating a false sense of resolution`,
        `Average chargeback cycle time for these converted cases: 34 days — vs. 22 days for standard chargebacks filed without prior service query`,
        `Top offending merchants: 3 SaaS vendors and 2 travel management companies with documented slow-refund processes — accounting for 67% of all converted cases`,
        `Filing window consumed at point of chargeback initiation: average 26 days already elapsed — leaving 94 days of the 120-day window remaining`,
      ],
      currentSOP: `Service Management SOP: When a PA inquires about a pending merchant credit, check the transaction status in the Auth Platform. If credit shows as ‘processing’ or ‘pending,’ inform the PA and close the ticket. No auto-follow-up trigger. No escalation path to Disputes. No documentation of the merchant’s credit promise in any shared system. Ticket is marked resolved upon PA acknowledgment.`,
      recommendedChange: `Amend Service Management SOP: For all merchant credit status queries, record the merchant’s credit promise in the case log and set a mandatory 10-day auto-follow-up. If the credit has not posted to the account by Day 10, automatically generate a pre-populated dispute packet containing: the original transaction record, merchant contact log, credit promise documentation, and all PA correspondence. Route this to Disputes as a ‘Credit Non-Fulfilment — Fast Track’ case with the filing clock flagged. Amend Disputes SOP: Accept fast-tracked credit non-fulfilment cases with the pre-built evidence package already attached. Skip standard PA intake interview. File chargeback under Reason Code 4853 (Services Not Rendered / Credit Not Processed) immediately — the 10 days of merchant-side follow-up by Service Management constitutes the required good-faith resolution attempt.`,
      impact: `Eliminates the 18-day blind spot between failed credit promise and chargeback initiation. Projected cycle time reduction from 34 days to 14 days on converted cases. Evidence is captured at the point of the credit promise rather than reconstructed weeks later. Estimated recovery acceleration: £420K/year in faster credit recoveries across affected programmes.`
    },

    {
      id: "INS-HSBC-002",
      status: "Pending Approval",
      scope: "cross-process",
      category: "Active Cross-Process",
      direction: "Service Mgmt ↔ Disputes",
      severity: "high",
      title: `Chargebacks on recently-removed approved vendors — Disputes seeing disputes that Service Mgmt caused by processing vendor list changes mid-billing cycle`,
      description: `When a Programme Administrator requests removal of a vendor from their programme’s approved vendor list through Service Management, the change is applied immediately to the list — but the recurring charges from that vendor (SaaS subscriptions, maintenance contracts, annual licence renewals) continue billing at the merchant’s end, because the vendor approval change does not cancel the underlying contractual billing relationship. The PA then disputes these charges through the Disputes process, unaware that the recurring billing was never cancelled at source — only the internal approval tag was removed. Disputes processes these as standard unauthorised transaction claims, which they almost always lose.`,
      dataPoints: [
        `214 disputes filed in Q4 2025 on transactions from vendors that had been removed from programme approved lists within the prior 30 days`,
        `78% of these were recurring subscription or contract charges that were not cancelled at the merchant level — only the internal vendor approval was removed`,
        `Average dispute value in this category: £4,200 — significantly higher than the portfolio average of £1,100, because these are typically annual licence or contract charges`,
        `Service Management processed the vendor removal without flagging active recurring charges to the PA in every single one of these 214 cases`,
        `Chargeback win rate on this case type: only 38% — because the charges are technically legitimate; the merchant holds a valid billing agreement that was never terminated`,
      ],
      currentSOP: `Service Management SOP: Process vendor removal from the programme’s approved vendor list upon PA request. Confirm removal to PA by email. No automated check for active recurring charges tied to the vendor across programme cards. No advisory to the PA about potential pending charges. Disputes SOP: Investigate unauthorised transaction claims through the standard pathway. No cross-reference performed against the Service Management vendor list change log before opening a dispute investigation.`,
      recommendedChange: `Amend Service Management SOP: Upon any vendor removal request, auto-scan the Auth Platform for active recurring charges from that vendor across all cards in the programme (rolling 60-day window). If active recurring charges are found, surface a mandatory advisory to the PA before confirming the removal. Amend Disputes SOP: For any unauthorised transaction dispute, auto-cross-reference the vendor against the Service Management vendor list change log for the past 60 days. If the vendor was removed within that window and has active recurring charges, re-route to Service Management for source-level resolution rather than filing a low-probability chargeback.`,
      impact: `Prevents approximately 167 low-win-rate chargebacks per quarter from being filed on charges the bank cannot recover. Saves PAs from a 3-week dispute process that ends in failure. Estimated cost avoidance: £185K/year in dispute processing costs on cases that were never going to succeed, plus reputational improvement from catching the problem at source before the PA experiences the failed outcome.`
    },

    {
      id: "INS-HSBC-003",
      status: "Pending Approval",
      scope: "cross-process",
      category: "Efficiency — Parallel Intelligence",
      direction: "Disputes → Service Mgmt",
      severity: "high",
      title: `Dispute resolution data reveals which merchants respond to direct outreach vs. which require formal chargebacks — Service Mgmt is escalating cases to Disputes that it could resolve itself in 3 days`,
      description: `The Disputes process has accumulated resolution data across hundreds of merchants over time — which merchants issue credits quickly when contacted directly, which ones have documented internal refund portals, which ones stonewall and require a formal Mastercard chargeback to act. This merchant intelligence sits locked inside the Disputes workflow and is never surfaced back to Service Management. As a result, Service Management escalates every unresolved merchant query to Disputes after 7 days by default — including cases involving merchants that Disputes would simply resolve through a direct phone call or email to a known contact.`,
      dataPoints: [
        `Disputes holds resolution data on 1,847 unique merchants transacting across HSBC’s commercial card portfolio`,
        `312 of those merchants (17%) consistently issue credits within 5 business days when contacted directly using a specific documented pathway — no formal chargeback required`,
        `Service Management currently escalates all unresolved merchant queries to Disputes after 7 days regardless of merchant behaviour history or resolution likelihood`,
        `For the 312 ‘fast-response’ merchants, 74% of cases escalated to Disputes were resolved through direct merchant contact — the identical step Service Management could have taken at Day 2`,
        `Average Disputes cycle time for these ‘direct resolution’ cases: 12 days. Estimated resolution time if handled at Service Management level: 3 days. Gap: 9 days per case.`,
      ],
      currentSOP: `Service Management SOP: If a PA’s merchant query is unresolved after 7 days, escalate to Disputes as a standard merchant investigation. No merchant behaviour data available to Service Management to inform the resolution approach. Disputes SOP: For all escalated merchant queries, follow the standard investigation pathway regardless of whether the merchant has a documented direct-resolution history. No feedback loop returning merchant intelligence to Service Management.`,
      recommendedChange: `Create a shared ‘Merchant Intelligence Registry’ populated and maintained by Disputes from their resolution data. Tag each merchant with one of three resolution classifications. Amend Service Management SOP: Before escalating any merchant-related query past Day 2, check the Registry. For merchants tagged ‘Direct Resolution — High Probability,’ Service Management to attempt direct merchant contact. Escalate to Disputes only if direct outreach fails after 5 business days, or if the merchant is tagged ‘Formal Chargeback Required.’ Disputes to update Registry after every case resolution.`,
      impact: `Projected deflection of approximately 230 cases per quarter from Disputes back to Service Management for faster, lower-cost resolution. Cycle time reduction from 12 days to 3 days for direct-resolution cases. Frees Disputes team capacity for complex, high-value, contested cases where their expertise is genuinely required. Estimated efficiency gain: £290K/year from faster resolution and reduced Disputes operating cost per case.`
    },

    {
      id: "INS-HSBC-004",
      status: "Pending Approval",
      scope: "cross-process",
      category: "Active Cross-Process",
      direction: "Service Mgmt → Disputes",
      severity: "medium",
      title: `Card replacement requests in Service Mgmt are not cross-checked against Disputes — open disputes on old card numbers are going stale and timing out`,
      description: `When a Programme Administrator requests a card replacement through Service Management — whether for a lost card, a compromised card, or routine reissuance — the replacement is processed and the old card number is deactivated. But if there are open chargeback disputes linked to that old card number, nobody in the end-to-end process notifies the Disputes team. The old card number used as the dispute reference becomes inactive. Merchant representment responses can bounce or fail to map. The dispute sits in limbo until someone manually catches the card number mismatch.`,
      dataPoints: [
        `89 open disputes in Q4 2025 were linked to card numbers that had been replaced via a Service Management request during the active dispute lifecycle`,
        `Average delay before the card number mismatch was identified by the Disputes team: 11 days`,
        `23 of these 89 disputes (26%) timed out past the Mastercard representment window entirely — resulting in automatic case losses with no recovery`,
        `Total value of disputes auto-lost due to card replacement mismatch: £67,400 in Q4 2025 alone`,
        `In 100% of these cases, Service Management had no visibility into whether the card being replaced had an open dispute — no such check exists in the current SOP`,
      ],
      currentSOP: `Service Management SOP: Process card replacement or reissuance upon PA request. Issue new card number, deactivate old card number. Send confirmation to PA. No automated check against the Disputes system for open cases on the old card number before or after processing the replacement. Disputes SOP: Track all disputes by the card number on file at the time of case creation. No automated alert triggered when the underlying card number linked to an open dispute is deactivated or replaced in another system.`,
      recommendedChange: `Amend Service Management SOP: Before processing any card replacement or reissuance, perform an automated cross-check against the Disputes system for open cases on that card number. If open disputes are found, surface a mandatory alert to the Service Manager. Disputes SOP: Upon receiving a card number change notification from Service Management, immediately update all active dispute records with the old-to-new card number mapping and notify the merchant/acquirer of the updated reference.`,
      impact: `Eliminates £67K+ per quarter in disputes auto-lost to card replacement timing gaps. Prevents 23+ cases per quarter from expiring unnoticed. Ensures full dispute continuity through card lifecycle changes. The fix is a two-step automated cross-check — no manual intervention required once implemented.`
    },

    {
      id: "INS-HSBC-005",
      status: "Pending Approval",
      scope: "cross-process",
      category: "Efficiency — Process Redesign",
      direction: "Service Mgmt ↔ Disputes",
      severity: "high",
      title: `FX-related transaction queries in Service Mgmt are the #1 predictor of subsequent FX disputes — but Service Mgmt already holds all the information needed to prevent the dispute entirely`,
      description: `Programme Administrators frequently contact Service Management confused about cross-border transaction amounts — the amount billed to the card does not match what the cardholder expected, due to FX conversion rates, Dynamic Currency Conversion (DCC) markups applied at the point of sale, or multi-day settlement FX drift. Service Management currently explains the FX mechanics and closes the ticket. But 34% of these PAs subsequently file a formal dispute on the same transaction, citing ‘amount differs from expected’ — triggering a full Disputes investigation on a case the bank almost never wins.`,
      dataPoints: [
        `621 FX-related service queries raised in Q4 2025 across HSBC commercial card programmes`,
        `211 of those PAs (34%) subsequently filed a formal dispute on the same transaction — average gap between service query and dispute filing: 6 days`,
        `Top confusion drivers identified: DCC markup not disclosed at point of sale (42%), multi-day settlement FX drift (31%), cross-border assessment fees not visible on the original authorisation receipt (27%)`,
        `Chargeback win rate on FX amount discrepancy cases: only 28% — because the charges are technically correct per Mastercard scheme rules`,
        `Average dispute processing cost per FX discrepancy case: £145 — applied to cases HSBC wins less than 1 in 3 times`,
      ],
      currentSOP: `Service Management SOP: For FX-related transaction queries, explain the conversion rate, DCC markup, and settlement process to the PA verbally or by email. Close the ticket upon PA acknowledgment. No structured breakdown document provided. No flag applied to the transaction in any shared system. Disputes SOP: Process FX discrepancy disputes through the standard investigation pathway. No cross-reference with prior FX service queries on the same transaction before accepting the case.`,
      recommendedChange: `Amend Service Management SOP: For all FX-related transaction queries, generate and deliver to the PA a structured ‘FX Transaction Breakdown Document’ covering all conversion details. Apply a ‘FX — Explained & Documented’ tag to the transaction. Amend Disputes SOP: Before accepting any FX discrepancy dispute, check for the ‘FX — Explained & Documented’ tag. If present, route back to Service Management for a second-touch resolution. Proactively notify the PA that the formal chargeback win probability is under 30%.`,
      impact: `Projected prevention of approximately 140 low-win-rate FX disputes per quarter. Estimated cost avoidance: £81K/year in dispute processing on cases the bank was statistically unlikely to win. PA experience improvement: PA receives a clear, documented explanation upfront rather than discovering the charge is legitimate after a 3-week investigation.`
    },

    {
      id: "INS-HSBC-006",
      status: "Pending Approval",
      scope: "cross-process",
      category: "Active Cross-Process",
      direction: "Service Mgmt → Disputes",
      severity: "medium",
      title: `Temporary card suspensions in Service Mgmt create a dispute blind spot — pre-suspension authorisations settling post-suspension are being disputed as unauthorised`,
      description: `Programme Administrators occasionally request temporary card suspensions through Service Management. However, transactions that were authorised before the suspension effective date but have not yet settled continue to settle post-suspension. These transactions appear on the statement as charges during a ‘suspended’ period. PAs dispute them as unauthorised. Disputes opens a full investigation. Weeks later, the team concludes the charges are legitimate pre-suspension authorisations — having consumed 16 days of investigator time per case to reach a conclusion that could have been communicated to the PA in 30 seconds at the point of suspension.`,
      dataPoints: [
        `147 disputes filed in Q4 2025 on transactions that were authorised before the suspension effective date but settled after it`,
        `Chargeback win rate on these cases: 12% — because the merchant holds a valid authorisation code predating the suspension`,
        `Average dispute processing time per case before reaching the ‘legitimate pre-suspension authorisation’ conclusion: 16 days`,
        `In 100% of these cases, Service Management confirmed the suspension without advising the PA about pending settlements that would still post`,
        `Total investigator time wasted in Q4 on pre-suspension authorisation disputes: estimated 340 hours across the Disputes team`,
      ],
      currentSOP: `Service Management SOP: Process the temporary card suspension immediately upon PA request. Confirm the suspension effective date to the PA. No automated check for in-flight authorisations on cards in the programme. No advisory to the PA that some transactions authorised before the suspension date may still settle. Disputes SOP: Investigate all disputes citing ‘unauthorised transaction during suspension period’ through the standard investigation pathway.`,
      recommendedChange: `Amend Service Management SOP: Upon any temporary suspension request, auto-scan the Auth Platform for pending authorisations on the cards in scope. If pending authorisations exist, surface this information to the PA before confirming the suspension. Apply a ‘Pre-Suspension Auth — Pending Settlement’ tag to each identified transaction. Amend Disputes SOP: For any dispute on a transaction flagged during a suspension period, auto-check the authorisation timestamp against the suspension effective date. If the authorisation predates the suspension, auto-resolve as ‘Pre-Suspension Authorisation — Legitimate’.`,
      impact: `Eliminates approximately 147 unwinnable disputes per quarter. Recovers an estimated 340 investigator hours per quarter for the Disputes team. Prevents the PA experience of receiving a 16-day investigation outcome that tells them what could have been communicated in 30 seconds at the point of the suspension request.`
    },

    {
      id: "INS-HSBC-007",
      status: "Pending Approval",
      scope: "cross-process",
      category: "Efficiency — Pattern Intelligence",
      direction: "Disputes → Service Mgmt",
      severity: "medium",
      title: `Programmes with 3.4x higher early-lifecycle dispute rates correlate with PAs who skipped the onboarding walkthrough — the disputes are billing descriptor confusion, not genuine unauthorised transactions`,
      description: `Disputes data reveals that new cardholders on certain programmes generate a dispute rate of 4.8% in their first 90 days on the card — more than three times the portfolio average of 1.4% on programmes where the PA completed a full onboarding walkthrough. The disputes themselves are overwhelmingly ‘unrecognised merchant’ cases. 82% of those resolve as ‘legitimate charge — descriptor confusion.’ The bank is processing hundreds of preventable disputes per year because a 15-minute onboarding session was optional and not taken.`,
      dataPoints: [
        `New cardholder dispute rate in first 90 days — portfolio average across all programmes: 2.1%`,
        `Programmes where PA completed the onboarding walkthrough: 1.4% dispute rate in the first 90 days`,
        `Programmes where PA skipped the onboarding walkthrough: 4.8% dispute rate — 3.4x higher`,
        `Top dispute categories for early-lifecycle cases: ‘unrecognised merchant’ (47%), ‘amount discrepancy’ (28%), ‘not authorised by cardholder’ (18%)`,
        `82% of ‘unrecognised merchant’ early-lifecycle disputes resolve as ‘legitimate charge — billing descriptor did not match the trading name the cardholder recognised’`,
      ],
      currentSOP: `Service Management SOP: Offer the onboarding walkthrough to the PA as an optional step during new programme setup. If the PA declines, proceed with standard programme activation. No mandatory follow-up. Disputes SOP: Process early-lifecycle disputes through the standard investigation pathway regardless of programme age or whether the PA completed onboarding.`,
      recommendedChange: `Amend Service Management SOP: Make the billing descriptor education module mandatory for all new PA onboardings. For existing high-dispute programmes, trigger a ‘Programme Health Check’ — proactive outreach to the PA. Amend Disputes SOP: Flag all disputes from cardholders within their first 90 days on a programme. Before initiating the standard investigation, auto-check whether the disputed transaction matches known descriptor confusion patterns. If a match is found, route to Service Management for PA education resolution.`,
      impact: `Projected reduction of early-lifecycle dispute rate from 4.8% to approximately 2.0% across affected programmes. Estimated prevention of 310 disputes per year. The cost of prevention is a one-time 15-minute onboarding session. The cost of not preventing is an average £145 dispute investigation on a case that closes as ‘legitimate charge.’`
    },

    {
      id: "INS-HSBC-008",
      status: "Pending Approval",
      scope: "cross-process",
      category: "Active Cross-Process",
      direction: "Service Mgmt ↔ Disputes",
      severity: "high",
      title: `Spend limit increases processed in Service Mgmt — followed by large disputed transactions within 14 days — pattern is consistent with compromised PA credentials, not legitimate limit changes`,
      description: `Service Management processes PA requests to increase individual card or programme-level spend limits. In a subset of cases, a limit increase is followed — within 14 days — by one or more large-value transactions that are subsequently disputed by the PA as unauthorised. Cross-process analysis reveals a pattern consistent with compromised PA credentials: an attacker with access to the PA’s email account requests a limit increase, makes high-value purchases up to the new limit, and the legitimate PA later discovers the charges and disputes them.`,
      dataPoints: [
        `34 cases in Q4 2025 where a Service Management limit increase was followed by a disputed high-value transaction on the same programme within 14 days`,
        `Average disputed transaction value in these cases: £12,800 — more than 6x the portfolio average transaction value of £1,100`,
        `In 27 of the 34 cases (79%), the PA who filed the dispute explicitly stated they did not request or authorise the preceding limit increase`,
        `Total disputed value across these 34 cases: £435,200 in Q4 2025 alone`,
        `In 100% of these cases, Service Management processed the limit increase based solely on an email from the PA’s registered address — no secondary authentication or callback verification was performed`,
      ],
      currentSOP: `Service Management SOP: Process limit increase requests received via the PA’s registered email address. Send a confirmation email to the same address. Treat email confirmation as sufficient authentication for all limit changes regardless of size. No downstream alert to Disputes, Fraud, or any monitoring function. Disputes SOP: Investigate high-value unauthorised transaction claims through the standard fraud investigation pathway. No automated cross-reference performed against recent Service Management limit modifications.`,
      recommendedChange: `Amend Service Management SOP: For all limit increase requests that exceed £5,000 in absolute increase, or that represent more than 50% of the current limit, require mandatory secondary authentication before processing. Upon processing any limit increase, automatically notify the Disputes and Fraud Monitoring teams with a 14-day monitoring window. Amend Disputes SOP: Any dispute filed within 14 days of a limit increase on the same programme automatically triggers the fraud investigation pathway. Cross-check the limit increase request against the PA’s communication history for anomalies.`,
      impact: `Early detection and disruption of compromised PA credential attacks before the full limit is exploited. Projected prevention of £300K+ per year in fraudulent high-value transactions. Secondary authentication adds approximately 30 seconds of friction to legitimate limit change requests — a proportionate control for a process that currently has none.`
    },

    {
      id: "INS-SM-001",
      status: "Pending Approval",
      scope: "ssm",
      process: "Service Management",
      category: "Case Resolution — SLA Leakage",
      severity: "high",
      title: `38% of Service Management cases breach SLA not due to complexity — but because they sit unassigned for an average of 4.2 hours after creation before any SM picks them up`,
      description: `Analysis of Service Management case lifecycle timestamps reveals that the single biggest driver of SLA breaches is not investigation complexity or PA response delays — it is queue lag at the point of case creation. Cases sit in the unassigned pool for an average of 4.2 hours before an SM claims them. For high-severity cases (limit increase requests, fraud-adjacent queries, account block requests), this lag is running at 6.1 hours average. By the time an SM begins work, the effective SLA clock has already consumed a disproportionate share of the available window — leaving insufficient time for cases that require any back-and-forth with the PA.`,
      dataPoints: [
        `38% of SLA breaches in Q4 2025 occurred on cases where the total investigation and resolution time was within SLA — the breach was caused entirely by initial queue lag`,
        `Average time from case creation to first SM assignment: 4.2 hours across all case types`,
        `For high-severity case types (limit increases, block requests, fraud queries): average assignment lag is 6.1 hours`,
        `Peak unassigned queue depth occurs between 13:00–15:00 GMT Monday to Wednesday — accounting for 61% of all assignment lag breaches`,
        `Cases created after 15:30 GMT with a same-day SLA target breach that SLA at a rate of 74% — vs. 19% breach rate for cases created before 11:00 GMT`,
        `SM team capacity data shows no actual under-staffing during these windows — active SMs have available bandwidth but the triage and assignment process is entirely manual`,
      ],
      currentSOP: `Service Management SOP: Cases enter the shared queue upon creation. SMs are expected to self-select cases from the queue based on their current workload. No automated assignment. No priority flagging at the queue level. No alert triggered when a case has been unassigned for more than a defined threshold. Team lead performs a manual queue review once per day at 09:00 GMT.`,
      recommendedChange: `Implement automated case assignment with priority-weighted routing. Upon case creation, Pace to auto-classify the case by type and severity using the inbound email content and CRM data, then assign directly to the SM with the most relevant case history for that client or case type. For high-severity case types, trigger an immediate assignment alert to the on-shift lead if no SM claims the case within 20 minutes. Add a real-time queue depth dashboard visible to all SMs showing unassigned case age — cases older than 90 minutes should auto-escalate to the team lead. Eliminate the manual 09:00 queue review in favour of continuous automated monitoring.`,
      impact: `Projected elimination of queue-lag-driven SLA breaches — estimated reduction in total SLA breach rate from 38% to under 12%. Average time-to-first-action reduced from 4.2 hours to under 30 minutes. No additional headcount required — this is a routing and visibility fix, not a capacity problem.`
    },

    {
      id: "INS-SM-002",
      status: "Pending Approval",
      scope: "ssm",
      process: "Service Management",
      category: "Knowledge Base — Coverage Gap",
      severity: "medium",
      title: `SMs are spending an average of 23 minutes per case searching for policy answers that exist in the knowledge base but are unretrievable by the terms PAs actually use`,
      description: `Service Management maintains a knowledge base of policy documents, SOP references, and resolution guides. Investigation of case handling logs shows that SMs regularly open 4–7 documents before finding the answer they need, or escalate to a team lead for a policy clarification that is already documented. The root cause is not missing knowledge — it is a terminology mismatch between how policies are indexed (using internal HSBC taxonomy) and how PAs describe their problems in inbound emails (using plain-language merchant names, card types, and colloquial descriptions). An SM searching for ‘contactless limit’ finds nothing; the document is indexed under ‘Proximity Payment Authorisation Threshold.’ The knowledge exists. It simply cannot be found in the time available.`,
      dataPoints: [
        `Average time spent on knowledge base searches per case: 23 minutes — representing 31% of total average case handling time of 74 minutes`,
        `Average number of documents opened before the correct policy answer is located: 4.7 per case`,
        `Top 10 unresolved search queries in Q4 2025: all 10 had a corresponding policy document — none were surfaced by the SM’s search terms`,
        `Cases escalated to team lead for policy clarification in Q4 2025: 847 — of which 91% were resolved by the team lead citing an existing document the SM could not locate`,
        `SM survey (Q4 2025, n=34): 78% rated ‘finding the right policy quickly’ as their biggest daily friction point — ranked above PA communication delays and system access issues`,
        `Policy documents added to the knowledge base in the past 12 months: 214 — of which only 31% have synonym tags or plain-language aliases applied`,
      ],
      currentSOP: `Service Management SOP: SMs search the knowledge base using the internal search tool. Documents are indexed by their formal policy title and section number. No synonym library. No plain-language alias mapping. No ‘related queries’ surfacing. SMs are expected to learn the internal taxonomy over time. New SMs receive a 2-hour knowledge base orientation session at onboarding. No structured mechanism for SMs to flag when a document was hard to find.`,
      recommendedChange: `Implement a semantic search layer over the knowledge base that matches SM queries to documents based on meaning rather than exact title match — including plain-language aliases, common merchant names, and PA-phrasing variants as indexed terms. For the 214 documents added in the last 12 months, retroactively apply synonym tags based on the top unresolved search queries from the case logs. Add a ‘Was this easy to find?’ micro-feedback prompt after each knowledge base retrieval — feed negative responses into an automatic alias improvement queue. Separately, surface 3 contextually relevant KB articles at case creation based on the inbound email content — before the SM has to search at all.`,
      impact: `Projected reduction in per-case knowledge search time from 23 minutes to under 5 minutes. Reduction in team lead escalations for policy clarification from 847/quarter to under 100/quarter. Cumulative SM time recovered: estimated 1,800 hours per quarter across the team — equivalent to roughly 3 FTE hours redirected to actual case resolution.`
    },

    {
      id: "INS-SM-003",
      status: "Pending Approval",
      scope: "ssm",
      process: "Service Management",
      category: "PA Behaviour — Repeat Contact Pattern",
      severity: "medium",
      title: `14% of programme administrators account for 51% of all inbound Service Management volume — and their repeat contact rate drops 70% in the 30 days after a proactive programme health call`,
      description: `Service Management inbound volume is heavily concentrated in a small segment of Programme Administrators. Analysis of Q4 2025 contact data shows that 14% of active PAs generated 51% of all inbound service queries. These high-contact PAs are not associated with larger or more complex programmes — they are distributed across programme sizes and industries. However, they share a behavioural profile: they contact HSBC reactively for every individual transaction query rather than using the self-service tools available to them, and their queries are disproportionately answerable via the MiVision portal or the PA online guide without SM involvement. Critically, when an SM proactively calls one of these PAs to walk through the tools and answer open questions, their contact rate drops by 70% in the subsequent 30 days.`,
      dataPoints: [
        `Total active Programme Administrators across HSBC commercial card portfolio in Q4 2025: 1,247`,
        `PAs in the top-contact segment (14% of PAs): 175 individuals — generating 51% of all inbound SM volume in Q4`,
        `Average inbound contacts per month for high-contact PA: 11.4 — vs. portfolio average of 1.8`,
        `Top query types from high-contact PAs: transaction status (34%), MiVision navigation help (28%), limit and balance queries (21%) — all self-serviceable via existing tools`,
        `SMs who proactively called a high-contact PA and delivered a 20-minute MiVision walkthrough: 31 PAs in Q4 as part of a pilot`,
        `Contact rate reduction in the 30 days following a proactive call: 70% average — sustained at 58% reduction through 90 days post-call`,
      ],
      currentSOP: `Service Management SOP: Handle all inbound PA contacts reactively. Answer the query and close the case. No structured identification of high-contact PAs. No proactive outreach programme. No mechanism for SMs to flag a PA for a tool education call. Team leads review aggregate volume statistics monthly but take no action on individual PA contact patterns.`,
      recommendedChange: `Implement a ‘High-Contact PA’ flag that auto-applies when a PA’s monthly contact rate exceeds 8 — surfaced on the case header so the handling SM sees it immediately. For all flagged PAs, add a mandatory case note field: ‘Was this query self-serviceable via MiVision or the PA guide?’ If yes, the SM resolves the query and simultaneously schedules a proactive 20-minute MiVision capability call within 5 business days — not as an add-on, as part of the case closure action. Designate 2 SMs per quarter to own the proactive call pipeline for high-contact PAs, targeting all 175 flagged PAs in a rolling programme. Track contact rate pre- and post-call to measure tool adoption.`,
      impact: `If the 70% contact rate reduction from the Q4 pilot is replicated across all 175 high-contact PAs, projected inbound SM volume reduction: 3,200 cases per quarter — a 22% reduction in total SM caseload. Volume reduction achieved through a 20-minute proactive call investment per PA rather than additional headcount.`
    },

    {
      id: "INS-SM-004",
      status: "Pending Approval",
      scope: "ssm",
      process: "Service Management",
      category: "PA Communication — Response Gap",
      severity: "high",
      title: `Average PA response time to SM information requests is 3.7 business days — but 68% of PAs respond within 4 hours when the request arrives between 09:00–11:00 on a Tuesday or Wednesday`,
      description: `Service Management cases frequently stall while waiting for the Programme Administrator to respond with information needed to progress the case — documents, approvals, clarifications. The average PA response time is 3.7 business days, which is the single largest contributor to total case cycle time. However, response time analysis reveals an extreme pattern: PAs who receive the SM’s information request between 09:00–11:00 on Tuesday or Wednesday respond within 4 hours at a rate of 68%. Requests sent after 14:00 on any day, or on Monday or Friday, see response rates within 4 hours drop to 11%. The timing of the SM’s outbound request — not the complexity of the information requested — is the dominant factor in PA response speed.`,
      dataPoints: [
        `Average PA response time to SM information requests across all cases in Q4 2025: 3.7 business days`,
        `PA response within 4 hours when request sent 09:00–11:00 Tuesday/Wednesday: 68%`,
        `PA response within 4 hours when request sent after 14:00 any day: 11%`,
        `PA response within 4 hours when request sent on Monday or Friday: 14%`,
        `Correlation between request complexity and response time: weak (r=0.12) — timing of send is a much stronger predictor than what is being asked`,
        `SMs currently send information requests at the point they identify the need — evenly distributed across all hours and days with no timing optimisation`,
      ],
      currentSOP: `Service Management SOP: When an SM identifies that PA input is needed, send the information request immediately via email. No guidance on optimal send timing. No automated scheduling of outbound requests. No tracking of PA response patterns by time of day or day of week. Follow up manually if no response within 5 business days.`,
      recommendedChange: `Implement ‘Smart Send’ timing for all PA information requests. When an SM composes an information request, if the current time is outside the 09:00–11:00 Tuesday/Wednesday optimal window, auto-queue the email for delivery at the next optimal window. SM can override and send immediately if the case is urgent (SLA <24 hours remaining). Surface a ‘PA Response Profile’ on each case showing the specific PA’s historical response pattern — fastest response day/time, average response time, preferred communication channel. For PAs with consistently slow response times (>5 days), auto-escalate to the PA’s line manager contact on record after 3 business days rather than waiting the current 5-day manual follow-up window.`,
      impact: `Projected reduction in average PA response time from 3.7 business days to 1.4 business days. Estimated total case cycle time reduction: 2.3 days per case. Across approximately 4,800 cases per quarter requiring PA input, cumulative cycle time saved: 11,040 case-days per quarter. No additional effort from SMs — the email is written at the same time, just delivered at the optimal moment.`
    },

    {
      id: "INS-SM-005",
      status: "Pending Approval",
      scope: "ssm",
      process: "Service Management",
      category: "Data Integrity — Duplicate Case Creation",
      severity: "high",
      title: `12% of all Service Management cases are duplicates of an existing open case — created because the SM cannot see that another SM is already handling the same PA’s query on the same issue`,
      description: `When a Programme Administrator sends a follow-up email about an existing issue rather than replying to the original thread, or contacts HSBC via a different channel (phone after email, or email after the online portal), a new case is created in the CRM. Because there is no automated duplicate detection, and the shared queue does not surface related open cases for the same PA, a different SM picks up the new case and begins a parallel investigation. The duplicate is typically discovered 2–5 days later when one of the two SMs contacts the PA and learns the issue is already being handled. By that point, both SMs have invested investigation time, potentially contacted the PA separately (creating confusion), and the duplicate case must be merged or closed — adding administrative overhead.`,
      dataPoints: [
        `12% of all Service Management cases created in Q4 2025 were identified as duplicates of an existing open case for the same PA on the same issue`,
        `Average time before a duplicate case is identified and merged: 3.1 business days`,
        `Average SM investigation time wasted per duplicate case before discovery: 47 minutes`,
        `Total SM time wasted on duplicate case investigation in Q4 2025: approximately 1,240 hours`,
        `Top duplicate creation triggers: PA sends follow-up email with new subject line (44%), PA calls after sending email (31%), PA submits portal request after emailing (25%)`,
        `Current CRM has no automated duplicate detection — matching relies entirely on the SM manually searching for the PA’s name and visually scanning open cases`,
      ],
      currentSOP: `Service Management SOP: Each inbound contact creates a new case. SM is expected to manually check for existing open cases for the same PA before beginning investigation. No automated duplicate flagging. No alert when a new case is created for a PA who already has an open case on a related topic. Duplicate discovery relies on SM diligence or PA notification. When a duplicate is found, the later case is closed with a ‘duplicate’ resolution code and notes are manually copied to the original case.`,
      recommendedChange: `Implement automated duplicate detection at case creation. When a new case is created, auto-search for open cases matching the same PA (by email, phone number, or PA ID) within the past 30 days. If a potential duplicate is found, surface it to the assigning SM with a side-by-side comparison: ‘This PA has an existing open case [Case ID] created [X days ago] on topic [Y]. Is this a new issue or a follow-up?’ If flagged as follow-up, merge into the existing case automatically and notify the original handling SM. If flagged as a genuinely new issue, proceed with new case creation but link the cases for visibility. Add a ‘PA Active Cases’ badge visible in the queue showing how many open cases each PA currently has — PAs with 2+ open cases should be flagged for review.`,
      impact: `Projected elimination of 85%+ of duplicate cases — reducing duplicate rate from 12% to under 2%. Recovery of approximately 1,050 SM hours per quarter currently wasted on duplicate investigation. Elimination of PA confusion from being contacted by multiple SMs about the same issue. Reduction in administrative overhead from manual case merging.`
    },

    {
      id: "INS-CB-001",
      status: "Pending Approval",
      scope: "dr",
      process: "Disputes & Chargebacks",
      category: "Chargeback Filing — Reason Code Selection",
      severity: "high",
      title: `22% of chargebacks filed in Q4 2025 used a sub-optimal reason code — reducing the win rate by an average of 31 percentage points compared to the optimal code for the same dispute type`,
      description: `Chargeback reason code selection is the single highest-leverage decision in the dispute lifecycle — it determines the evidence requirements, the merchant’s defence options, and the arbitration framework if the case is contested. Analysis of Q4 2025 chargeback outcomes reveals that 22% of filed chargebacks used a reason code that, while technically valid, was not the optimal code for the specific dispute scenario. In every one of these cases, an alternative reason code existed that would have imposed a heavier evidence burden on the merchant, restricted the merchant’s representment options, or aligned more precisely with the factual basis of the dispute. The impact is not theoretical: chargebacks filed under the optimal reason code for their dispute type won at a rate 31 percentage points higher than those filed under the sub-optimal code.`,
      dataPoints: [
        `Total chargebacks filed in Q4 2025: 2,847`,
        `Chargebacks filed under a sub-optimal reason code: 626 (22%)`,
        `Average win rate for chargebacks filed under the optimal reason code: 71%`,
        `Average win rate for the same dispute types filed under a sub-optimal code: 40% — a 31-percentage-point gap`,
        `Most common sub-optimal selection: filing under ‘Services Not Rendered’ (4853) when ‘Authorisation — No Authorisation’ (4837) was available and stronger — occurred in 38% of sub-optimal filings`,
        `Root cause: investigators select the reason code that most obviously matches the PA’s complaint description rather than the code that maximises win probability given the specific transaction and evidence profile`,
      ],
      currentSOP: `Disputes SOP: The investigating analyst selects the chargeback reason code based on their assessment of the PA’s complaint and the transaction type. No automated reason code recommendation. No win-rate data surfaced at the point of code selection. No mandatory review of code selection before filing. Analyst training covers Mastercard reason code definitions but does not include strategic code selection based on historical win-rate analysis.`,
      recommendedChange: `Implement an automated ‘Reason Code Advisor’ that activates at the point of chargeback filing. Based on the transaction profile (merchant category, transaction type, amount, authorisation status, evidence available), surface the top 3 eligible reason codes ranked by historical win rate for that specific scenario. Display the win-rate differential: ‘Code 4837 has a 74% win rate for this transaction type vs. 43% for Code 4853.’ Require the analyst to either accept the top recommendation or document a written justification for selecting an alternative code. Feed all filing outcomes back into the advisor’s recommendation engine monthly to keep win-rate data current.`,
      impact: `If the 626 sub-optimally coded chargebacks in Q4 had been filed under the optimal code, projected additional wins: approximately 194 cases (based on the 31-point win rate differential). At an average disputed value of £1,100, projected additional recovery: £213K per quarter / £852K per year. The fix requires no additional investigation effort — the same case, the same evidence, filed under a more strategically selected code.`
    },

    {
      id: "INS-CB-002",
      status: "Pending Approval",
      scope: "dr",
      process: "Disputes & Chargebacks",
      category: "Merchant Representment — Response Window",
      severity: "high",
      title: `34% of merchant representments arrive in the final 72 hours of the response window — and HSBC’s counter-response rate on these late-arriving representments is only 18% vs. 67% on representments received with 7+ days remaining`,
      description: `When HSBC files a chargeback, the merchant has a defined window (typically 45 days) to submit a representment — evidence challenging the chargeback. Analysis of representment timing shows that 34% of merchant representments arrive in the final 72 hours of this window. These late-arriving representments catch the Disputes team with minimal time to review the merchant’s evidence, prepare a counter-response, or escalate to pre-arbitration. The result: HSBC’s counter-response rate drops from 67% (when representments arrive with 7+ days remaining) to just 18% for representments arriving in the final 72 hours. Merchants who consistently file late representments are effectively gaming the timing to reduce HSBC’s ability to respond.`,
      dataPoints: [
        `Total merchant representments received in Q4 2025: 1,423`,
        `Representments arriving in the final 72 hours of the response window: 484 (34%)`,
        `HSBC counter-response rate on representments with 7+ days remaining: 67%`,
        `HSBC counter-response rate on representments arriving in final 72 hours: 18%`,
        `Top 15 merchants by late-representment frequency account for 61% of all final-72-hour representments — suggesting a deliberate timing strategy`,
        `Average disputed value on late-representment cases: £2,800 — 2.5x the portfolio average, indicating merchants prioritise timing games on higher-value disputes`,
      ],
      currentSOP: `Disputes SOP: Monitor the representment inbox daily. When a representment is received, assign to an analyst for review and counter-response. No priority differentiation based on remaining response window. No automated alert when a representment arrives with less than 5 days remaining. No merchant-level tracking of representment timing patterns. Analysts manage their queue in FIFO order regardless of deadline proximity.`,
      recommendedChange: `Implement automated representment triage with deadline-aware prioritisation. Upon receipt of any representment, calculate the remaining response window and apply priority classification: ‘Critical’ (<72 hours remaining — auto-assign to senior analyst, surface immediately), ‘Urgent’ (3–7 days remaining — prioritise above FIFO queue), ‘Standard’ (7+ days remaining — normal queue). For Critical representments, auto-generate a preliminary counter-response template based on the original chargeback evidence and reason code — giving the analyst a head start rather than beginning from scratch. Build a ‘Merchant Timing Profile’ tracking each merchant’s representment timing pattern. For merchants who consistently file in the final 72 hours (3+ consecutive late filings), pre-stage counter-response templates 7 days before the representment deadline — so the response is substantially drafted before the representment even arrives.`,
      impact: `Projected increase in counter-response rate on late-arriving representments from 18% to approximately 55%. Across the 484 late representments per quarter, estimated additional counter-responses filed: approximately 179. At the portfolio average counter-response success rate of 52%, projected additional wins: 93 cases per quarter. Estimated additional recovery: £260K per quarter / £1.04M per year.`
    },

    {
      id: "INS-CB-003",
      status: "Pending Approval",
      scope: "dr",
      process: "Disputes & Chargebacks",
      category: "Evidence Quality — PA Documentation Gap",
      severity: "medium",
      title: `First-submission evidence packages are rejected or returned for supplementation in 41% of chargebacks — adding an average of 8 days to the dispute cycle and consuming 2.3 hours of analyst rework per case`,
      description: `When a Programme Administrator files a dispute, the Disputes team gathers evidence to support the chargeback filing. In 41% of cases, the initial evidence package assembled by the analyst is either rejected by the card scheme for insufficient documentation, or returned by the internal QA review for supplementation before filing. The rework cycle — identifying the gap, requesting additional evidence from the PA, waiting for the PA’s response, reassembling the package, and re-submitting — adds an average of 8 days to the dispute cycle and consumes 2.3 hours of analyst time per affected case. The root cause is not analyst error: it is that the evidence requirements vary significantly by reason code, merchant category, and transaction type, and analysts are working from a static checklist that does not adapt to the specific case profile.`,
      dataPoints: [
        `First-submission evidence rejection or return rate in Q4 2025: 41% (1,167 out of 2,847 chargebacks filed)`,
        `Average additional cycle time per evidence rework: 8 days`,
        `Average analyst rework time per evidence return: 2.3 hours`,
        `Total analyst time consumed by evidence rework in Q4 2025: approximately 2,684 hours`,
        `Top evidence gap reasons: missing signed cardholder declaration (28%), insufficient merchant communication log (24%), missing original transaction receipt or authorisation record (19%), wrong evidence format for the specific reason code (18%)`,
        `Current evidence checklist: single static document covering all reason codes — last updated 14 months ago`,
      ],
      currentSOP: `Disputes SOP: Analyst assembles the evidence package using the standard evidence checklist. Checklist is a single document listing all possible evidence types. Analyst selects which items to include based on their judgment and experience. No automated evidence requirement mapping by reason code or transaction type. QA review occurs after assembly but before filing. If QA identifies gaps, the package is returned to the analyst for supplementation.`,
      recommendedChange: `Replace the static evidence checklist with a dynamic ‘Evidence Builder’ that generates a case-specific evidence requirement list based on: the selected reason code, the merchant category code (MCC), the transaction type (POS/CNP/recurring/contactless), and the dispute value. The Evidence Builder should mark each item as ‘Mandatory’ (filing will be rejected without it), ‘Strongly Recommended’ (significantly improves win probability), or ‘Optional’ (supporting but not determinative). Auto-populate items that can be sourced from internal systems (authorisation records, transaction logs, prior case history) without analyst effort. Flag the PA-sourced items (signed declarations, merchant correspondence) at the point of initial PA intake — so the PA is asked for everything needed in a single request rather than iterative follow-ups.`,
      impact: `Projected reduction in first-submission evidence rejection rate from 41% to under 15%. Recovery of approximately 2,100 analyst hours per quarter currently spent on evidence rework. Reduction in average dispute cycle time by 6+ days on affected cases. Improvement in chargeback win rate from higher-quality first submissions — estimated 4-percentage-point win rate increase across the portfolio.`
    },

    {
      id: "INS-CB-004",
      status: "Pending Approval",
      scope: "dr",
      process: "Disputes & Chargebacks",
      category: "Pre-Arbitration — Escalation Threshold",
      severity: "medium",
      title: `Only 8% of lost chargebacks are escalated to pre-arbitration — but cases that are escalated win at pre-arb at a rate of 47%, suggesting significant under-escalation of viable cases`,
      description: `When a chargeback is representmented by the merchant and the representment is accepted (i.e., the chargeback is reversed in the merchant’s favour), HSBC has the option to escalate to pre-arbitration — a second-round review with additional evidence and arguments. Currently, only 8% of lost chargebacks are escalated to pre-arbitration. The decision to escalate is made by the individual analyst based on their judgment, with no structured framework or data-driven threshold. However, the cases that are escalated win at pre-arbitration at a rate of 47% — meaning nearly half of escalated cases are successful. This suggests the current escalation threshold is too conservative: analysts are only escalating cases they are highly confident about, and leaving viable cases on the table.`,
      dataPoints: [
        `Total chargebacks lost at first representment in Q4 2025: 1,027`,
        `Cases escalated to pre-arbitration: 82 (8% of lost chargebacks)`,
        `Pre-arbitration win rate on escalated cases: 47%`,
        `Estimated number of lost chargebacks with sufficient evidence strength for pre-arbitration but not escalated: 214 (based on evidence score analysis)`,
        `Average disputed value on cases escalated to pre-arb: £3,400 — analysts disproportionately escalate higher-value cases`,
        `Pre-arbitration fee (Mastercard): £125 per filing — break-even requires a win rate above 3.7% at the average dispute value, well below the actual 47% win rate`,
      ],
      currentSOP: `Disputes SOP: When a chargeback is lost at representment, the analyst reviews the merchant’s evidence and decides whether to escalate to pre-arbitration. Decision is based on individual judgment. No structured escalation criteria. No evidence scoring model. No mandatory review of escalation decisions by a senior analyst. Cases not escalated are closed as ‘Lost — Representment Accepted.’`,
      recommendedChange: `Implement an automated ‘Pre-Arbitration Viability Score’ for every lost chargeback. Score is calculated based on: strength of HSBC’s original evidence vs. merchant’s representment evidence, reason code-specific pre-arb win rates, disputed value vs. pre-arb filing cost, merchant’s historical pre-arb loss rate, and whether new evidence is available that was not in the original filing. Cases scoring above the viability threshold are auto-flagged for pre-arbitration with a recommended escalation brief. Require analyst sign-off to decline escalation on flagged cases (reverse the burden — currently analysts must opt in; change to opt out with documented justification). For cases below the threshold, auto-close as ‘Lost — Pre-Arb Not Viable’ with the score recorded for audit.`,
      impact: `If the 214 estimated viable-but-not-escalated cases had been filed at pre-arbitration with the observed 47% win rate, projected additional wins: approximately 101 cases per quarter. At the average disputed value of £1,100, projected additional recovery: £111K per quarter / £444K per year. Net of pre-arb filing fees (£26.7K), net annual benefit: approximately £417K.`
    },

    {
      id: "INS-CB-005",
      status: "Pending Approval",
      scope: "dr",
      process: "Disputes & Chargebacks",
      category: "Operational Efficiency — Merchant Contact Redundancy",
      severity: "medium",
      title: `Disputes analysts are independently contacting the same merchants on separate cases without knowledge of each other’s outreach — resulting in 3.2 redundant merchant contacts per week and inconsistent negotiation positions`,
      description: `Multiple Disputes analysts frequently work on separate chargeback cases involving the same merchant simultaneously. Because there is no shared merchant contact log or case coordination mechanism, analysts independently reach out to the same merchant contact — sometimes on the same day — without knowing that a colleague has already initiated contact on a related or similar case. This creates three problems: the merchant receives multiple outreach attempts from HSBC (appearing disorganised), different analysts may offer different resolution terms or take different negotiation positions with the same merchant, and the analyst time spent on redundant outreach is entirely wasted. For high-volume merchants with 10+ active disputes, the coordination failure is particularly acute.`,
      dataPoints: [
        `Average redundant merchant contacts per week (same merchant contacted by multiple analysts within 48 hours on separate cases): 3.2`,
        `Top 20 merchants by active dispute count receive an average of 4.7 separate analyst contacts per month — of which an estimated 2.1 are redundant`,
        `Analyst time per merchant outreach (preparation, call/email, documentation): average 35 minutes`,
        `Total estimated analyst time wasted on redundant merchant contacts in Q4 2025: approximately 580 hours`,
        `Incidents of inconsistent negotiation positions surfaced by merchant complaints in Q4: 7 — with 3 resulting in the merchant refusing further direct engagement and demanding all communication go through their acquirer only`,
        `No shared merchant contact log exists — each analyst’s outreach is recorded only in their individual case file`,
      ],
      currentSOP: `Disputes SOP: Each analyst manages merchant outreach independently on their assigned cases. Contact history is recorded in the individual case file. No shared merchant communication log. No visibility into whether another analyst has recently contacted or is currently in negotiations with the same merchant. No coordinator role for high-volume merchants. When a merchant complains about multiple contacts, the issue is resolved ad hoc by a team lead.`,
      recommendedChange: `Implement a ‘Merchant Contact Coordination Hub’ — a shared log visible to all Disputes analysts showing: current and recent outreach to each merchant (who contacted, when, which case, what was discussed/offered), active negotiation status (open offer, pending response, declined), and a ‘Merchant Owner’ designation for any merchant with 3+ active disputes. For merchants with 3+ active disputes, assign a single ‘Merchant Owner’ analyst who consolidates all outreach into a single coordinated communication stream. Other analysts working on cases involving that merchant route their outreach requests through the Merchant Owner rather than contacting independently. The Merchant Owner batches communications for efficiency and ensures consistent negotiation positioning across all active cases.`,
      impact: `Projected elimination of 85%+ of redundant merchant contacts. Recovery of approximately 490 analyst hours per quarter. Elimination of inconsistent negotiation positions that damage HSBC’s credibility with key merchants. Improved merchant cooperation through consolidated, professional outreach. Potential improvement in direct resolution rates with high-volume merchants who currently resist engagement due to coordination failures.`
    }
];

// Scope filter tabs
const SCOPE_TABS = [
    { key: 'all', label: 'All' },
    { key: 'cross-process', label: 'Cross-Process' },
    { key: 'ssm', label: 'Service Management' },
    { key: 'dr', label: 'Disputes & Chargebacks' },
];

// ─── Pill style helpers ───────────────────────────────────────────────
const getStatusStyle = (status) => {
    if (status === 'Approved') return { background: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0' };
    return { background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' };
};

const getSeverityStyle = (severity) => {
    if (severity === 'high') return { background: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca' };
    return { background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' };
};

const getDirectionStyle = (direction) => {
    if (direction.includes('\u2194')) return { background: '#e0e7ff', color: '#3730a3', border: '1px solid #c7d2fe' };
    if (direction.includes('\u2192') && direction.startsWith('Service')) return { background: '#f3e8ff', color: '#6b21a8', border: '1px solid #e9d5ff' };
    return { background: '#dbeafe', color: '#1e40af', border: '1px solid #bfdbfe' };
};

const getProcessStyle = (process) => {
    if (process === 'Service Management') return { background: '#ccfbf1', color: '#134e4a', border: '1px solid #99f6e4' };
    return { background: '#ffe4e6', color: '#9f1239', border: '1px solid #fecdd3' };
};

const getCategoryIcon = (category) => {
    if (category.includes('Cross-Process')) return <Zap size={14} />;
    if (category.includes('Parallel')) return <ArrowLeftRight size={14} />;
    if (category.includes('Redesign')) return <RefreshCw size={14} />;
    if (category.includes('Pattern')) return <TrendingUp size={14} />;
    if (category.includes('SLA')) return <AlertTriangle size={14} />;
    if (category.includes('Knowledge')) return <FileText size={14} />;
    if (category.includes('Behaviour') || category.includes('Contact')) return <Briefcase size={14} />;
    if (category.includes('Communication') || category.includes('Response')) return <ArrowRight size={14} />;
    if (category.includes('Duplicate') || category.includes('Integrity')) return <Shield size={14} />;
    if (category.includes('Chargeback') || category.includes('Filing') || category.includes('Reason')) return <AlertTriangle size={14} />;
    if (category.includes('Representment') || category.includes('Merchant')) return <ArrowLeftRight size={14} />;
    if (category.includes('Evidence')) return <FileText size={14} />;
    if (category.includes('Arbitration') || category.includes('Escalation')) return <TrendingUp size={14} />;
    if (category.includes('Efficiency') || category.includes('Operational')) return <RefreshCw size={14} />;
    return <FileText size={14} />;
};

const getDirectionIcon = (direction) => {
    if (direction.includes('\u2194')) return <ArrowLeftRight size={12} />;
    if (direction.includes('\u2192') && direction.startsWith('Service')) return <ArrowRight size={12} />;
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
            {/* Card Header */}
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

                        {/* Direction pill - CONDITIONAL: only if direction exists */}
                        {insight.direction && (
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
                        )}

                        {/* Process pill - CONDITIONAL: only if process exists */}
                        {insight.process && (
                            <span style={{
                                fontSize: 11,
                                fontWeight: 500,
                                padding: '2px 10px',
                                borderRadius: 20,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 4,
                                ...getProcessStyle(insight.process),
                            }}>
                                {insight.process === 'Service Management' ? <Briefcase size={12} /> : <Shield size={12} />}
                                {insight.process}
                            </span>
                        )}

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

            {/* Expanded Body */}
            {expanded && (
                <div style={{ padding: '0 20px 20px 50px' }}>
                    {/* Description */}
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

                    {/* SOP Panels */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                        {/* Current SOP */}
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

                        {/* Recommended Change */}
                        <div style={{
                            background: '#f0fdf4',
                            border: '1px solid #bbf7d0',
                            borderRadius: 8,
                            padding: 16,
                        }}>
                            <div style={{ fontSize: 12, fontWeight: 600, color: '#166534', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                                <CheckCircle2 size={14} />
                                Recommended Change
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

                    {/* Impact */}
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
                    <div style={{ display: 'flex', gap: 8 }}>
                        {editing ? (
                            <>
                                <button
                                    onClick={handleSave}
                                    style={{
                                        display: 'inline-flex', alignItems: 'center', gap: 6,
                                        padding: '8px 16px', borderRadius: 8, border: 'none',
                                        background: '#166534', color: '#fff', fontSize: 13,
                                        fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                                    }}
                                >
                                    <Save size={14} /> Save Changes
                                </button>
                                <button
                                    onClick={handleCancel}
                                    style={{
                                        display: 'inline-flex', alignItems: 'center', gap: 6,
                                        padding: '8px 16px', borderRadius: 8,
                                        border: '1px solid #d1d5db', background: '#fff',
                                        color: '#374151', fontSize: 13, fontWeight: 600,
                                        cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                                    }}
                                >
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={(e) => { e.stopPropagation(); onApprove(insight.id); }}
                                    disabled={isApproved}
                                    style={{
                                        display: 'inline-flex', alignItems: 'center', gap: 6,
                                        padding: '8px 16px', borderRadius: 8, border: 'none',
                                        background: isApproved ? '#d1d5db' : '#166534',
                                        color: '#fff', fontSize: 13, fontWeight: 600,
                                        cursor: isApproved ? 'not-allowed' : 'pointer',
                                        fontFamily: 'Inter, sans-serif', opacity: isApproved ? 0.6 : 1,
                                    }}
                                >
                                    <CheckCircle2 size={14} /> {isApproved ? 'Approved' : 'Approve'}
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setEditing(true); }}
                                    disabled={isApproved}
                                    style={{
                                        display: 'inline-flex', alignItems: 'center', gap: 6,
                                        padding: '8px 16px', borderRadius: 8, border: 'none',
                                        background: isApproved ? '#e5e7eb' : '#2563eb',
                                        color: '#fff', fontSize: 13, fontWeight: 600,
                                        cursor: isApproved ? 'not-allowed' : 'pointer',
                                        fontFamily: 'Inter, sans-serif', opacity: isApproved ? 0.5 : 1,
                                    }}
                                >
                                    <Edit3 size={14} /> Edit
                                </button>
                                <button
                                    style={{
                                        display: 'inline-flex', alignItems: 'center', gap: 6,
                                        padding: '8px 16px', borderRadius: 8,
                                        border: '1px solid #d1d5db', background: '#fff',
                                        color: '#374151', fontSize: 13, fontWeight: 600,
                                        cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                                    }}
                                >
                                    <RefreshCw size={14} /> Update
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

// ─── Main Insights Component ──────────────────────────────────────────
const Insights = () => {
    const [insights, setInsights] = useState(INSIGHTS_DATA);
    const [activeScope, setActiveScope] = useState('all');

    const handleApprove = (id) => {
        setInsights(prev => prev.map(ins =>
            ins.id === id ? { ...ins, status: 'Approved' } : ins
        ));
    };

    // Filter by scope
    const filteredInsights = activeScope === 'all'
        ? insights
        : insights.filter(ins => ins.scope === activeScope);

    // Stats for filtered view
    const total = filteredInsights.length;
    const highCount = filteredInsights.filter(i => i.severity === 'high').length;
    const mediumCount = filteredInsights.filter(i => i.severity === 'medium').length;
    const pendingCount = filteredInsights.filter(i => i.status === 'Pending Approval').length;

    // Scope counts (always from full set)
    const scopeCounts = {
        'all': insights.length,
        'cross-process': insights.filter(i => i.scope === 'cross-process').length,
        'ssm': insights.filter(i => i.scope === 'ssm').length,
        'dr': insights.filter(i => i.scope === 'dr').length,
    };

    return (
        <div style={{ padding: '24px 32px', fontFamily: 'Inter, sans-serif' }}>
            {/* Header */}
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: 24, fontWeight: 700, color: '#111827', margin: 0, marginBottom: 4 }}>
                    Insights
                </h1>
                <p style={{ fontSize: 14, color: '#6b7280', margin: 0 }}>
                    AI-generated insights from cross-process analysis and process-specific pattern detection across HSBC Commercial Cards operations
                </p>
            </div>

            {/* Scope filter tabs */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
                {SCOPE_TABS.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveScope(tab.key)}
                        style={{
                            padding: '6px 16px',
                            borderRadius: 20,
                            border: activeScope === tab.key ? 'none' : '1px solid #e5e7eb',
                            background: activeScope === tab.key ? '#1f2937' : '#f3f4f6',
                            color: activeScope === tab.key ? '#fff' : '#374151',
                            fontSize: 13,
                            fontWeight: 600,
                            cursor: 'pointer',
                            fontFamily: 'Inter, sans-serif',
                            transition: 'all 0.15s ease',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                        }}
                    >
                        {tab.label}
                        <span style={{
                            fontSize: 11,
                            fontWeight: 700,
                            padding: '1px 7px',
                            borderRadius: 10,
                            background: activeScope === tab.key ? 'rgba(255,255,255,0.2)' : '#e5e7eb',
                            color: activeScope === tab.key ? '#fff' : '#6b7280',
                        }}>
                            {scopeCounts[tab.key]}
                        </span>
                    </button>
                ))}
            </div>

            {/* Stats bar */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 16,
                marginBottom: 24,
            }}>
                <div style={{ background: '#f9fafb', borderRadius: 8, padding: '12px 16px', border: '1px solid #e5e7eb' }}>
                    <div style={{ fontSize: 11, color: '#6b7280', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>Total Insights</div>
                    <div style={{ fontSize: 24, fontWeight: 700, color: '#111827' }}>{total}</div>
                </div>
                <div style={{ background: '#fef2f2', borderRadius: 8, padding: '12px 16px', border: '1px solid #fecaca' }}>
                    <div style={{ fontSize: 11, color: '#991b1b', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>High Severity</div>
                    <div style={{ fontSize: 24, fontWeight: 700, color: '#991b1b' }}>{highCount}</div>
                </div>
                <div style={{ background: '#fffbeb', borderRadius: 8, padding: '12px 16px', border: '1px solid #fde68a' }}>
                    <div style={{ fontSize: 11, color: '#92400e', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>Medium Severity</div>
                    <div style={{ fontSize: 24, fontWeight: 700, color: '#92400e' }}>{mediumCount}</div>
                </div>
                <div style={{ background: '#fef3c7', borderRadius: 8, padding: '12px 16px', border: '1px solid #fde68a' }}>
                    <div style={{ fontSize: 11, color: '#92400e', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>Pending Approval</div>
                    <div style={{ fontSize: 24, fontWeight: 700, color: '#92400e' }}>{pendingCount}</div>
                </div>
            </div>

            {/* Insight Cards */}
            <div>
                {filteredInsights.map(insight => (
                    <InsightCard
                        key={insight.id}
                        insight={insight}
                        onApprove={handleApprove}
                    />
                ))}
            </div>
        </div>
    );
};

export default Insights;
