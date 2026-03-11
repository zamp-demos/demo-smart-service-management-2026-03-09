const fs = require('fs');
const path = require('path');

// --- Configuration ---
const PROJECT_ROOT = path.join(__dirname, '..');
const PUBLIC_DATA_DIR = path.join(PROJECT_ROOT, 'public/data');
const PROCESSES_FILE = path.join(PUBLIC_DATA_DIR, 'processes.json');
const PROCESS_ID = "CB-2026-0302-WPP-0114";
const CASE_NAME = "Hotel Cancellation — Full Amount Recovered via Mastercard 4853";

// --- Helpers ---
const readJson = (file) => (fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : []);
const writeJson = (file, data) => fs.writeFileSync(file, JSON.stringify(data, null, 4));
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const updateProcessLog = (processId, logEntry, keyDetailsUpdate = {}) => {
 const processFile = path.join(PUBLIC_DATA_DIR, `process_${processId}.json`);
 let data = { logs: [], keyDetails: {}, sidebarArtifacts: [] };
 if (fs.existsSync(processFile)) data = readJson(processFile);

 if (logEntry) {
 const existingIdx = logEntry.id ? data.logs.findIndex(l => l.id === logEntry.id) : -1;
 if (existingIdx !== -1) {
 data.logs[existingIdx] = { ...data.logs[existingIdx], ...logEntry };
 } else {
 data.logs.push(logEntry);
 }
 }

 if (keyDetailsUpdate && Object.keys(keyDetailsUpdate).length > 0) {
 data.keyDetails = { ...data.keyDetails, ...keyDetailsUpdate };
 }
 writeJson(processFile, data);
};

const updateProcessListStatus = async (processId, status, currentStatus) => {
 const apiUrl = process.env.VITE_API_URL || 'http://localhost:3001';
 try {
 const response = await fetch(`${apiUrl}/api/update-status`, {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({ id: processId, status, currentStatus })
 });
 if (!response.ok) throw new Error(`Server returned ${response.status}`);
 } catch (e) {
 try {
 const processes = JSON.parse(fs.readFileSync(PROCESSES_FILE, 'utf8'));
 const idx = processes.findIndex(p => p.id === String(processId));
 if (idx !== -1) {
 processes[idx].status = status;
 processes[idx].currentStatus = currentStatus;
 fs.writeFileSync(PROCESSES_FILE, JSON.stringify(processes, null, 4));
 }
 } catch (err) { }
 }
};

(async () => {
 console.log(`Starting ${PROCESS_ID}: ${CASE_NAME}...`);

 // Initialize process log with key details
 writeJson(path.join(PUBLIC_DATA_DIR, `process_${PROCESS_ID}.json`), {
 logs: [],
 keyDetails: {
 "Client": "WPP plc (UK)",
 "Cardholder": "Marcus Webb ····6193",
 "Role": "VP Business Development",
 "Programme Administrator": "Nadia Osei",
 "Disputed Merchant": "InterContinental Zurich",
 "Disputed Amount": "GBP 2,340.00",
 "Transaction Date": "2026-02-11",
 "Booking Reference": "IHG-ZRH-2026-08847",
 "Reason Code": "4853 — Services Not Rendered",
 "MDR Case Reference": "MC-2026-030-0228847",
 "SM Assigned": "David Mensah",
 "Programme": "WPP-PROG-UK-0047",
 },
 sidebarArtifacts: []
 });

 const steps = [
 {
 id: "step-1",
 title_p: "Receiving and parsing inbound dispute email...",
 title_s: "Dispute Email Received & Claim Extracted",
 reasoning: [
 "Inbound email received from n.osei@wpp.com at 09:14:22 GMT on 2 March 2026.",
 "Sender domain verified as wpp.com — matched to known client programme WPP-PROG-UK-0047.",
 "Subject: \"Formal dispute — card charge for cancelled hotel booking — Marcus Webb ····6193.\"",
 "Claim extracted: InterContinental Zurich cancelled booking evening before check-in due to overbooking, charged card in full next morning. Marcus sourced alternative accommodation. Hotel acknowledged cancellation in writing but no refund after 19 days.",
 "Two attachments detected: IHG booking confirmation and hotel cancellation email chain.",
 "Case CB-2026-0302-WPP-0114 created, assigned to SM David Mensah."
 ],
 artifacts: [{
 id: "dr1-art-01",
 type: "email_draft",
 label: "Inbound Email Nadia Osei",
 data: {
 from: "n.osei@wpp.com",
 to: "commercialcards.service@hsbc.com",
 cc: "m.webb@wpp.com",
 subject: "Formal dispute — card charge for cancelled hotel booking — Marcus Webb ····6193",
 isIncoming: true,
 body: "Dear HSBC Commercial Cards Team,\n\nI am writing to formally raise a dispute on behalf of Marcus Webb (VP Business Development, WPP plc), card ending 6193, regarding a charge of GBP 2,340.00 from InterContinental Zurich.\n\nBACKGROUND\n\nMarcus had booked two nights at the InterContinental Zurich (booking reference IHG-ZRH-2026-08847, check-in 11 February, check-out 13 February) for a client meeting in Zurich. On the evening of 10 February 2026, the hotel emailed Marcus to advise that his reservation had been cancelled due to overbooking on their part. Marcus was required to source alternative accommodation at short notice and arranged a stay at the Marriott Zurich at his own expense.\n\nDespite cancelling the reservation themselves, InterContinental Zurich charged card ····6193 GBP 2,340.00 on 11 February 2026.\n\nSTEPS TAKEN\n\nMarcus and I have been in contact with the hotel directly for the past 19 days. On 17 February 2026, we received written confirmation from the hotel's guest relations team acknowledging that the booking was cancelled due to their own overbooking and that a refund of CHF 2,703.30 was being processed. As of today, 2 March 2026, no credit has appeared on the card.\n\nI am attaching the following:\n- IHG booking confirmation (IHG-ZRH-2026-08847)\n- Hotel cancellation email and subsequent overbooking acknowledgement from guest relations\n\nPlease advise on next steps and let us know if any further information is required.\n\nKind regards,\n\nNadia Osei\nProgramme Administrator — Commercial Cards\nWPP plc | Sea Containers, 18 Upper Ground, London SE1 9GL\nT: +44 20 7282 4600 ext. 3140 | n.osei@wpp.com"
 }
 }]
 },
 {
 id: "step-2",
 title_p: "Verifying PA identity and loading programme configuration...",
 title_s: "PA, Cardholder & Programme Verified",
 reasoning: [
 "Pace queried the HSBC CRM system for the sender (n.osei@wpp.com).",
 "PA identity confirmed: Nadia Osei, Commercial Cards Programme Administrator, WPP plc (UK).",
 "Programme account retrieved: WPP-PROG-UK-0047. SM assigned: David Mensah. Preferred response format: formal email.",
 "Cardholder record located: Marcus Webb, VP Business Development, card ····6193, active, no alerts, no suspended flags.",
 "Programme dispute policy POL-WPP-UK-2026 loaded — PA authorised to raise disputes on behalf of cardholders."
 ],
 artifacts: [{
 id: "dr1-art-02",
 type: "file",
 label: "CRM Programme Summary",
 pdfPath: "/data/DR1_CRM_Programme_Summary.pdf"
 }]
 },
 {
 id: "step-3",
 title_p: "Querying five systems in parallel — transaction, fraud, card status...",
 title_s: "Transaction Confirmed & Fraud Ruled Out",
 reasoning: [
 "Auth Platform queried for card ····6193 on 2026-02-11. Transaction located: GBP 2,340.00 at InterContinental Zurich — authorised and settled 2026-02-12. Single clean auth — no duplicate, no declined prior attempts. Card in good standing.",
 "MiVision: card active, spend GBP 4,217 (53% utilised). No credit from InterContinental Zurich on account — hotel's promised refund not delivered.",
 "SAS Fraud Management: no alerts, no flags. Fraud score 8/100. Hotel stays in Zurich consistent with 12-month travel pattern — 14 hotel transactions prior year. No anomaly.",
 "Chargeback history: zero prior chargebacks on card, zero on programme in past 12 months.",
 "All five checks clean. This is a billing dispute, not fraud."
 ],
 artifacts: [
 {
 id: "dr1-art-03",
 type: "file",
 label: "Auth Platform Transaction Record",
 pdfPath: "/data/DR1_Auth_Platform_Transaction_Record.pdf"
 },
 {
 id: "dr1-art-04",
 type: "file",
 label: "SAS Clean Check Report",
 pdfPath: "/data/DR1_SAS_Clean_Check_Report.pdf"
 }
 ]
 },
 {
 id: "step-4",
 title_p: "Assessing dispute type and Mastercard filing rights...",
 title_s: "Dispute Type & Mastercard Filing Rights Assessed",
 reasoning: [
 "Assessed claim against Mastercard reason code framework.",
 "4837 (Fraud): Ruled out — Marcus authorised original booking, SAS fraud score 8/100.",
 "4834 (Duplicate): Ruled out — single authorisation confirmed by Auth Platform.",
 "4853 (Services Not Rendered): Confirmed — hotel cancelled own booking, service not provided, card charged, 19 days with no refund.",
 "Filing window: 101 days remaining of 120-day limit.",
 "Write-off threshold: GBP 2,340.00 materially above minimum. Hotel's written acknowledgement leaves no credible merchant defence — recovery probability high.",
 "Decision: file Mastercard First Chargeback under reason code 4853."
 ],
 artifacts: [{
 id: "dr1-art-05",
 type: "file",
 label: "Reason Code Assessment Report",
 pdfPath: "/data/DR1_Reason_Code_Assessment_Report.pdf"
 }]
 },
 {
 id: "step-5",
 title_p: "Reviewing attachments and identifying evidence gaps...",
 title_s: "Attachments Reviewed & Evidence Gaps Identified",
 reasoning: [
 "Reviewed both email attachments from Nadia's original dispute email.",
 "Attachment 1 — IHG Booking Confirmation: Guest Marcus Webb, ref IHG-ZRH-2026-08847, InterContinental Zurich, check-in 2026-02-11, check-out 2026-02-13, CHF 2,703.30, card ····6193. Cross-checked: CHF 2,703.30 at settlement rate = GBP 2,340.00 — exact match.",
 "Attachment 2 — Hotel Cancellation Email Chain: cancellation notice 21:47 GMT 2026-02-10, reason overbooking. Follow-up 2026-02-17: confirmed cancellation, confirmed charge CHF 2,703.30, stated refund in 5–10 business days — window lapsed with no refund (MiVision confirms).",
 "Evidence inventory: 5 of 6 items complete.",
 "Outstanding: brief written statement from Marcus confirming no service received and no refund."
 ],
 artifacts: [{
 id: "dr1-art-06",
 type: "file",
 label: "Evidence Review Report",
 pdfPath: "/data/DR1_Evidence_Review_Report.pdf"
 }]
 },
 {
 id: "step-6",
 title_p: "Requesting missing evidence from PA and processing response...",
 title_s: "Evidence Request Sent to PA — Response Received — Package Complete",
 reasoning: [
 "Targeted evidence request sent to Nadia at 09:22 GMT — one specific item: brief written statement from Marcus confirming no service received and no refund.",
 "PA response received at 09:41 GMT — 19 minutes 07 seconds turnaround.",
 "Marcus Webb's statement: confirmed room not available on arrival, arranged alternative accommodation at own cost, no credit from InterContinental Zurich on card ····6193.",
 "Additional document provided: Marriott Zurich booking confirmation showing Marcus checked in evening of 2026-02-10, less than 30 minutes after cancellation notice — corroborates claim.",
 "All six evidence items now confirmed — package complete and ready for Mastercard filing."
 ],
 artifacts: [
 {
 id: "dr1-art-07",
 type: "email_draft",
 label: "Evidence Request Email",
 data: {
 from: "david.mensah@hsbc.com",
 to: "n.osei@wpp.com",
 subject: "RE: Formal dispute — card charge for cancelled hotel booking — Marcus Webb ····6193",
 isSent: true,
 body: "Dear Nadia,\n\nThank you for raising this dispute on behalf of Marcus Webb (card ····6193) regarding the InterContinental Zurich charge of GBP 2,340.00.\n\nWe have reviewed the booking confirmation and hotel correspondence you attached and have everything we need with one exception.\n\nTo file this dispute formally with Mastercard under Reason Code 4853 (Services Not Rendered), we require a brief written statement from Marcus confirming the following two points:\n\n  1. That he did not receive the hotel accommodation (the room was not made available to him); and\n  2. That as of today, no refund from InterContinental Zurich has appeared on his card.\n\nThis can be a short paragraph in the body of an email — it does not need to be a formal letter or notarised document.\n\nWe already hold the following from your original email:\n  - IHG booking confirmation (IHG-ZRH-2026-08847) — confirmed match to the transaction record\n  - Hotel cancellation email from 10 February 2026\n  - Hotel guest relations acknowledgement from 17 February 2026 confirming overbooking\n\nOur Mastercard filing deadline for this case is 11 June 2026, however we are aiming to file today. If Marcus is able to provide the above statement in the next 30 minutes, we can proceed to filing immediately.\n\nOnce the chargeback is filed, a provisional credit of GBP 2,340.00 will be applied to the WPP programme account.\n\nPlease do not hesitate to contact me if you have any questions.\n\nKind regards,\n\nDavid Mensah\nSenior Card Consultant — Commercial Cards\nHSBC Bank plc\ndavid.mensah@hsbc.com | Direct: +44 20 7991 8200"
 }
 },
 {
 id: "dr1-art-08",
 type: "email_draft",
 label: "PA Evidence Response",
 data: {
 from: "n.osei@wpp.com",
 to: "david.mensah@hsbc.com",
 cc: "m.webb@wpp.com",
 subject: "RE: Formal dispute — card charge for cancelled hotel booking — Marcus Webb ····6193",
 isIncoming: true,
 body: "Dear David,\n\nThank you for the quick response. Please find Marcus's statement below, and an additional supporting document attached.\n\nSTATEMENT FROM MARCUS WEBB — VP BUSINESS DEVELOPMENT, WPP plc\n\n\"I confirm that InterContinental Zurich cancelled my reservation (booking reference IHG-ZRH-2026-08847) on the evening of 10 February 2026, citing overbooking. I was not provided with a hotel room or any alternative accommodation by InterContinental Zurich. I made my own arrangements and checked in to the Marriott Zurich the same evening at my own expense. As of today, 2 March 2026, no refund from InterContinental Zurich has appeared on my HSBC Corporate Card ending 6193.\"\n\nI have also attached the Marriott Zurich booking confirmation showing Marcus's check-in on the evening of 10 February — less than 30 minutes after receiving the hotel's cancellation notice. This confirms he was genuinely present in Zurich and required paid alternative accommodation.\n\nPlease proceed with the chargeback filing at your earliest convenience.\n\nKind regards,\n\nNadia Osei\nProgramme Administrator — Commercial Cards\nWPP plc\n\n[Attachments: Marriott_Zurich_Booking_Confirmation_MZH-2026-00431.pdf]"
 }
 }
 ]
 },
 {
 id: "step-7",
 title_p: "Filing Mastercard chargeback via MDR portal...",
 title_s: "Mastercard Chargeback Filed via MDR Portal — Provisional Credit Applied",
 reasoning: [
 "Pace navigated Mastercard Dispute Resolution (MDR) portal with HSBC issuer credentials.",
 "New dispute created for card ····6193: GBP 2,340.00, InterContinental Zurich, transaction date 2026-02-11.",
 "Reason code 4853 — Services Not Rendered selected. Five evidence documents uploaded: booking confirmation, cancellation email chain, hotel acknowledgement, cardholder statement, Marriott booking.",
 "First Chargeback filed at 09:54 GMT on 2 March 2026. Case reference: MC-2026-030-0228847.",
 "Merchant acquirer notified — response deadline 17 April 2026 (45 calendar days).",
 "Provisional credit of GBP 2,340.00 applied to WPP programme account 4 seconds after filing confirmation.",
 "PA notification email sent to Nadia Osei confirming filing and provisional credit."
 ],
 artifacts: [
 {
 id: "dr1-art-09",
 type: "file",
 label: "MDR Filing Confirmation",
 pdfPath: "/data/DR1_MDR_Filing_Confirmation.pdf"
 },
 {
 id: "dr1-art-09b",
 type: "video",
 label: "MDR Chargeback Filing Recording",
 videoPath: "/data/DR1_MDR_Chargeback_Filing_Recording.webm"
 },
 {
 id: "dr1-art-10",
 type: "email_draft",
 label: "Provisional Credit Notification",
 data: {
 from: "david.mensah@hsbc.com",
 to: "n.osei@wpp.com",
 cc: "m.webb@wpp.com",
 subject: "Chargeback filed \u2014 Provisional credit applied \u2014 Marcus Webb \u00b7\u00b7\u00b7\u00b76193 \u2014 InterContinental Zurich",
 isSent: true,
 body: "Dear Nadia,\n\nI am writing to confirm that we have formally filed a chargeback with Mastercard in respect of the disputed charge on Marcus Webb\u2019s card (\u00b7\u00b7\u00b7\u00b76193).\n\nCASE DETAILS\n\n  HSBC Case Reference:       CB-2026-0302-WPP-0114\n  Mastercard Case Reference: MC-2026-030-0228847\n  Disputed Merchant:         InterContinental Zurich\n  Disputed Amount:           GBP 2,340.00\n  Mastercard Reason Code:    4853 \u2014 Services Not Rendered\n  Date Filed:                2 March 2026\n\nPROVISIONAL CREDIT\n\nA provisional credit of GBP 2,340.00 has been applied to the WPP plc programme account (WPP-PROG-UK-0047) today, 2 March 2026.\n\nPlease note that this credit is conditional pending the outcome of the Mastercard investigation. If the chargeback is upheld in HSBC\u2019s favour, the credit will be confirmed as permanent and no further action will be required. In the unlikely event that the merchant successfully challenges the chargeback, we will contact you before any reversal occurs.\n\nNEXT STEPS\n\nInterContinental Zurich\u2019s bank has until 17 April 2026 to respond to the chargeback. We will monitor the case on your behalf and update you as soon as the outcome is confirmed.\n\nYou do not need to take any further action at this stage.\n\nPlease do not hesitate to contact me if you have any questions.\n\nKind regards,\n\nDavid Mensah\nSenior Card Consultant \u2014 Commercial Cards\nHSBC Bank plc\ndavid.mensah@hsbc.com | Direct: +44 20 7991 8200"
 }
 }
 ]
 },
 {
 id: "step-8",
 title_p: "Monitoring MDR portal for merchant response...",
 title_s: "Merchant Acceptance Detected — No Representment Filed",
 reasoning: [
 "Pace monitored MDR case MC-2026-030-0228847 on a daily schedule.",
 "Status change detected at 14:22 GMT on 18 March 2026 — 16 days after filing.",
 "New status: Merchant Accepted — No Representment Filed.",
 "InterContinental Zurich's acquirer accepted the chargeback in full without challenge.",
 "GBP 2,340.00 confirmed transferred back to issuer (HSBC).",
 "Hotel's own written acknowledgement of the overbooking left no credible basis for contest."
 ],
 artifacts: [
 {
 id: "dr1-art-11",
 type: "file",
 label: "MDR Merchant Acceptance Record",
 pdfPath: "/data/DR1_MDR_Merchant_Acceptance_Record.pdf"
 },
 {
 id: "dr1-art-11b",
 type: "video",
 label: "MDR Merchant Acceptance Recording",
 videoPath: "/data/DR1_MDR_Merchant_Acceptance_Recording.webm"
 }
 ]
 },
 {
 id: "step-9",
 title_p: "Closing case and making provisional credit permanent...",
 title_s: "Case Closed — Credit Made Permanent — Pattern Recorded",
 reasoning: [
 "Provisional credit of GBP 2,340.00 confirmed permanent on WPP programme account WPP-PROG-UK-0047.",
 "PA closure email sent to Nadia Osei confirming full resolution: chargeback upheld, merchant accepted, full amount recovered.",
 "CRM case CB-2026-0302-WPP-0114 closed with full audit log — all 9 steps recorded.",
 "Pattern noted: 4th consecutive hotel dispute with hotel-authored cancellation acknowledgement — 4/4 merchant acceptances, all resolved within 20 days, all without representment.",
 "Knowledge base updated: hotel disputes with hotel's own written cancellation acknowledgement flagged for high-confidence, same-day filing priority."
 ],
 artifacts: [
 {
 id: "dr1-art-12",
 type: "email_draft",
 label: "Case Closure Confirmation",
 data: {
 from: "david.mensah@hsbc.com",
 to: "n.osei@wpp.com",
 cc: "m.webb@wpp.com",
 subject: "Chargeback resolved \u2014 Full amount recovered \u2014 Marcus Webb \u00b7\u00b7\u00b7\u00b76193 \u2014 InterContinental Zurich",
 isSent: true,
 body: "Dear Nadia,\n\nI am pleased to confirm that the chargeback filed on behalf of Marcus Webb has been fully resolved in WPP\u2019s favour.\n\nRESOLUTION SUMMARY\n\n  HSBC Case Reference:       CB-2026-0302-WPP-0114\n  Mastercard Case Reference: MC-2026-030-0228847\n  Disputed Merchant:         InterContinental Zurich\n  Amount Recovered:          GBP 2,340.00\n  Mastercard Reason Code:    4853 \u2014 Services Not Rendered\n  Resolution Date:           18 March 2026\n  Outcome:                   Chargeback upheld \u2014 merchant accepted in full\n\nPROVISIONAL CREDIT \u2014 NOW PERMANENT\n\nThe provisional credit of GBP 2,340.00 applied to the WPP plc programme account on 2 March 2026 is now confirmed as permanent. No reversal will occur. The full amount of GBP 2,340.00 has been recovered on Marcus Webb\u2019s behalf.\n\nInterContinental Zurich\u2019s bank accepted the chargeback on 18 March 2026 without filing a challenge.\n\nCASE CLOSED\n\nThis case is now closed. No further action is required from WPP plc or Marcus Webb.\n\nIf you have any questions regarding this matter, please do not hesitate to contact me.\n\nKind regards,\n\nDavid Mensah\nSenior Card Consultant \u2014 Commercial Cards\nHSBC Bank plc\ndavid.mensah@hsbc.com | Direct: +44 20 7991 8200"
 }
 },
 {
 id: "dr1-art-13",
 type: "file",
 label: "CRM Case Log",
 pdfPath: "/data/DR1_CRM_Case_Log.pdf"
 }
 ]
 }
 ]; // end steps array

 // Register in processes.json
 const processes = readJson(PROCESSES_FILE);
 const existingIdx = processes.findIndex(p => p.id === PROCESS_ID);
 const caseEntry = {
 id: PROCESS_ID,
 name: CASE_NAME,
 category: "Dispute Resolution",
 stockId: PROCESS_ID,
 status: "In Progress",
 client: "WPP plc (UK)",
 cardholder: "Marcus Webb",
 process: "PA Email — Chargeback Filing (Hotel Cancellation)",
 sm: "David Mensah",
 pathway: "Dispute Intake → Reason Code Assessment → Evidence Assembly → MDR Filing → Merchant Accepts"
 };
 if (existingIdx !== -1) processes[existingIdx] = caseEntry;
 else processes.push(caseEntry);
 writeJson(PROCESSES_FILE, processes);

 // Run each step
 for (let i = 0; i < steps.length; i++) {
 const step = steps[i];
 // Write in-progress
 updateProcessLog(PROCESS_ID, {
  id: step.id,
  title: step.title_p,
  status: "in-progress",
  reasoning: [],
  artifacts: []
 });
 await updateProcessListStatus(PROCESS_ID, "In Progress", step.title_p);
 await delay(3000);

 // Write completed
 updateProcessLog(PROCESS_ID, {
  id: step.id,
  title: step.title_s,
  status: "done",
  reasoning: step.reasoning,
  artifacts: step.artifacts
 });
 await delay(1000);
 }

 // Final status
 await updateProcessListStatus(PROCESS_ID, "Done", "Resolved in HSBC's Favour");
 console.log(`${PROCESS_ID} complete.`);
})();
