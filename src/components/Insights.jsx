import React, { useState } from 'react';
import {
    ChevronDown, ChevronRight, CheckCircle2, Edit3, X, Save,
    ListOrdered, Layers, User, FileText, TrendingUp, Lightbulb, Clock,
} from 'lucide-react';

// ─── Data ────────────────────────────────────────────────────────────

const INSIGHTS_DATA = [
  {
    id: 'INS-HSBC-001',
    status: 'Pending Approval',
    severity: 'high',
    direction: 'Service Mgmt \u2192 Disputes',
    category: 'Active Cross-Process',
    title: "PAs requesting merchant credit status updates in Service Mgmt \u2014 credits never posting, converting to chargebacks 18 days later",
    description: "Service Management is fielding \u2018where is my refund?\u2019 queries from Programme Administrators who were told by the merchant that a credit is being processed. In 41% of these cases, that credit never posts to the card account. The same transaction then surfaces as a formal chargeback 2\u20133 weeks later \u2014 with the PA required to restart the entire evidence-gathering process from scratch, having lost valuable days in the filing window.",
    steps: [
      "Record the merchant\u2019s credit promise in the case log at point of PA query",
      "Set a mandatory 10-day auto-follow-up on all merchant credit status tickets",
      "If credit has not posted by Day 10, auto-generate a pre-populated dispute packet (transaction record, merchant contact log, credit promise documentation, PA correspondence)",
      "Route to Disputes as a \u2018Credit Non-Fulfilment \u2014 Fast Track\u2019 case with the filing clock flagged",
      "Disputes to accept fast-tracked cases with evidence pre-attached \u2014 skip standard PA intake interview",
      "File under Reason Code 4853 (Services Not Rendered / Credit Not Processed) immediately",
    ],
    pattern: [
      { label: 'Current Process', value: 'PA queries merchant credit status; SM checks Auth Platform; closes ticket if credit shows processing. No follow-up triggered.' },
      { label: 'Change Type', value: 'Active Cross-Process: Service Mgmt \u2192 Disputes' },
      { label: 'Ingestion Rule', value: 'Record merchant credit promise; set 10-day auto-follow-up; auto-generate dispute packet on Day 10 if unpaid' },
      { label: 'Direction', value: 'Service Mgmt \u2192 Disputes' },
    ],
    profile: [
      { label: 'Queries Raised', value: '387 (Q4 2025)' },
      { label: 'Conversion Rate', value: '41% \u2014 159 of 387' },
      { label: 'Cycle Time Gap', value: '34 days vs. 22 days standard' },
      { label: 'Filing Window', value: '26 days elapsed at filing' },
    ],
    evidence: [
      { label: 'Example', value: '387 credit queries raised in Q4 2025; 41% became formal chargebacks within 18 days' },
      { label: 'Root Cause', value: 'No auto-follow-up trigger; merchant credit promises not documented in any shared system' },
      { label: 'Test Result', value: '67% of converted cases traced to 5 known slow-refund merchants (3 SaaS, 2 travel)' },
      { label: 'Trigger Case', value: 'INS-HSBC-001 \u2014 Q4 2025 cohort analysis across commercial card programmes' },
    ],
    impact: [
      { label: 'Financial Impact', value: '\u00a3420K/year recovery acceleration' },
      { label: 'Scope', value: 'Cross-process: Service Mgmt + Disputes' },
      { label: 'Risk Level', value: 'High \u2014 18-day blind spot in active portfolio' },
      { label: 'Projected Benefit', value: 'Cycle time 34 days \u2192 14 days on converted cases' },
    ],
    recommendation: "Record merchant credit promises at the point of the PA query and set a mandatory 10-day follow-up. If the credit has not posted, auto-generate a pre-populated dispute packet and route to Disputes as a fast-track case \u2014 eliminating the 18-day blind spot that currently converts unresolved service queries into delayed chargebacks.",
  },
  {
    id: 'INS-HSBC-003',
    status: 'Pending Approval',
    severity: 'high',
    direction: 'Disputes \u2192 Service Mgmt',
    category: 'Efficiency \u2014 Parallel Intelligence',
    title: "Dispute resolution data reveals which merchants respond to PA direct outreach vs. which require formal chargebacks \u2014 Service Mgmt is escalating cases to Disputes that a well-briefed PA could resolve in 3 days",
    description: "The Disputes process has accumulated resolution data across hundreds of merchants \u2014 which merchants issue credits quickly when a PA contacts them using a documented pathway, which ones have internal refund portals, which ones stonewall and require a formal Mastercard chargeback. This intelligence sits locked inside the Disputes workflow and is never surfaced to Service Management. When a PA raises a merchant query, SM escalates to Disputes after 7 days by default \u2014 including cases where Disputes will simply brief the PA on how to contact the merchant directly, the identical step SM could have facilitated at Day 2.",
    steps: [
      "Build a shared \u2018Merchant Resolution Intelligence Registry\u2019 \u2014 populated and maintained by Disputes from case resolution data",
      "Tag each merchant: \u2018PA Direct Resolution \u2014 High Probability\u2019, \u2018Formal Chargeback Required\u2019, or \u2018Contested \u2014 Case-by-Case\u2019",
      "For each PA Direct Resolution merchant, document: contact route (billing email, refund portal URL, or escalation path), required documentation, and language effective in prior cases",
      "Amend Service Management SOP: before escalating any merchant query past Day 2, check the Registry",
      "For PA Direct Resolution merchants, provide the PA with the full briefing pack and set a 5-day PA-led resolution window",
      "Escalate to Disputes only if PA direct contact fails within that window, or if the merchant is tagged \u2018Formal Chargeback Required\u2019",
    ],
    pattern: [
      { label: 'Current Process', value: 'All unresolved merchant queries escalated to Disputes after 7 days. No merchant behaviour data available to Service Management.' },
      { label: 'Change Type', value: 'Efficiency \u2014 Parallel Intelligence: Disputes \u2192 Service Mgmt' },
      { label: 'Ingestion Rule', value: 'Before escalating past Day 2, check Merchant Resolution Registry; brief PA on direct contact pathway if available' },
      { label: 'Direction', value: 'Disputes \u2192 Service Mgmt' },
    ],
    profile: [
      { label: 'Merchants Tracked', value: '1,847 unique merchants' },
      { label: 'Direct Resolution', value: '312 merchants (17%)' },
      { label: 'Deflection Rate', value: '74% resolved via PA briefing' },
      { label: 'Cycle Time Gap', value: '12 days vs. 3 days PA-led' },
    ],
    evidence: [
      { label: 'Example', value: '312 merchants yield credit within 5 days when PA uses documented direct contact pathway \u2014 no chargeback required' },
      { label: 'Root Cause', value: 'Merchant intelligence locked in Disputes workflow \u2014 never surfaced to Service Management or the PA' },
      { label: 'Test Result', value: '74% of escalated cases on direct-resolution merchants were resolved by Disputes briefing the PA \u2014 the identical step SM could have taken at Day 2' },
      { label: 'Trigger Case', value: 'INS-HSBC-003 \u2014 Q4 2025 merchant escalation analysis across commercial card portfolio' },
    ],
    impact: [
      { label: 'Financial Impact', value: '\u00a3290K/year efficiency gain' },
      { label: 'Scope', value: 'Cross-process: Disputes \u2192 Service Mgmt' },
      { label: 'Risk Level', value: 'High \u2014 9-day cycle gap per case, 230 cases/quarter' },
      { label: 'Projected Benefit', value: '230 cases/quarter deflected to PA-led resolution in 3 days vs. 12' },
    ],
    recommendation: "Build a Merchant Resolution Intelligence Registry, maintained by Disputes, that surfaces PA-contact pathways back to Service Management. Before any case is escalated to Disputes, SM checks the Registry \u2014 if the merchant has a documented PA-led resolution path, the PA is briefed and given 5 days to resolve it directly. Disputes escalation is reserved for cases where PA contact has genuinely failed or the merchant requires formal Mastercard network intervention.",
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────

const statusStyle = (s) => s === 'Approved'
  ? { background: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0' }
  : { background: '#fef9ee', color: '#b45309', border: '1px solid #fde68a' };

const severityStyle = (s) => s === 'high'
  ? { background: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca' }
  : { background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' };

const directionStyle = () => ({ background: '#ede9fe', color: '#5b21b6', border: '1px solid #ddd6fe' });

// ─── Section Header ───────────────────────────────────────────────────

const SectionHeader = ({ icon: Icon, label, iconColor }) => (
  <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: 20, marginTop: 20 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
      <Icon size={14} color={iconColor || '#9ca3af'} />
      <span style={{
        fontSize: 11, fontWeight: 700, color: '#9ca3af',
        letterSpacing: '0.1em', textTransform: 'uppercase',
        fontFamily: 'Inter, sans-serif',
      }}>
        {label}
      </span>
    </div>
  </div>
);

// ─── KV Grid ─────────────────────────────────────────────────────────

const KVGrid = ({ rows, editing, editValues, onEdit }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 0 }}>
    {rows.map((row, i) => (
      <React.Fragment key={i}>
        <div style={{
          gridColumn: '1',
          fontSize: 12, color: '#9ca3af', fontWeight: 500,
          padding: '10px 16px 10px 0',
          borderBottom: '1px solid #f9fafb',
          fontFamily: 'Inter, sans-serif',
          alignSelf: 'start',
        }}>
          {row.label}
        </div>
        <div style={{
          gridColumn: '2',
          fontSize: 13, color: '#111827', fontWeight: 600,
          padding: '10px 24px 10px 0',
          borderBottom: '1px solid #f9fafb',
          textAlign: 'right',
          fontFamily: 'Inter, sans-serif',
          lineHeight: 1.5,
        }}>
          {editing ? (
            <textarea
              value={editValues[i] || row.value}
              onChange={e => onEdit && onEdit(i, e.target.value)}
              style={{
                width: '100%', padding: 6, borderRadius: 6, border: '1px solid #d1d5db',
                fontSize: 12, fontFamily: 'Inter, sans-serif', resize: 'vertical', minHeight: 50,
                textAlign: 'right', color: '#111827',
              }}
            />
          ) : row.value}
        </div>
        {rows[i + 1] && (i + 1) % 1 === 0 ? null : null}
      </React.Fragment>
    ))}
  </div>
);

// ─── KV 2x2 Grid (label left, value right, two per row) ─────────────

const KV2x2 = ({ rows, editing, editValues, onEdit }) => (
  <div>
    {Array.from({ length: Math.ceil(rows.length / 2) }, (_, ri) => {
      const left = rows[ri * 2];
      const right = rows[ri * 2 + 1];
      return (
        <div key={ri} style={{
          display: 'grid', gridTemplateColumns: '140px 1fr 140px 1fr',
          gap: 0, borderBottom: '1px solid #f9fafb',
          alignItems: 'start',
        }}>
          {/* Left label */}
          <div style={{ fontSize: 12, color: '#9ca3af', fontWeight: 500, padding: '12px 12px 12px 0', fontFamily: 'Inter, sans-serif' }}>
            {left.label}
          </div>
          {/* Left value */}
          <div style={{ fontSize: 13, color: '#111827', fontWeight: 600, padding: '12px 24px 12px 0', fontFamily: 'Inter, sans-serif', lineHeight: 1.5 }}>
            {editing ? (
              <textarea
                value={(editValues && editValues[ri * 2]) || left.value}
                onChange={e => onEdit && onEdit(ri * 2, e.target.value)}
                style={{ width: '100%', padding: 6, borderRadius: 6, border: '1px solid #d1d5db', fontSize: 12, fontFamily: 'Inter, sans-serif', resize: 'vertical', minHeight: 48, color: '#111827' }}
              />
            ) : left.value}
          </div>
          {/* Right label */}
          {right ? (
            <>
              <div style={{ fontSize: 12, color: '#9ca3af', fontWeight: 500, padding: '12px 12px 12px 0', fontFamily: 'Inter, sans-serif' }}>
                {right.label}
              </div>
              <div style={{ fontSize: 13, color: '#111827', fontWeight: 600, padding: '12px 0 12px 0', textAlign: 'right', fontFamily: 'Inter, sans-serif', lineHeight: 1.5 }}>
                {editing ? (
                  <textarea
                    value={(editValues && editValues[ri * 2 + 1]) || right.value}
                    onChange={e => onEdit && onEdit(ri * 2 + 1, e.target.value)}
                    style={{ width: '100%', padding: 6, borderRadius: 6, border: '1px solid #d1d5db', fontSize: 12, fontFamily: 'Inter, sans-serif', resize: 'vertical', minHeight: 48, textAlign: 'right', color: '#111827' }}
                  />
                ) : right.value}
              </div>
            </>
          ) : <div style={{ gridColumn: 'span 2' }} />}
        </div>
      );
    })}
  </div>
);

// ─── InsightCard ──────────────────────────────────────────────────────

const InsightCard = ({ insight, onApprove }) => {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({
    description: insight.description,
    steps: [...insight.steps],
    recommendation: insight.recommendation,
    pattern: insight.pattern.map(r => r.value),
    profile: insight.profile.map(r => r.value),
    evidence: insight.evidence.map(r => r.value),
    impact: insight.impact.map(r => r.value),
  });

  const isApproved = insight.status === 'Approved';

  const handleApproveClick = (e) => { e.stopPropagation(); onApprove(insight.id); };
  const handleEditClick = (e) => { e.stopPropagation(); setEditing(true); };
  const handleSave = (e) => { e.stopPropagation(); setEditing(false); };
  const handleCancel = (e) => {
    e.stopPropagation();
    setEditData({
      description: insight.description,
      steps: [...insight.steps],
      recommendation: insight.recommendation,
      pattern: insight.pattern.map(r => r.value),
      profile: insight.profile.map(r => r.value),
      evidence: insight.evidence.map(r => r.value),
      impact: insight.impact.map(r => r.value),
    });
    setEditing(false);
  };

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 16,
        border: '1px solid #f3f4f6',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        marginBottom: 16,
        overflow: 'hidden',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {/* ── Collapsed header ── */}
      <div
        onClick={() => !editing && setExpanded(!expanded)}
        style={{ padding: '24px 24px 0 24px', cursor: editing ? 'default' : 'pointer', userSelect: 'none' }}
      >
        {/* Top row: ID + status pill + edit + chevron */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <span style={{ fontSize: 12, color: '#9ca3af', fontWeight: 500, fontFamily: '"SF Mono", monospace' }}>
            {insight.id}
          </span>
          <span style={{
            fontSize: 12, fontWeight: 600, padding: '3px 12px',
            borderRadius: 20, display: 'inline-flex', alignItems: 'center', gap: 6,
            ...statusStyle(insight.status),
          }}>
            <Clock size={11} />
            {insight.status}
          </span>
          <div style={{ flex: 1 }} />
          {expanded && !isApproved && (
            <button
              onClick={handleEditClick}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                padding: '4px 12px', borderRadius: 8,
                border: '1px solid #e5e7eb', background: '#fff',
                color: '#6b7280', fontSize: 12, fontWeight: 500,
                cursor: 'pointer', fontFamily: 'Inter, sans-serif',
              }}
            >
              <Edit3 size={12} /> Edit
            </button>
          )}
          <div style={{ color: '#9ca3af' }}>
            {expanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </div>
        </div>

        {/* Title */}
        <h2 style={{ fontSize: 17, fontWeight: 700, color: '#111827', margin: '0 0 8px 0', lineHeight: 1.4 }}>
          {insight.title}
        </h2>

        {/* Description */}
        <p style={{
          fontSize: 13, color: '#6b7280', margin: '0 0 24px 0', lineHeight: 1.6,
          display: '-webkit-box', WebkitLineClamp: expanded ? 'unset' : 2,
          WebkitBoxOrient: 'vertical', overflow: expanded ? 'visible' : 'hidden',
        }}>
          {editing ? (
            <textarea
              value={editData.description}
              onChange={e => setEditData({ ...editData, description: e.target.value })}
              onClick={e => e.stopPropagation()}
              style={{
                width: '100%', minHeight: 80, padding: 10, borderRadius: 8,
                border: '1px solid #d1d5db', fontSize: 13, fontFamily: 'Inter, sans-serif',
                resize: 'vertical', color: '#374151', lineHeight: 1.6,
              }}
            />
          ) : insight.description}
        </p>
      </div>

      {/* ── Expanded body ── */}
      {expanded && (
        <div style={{ padding: '0 24px 24px 24px' }}>

          {/* Pills row */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 4, borderTop: '1px solid #f3f4f6', paddingTop: 16 }}>
            <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 10px', borderRadius: 20, textTransform: 'uppercase', ...severityStyle(insight.severity) }}>
              {insight.severity}
            </span>
            <span style={{ fontSize: 11, fontWeight: 500, padding: '2px 10px', borderRadius: 20, background: '#1f2937', color: '#f9fafb' }}>
              {insight.category}
            </span>
            <span style={{ fontSize: 11, fontWeight: 500, padding: '2px 10px', borderRadius: 20, ...directionStyle() }}>
              {insight.direction}
            </span>
          </div>

          {/* STEPS */}
          <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: 20, marginTop: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <ListOrdered size={14} color="#3b82f6" />
              <span style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Steps</span>
            </div>
            {editing ? (
              <textarea
                value={editData.steps.join('\n')}
                onChange={e => setEditData({ ...editData, steps: e.target.value.split('\n') })}
                style={{ width: '100%', minHeight: 120, padding: 10, borderRadius: 8, border: '1px solid #d1d5db', fontSize: 13, fontFamily: 'Inter, sans-serif', resize: 'vertical', color: '#374151' }}
              />
            ) : (
              <ol style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {insight.steps.map((step, i) => (
                  <li key={i} style={{ fontSize: 13, color: '#374151', lineHeight: 1.6 }}>{step}</li>
                ))}
              </ol>
            )}
          </div>

          {/* PATTERN */}
          <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: 20, marginTop: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Layers size={14} color="#9ca3af" />
              <span style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Pattern</span>
            </div>
            <KV2x2
              rows={insight.pattern}
              editing={editing}
              editValues={editData.pattern}
              onEdit={(i, v) => { const a = [...editData.pattern]; a[i] = v; setEditData({ ...editData, pattern: a }); }}
            />
          </div>

          {/* PROFILE */}
          <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: 20, marginTop: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <User size={14} color="#9ca3af" />
              <span style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Profile</span>
            </div>
            <KV2x2
              rows={insight.profile}
              editing={editing}
              editValues={editData.profile}
              onEdit={(i, v) => { const a = [...editData.profile]; a[i] = v; setEditData({ ...editData, profile: a }); }}
            />
          </div>

          {/* EVIDENCE */}
          <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: 20, marginTop: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <FileText size={14} color="#f59e0b" />
              <span style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Evidence</span>
            </div>
            <KV2x2
              rows={insight.evidence}
              editing={editing}
              editValues={editData.evidence}
              onEdit={(i, v) => { const a = [...editData.evidence]; a[i] = v; setEditData({ ...editData, evidence: a }); }}
            />
          </div>

          {/* IMPACT */}
          <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: 20, marginTop: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <TrendingUp size={14} color="#9ca3af" />
              <span style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Impact</span>
            </div>
            <KV2x2
              rows={insight.impact}
              editing={editing}
              editValues={editData.impact}
              onEdit={(i, v) => { const a = [...editData.impact]; a[i] = v; setEditData({ ...editData, impact: a }); }}
            />
          </div>

          {/* RECOMMENDATION */}
          <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: 20, marginTop: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Lightbulb size={14} color="#f59e0b" />
              <span style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Recommendation</span>
            </div>
            {editing ? (
              <textarea
                value={editData.recommendation}
                onChange={e => setEditData({ ...editData, recommendation: e.target.value })}
                style={{ width: '100%', minHeight: 80, padding: 10, borderRadius: 8, border: '1px solid #d1d5db', fontSize: 13, fontFamily: 'Inter, sans-serif', resize: 'vertical', color: '#374151', lineHeight: 1.6 }}
              />
            ) : (
              <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.7, margin: 0 }}>
                {insight.recommendation}
              </p>
            )}
          </div>

          {/* Footer */}
          <div style={{
            borderTop: '1px solid #f3f4f6', paddingTop: 16, marginTop: 20,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <p style={{ fontSize: 12, color: '#9ca3af', fontStyle: 'italic', margin: 0 }}>
              Approve to implement recommended process changes and update the knowledge base.
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              {editing ? (
                <>
                  <button onClick={handleSave} style={{ padding: '8px 18px', borderRadius: 8, border: 'none', background: '#111827', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                    Save
                  </button>
                  <button onClick={handleCancel} style={{ padding: '8px 18px', borderRadius: 8, border: '1px solid #e5e7eb', background: '#fff', color: '#374151', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    style={{ padding: '8px 18px', borderRadius: 8, border: '1px solid #e5e7eb', background: '#fff', color: '#374151', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
                  >
                    Reject
                  </button>
                  <button
                    onClick={handleApproveClick}
                    disabled={isApproved}
                    style={{
                      padding: '8px 18px', borderRadius: 8, border: 'none',
                      background: isApproved ? '#9ca3af' : '#111827',
                      color: '#fff', fontSize: 13, fontWeight: 600,
                      cursor: isApproved ? 'not-allowed' : 'pointer',
                      fontFamily: 'Inter, sans-serif',
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                    }}
                  >
                    <CheckCircle2 size={14} />
                    {isApproved ? 'Approved' : 'Approve & Update KB'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Main Insights Component ──────────────────────────────────────────

const Insights = () => {
  const [insights, setInsights] = useState(INSIGHTS_DATA);

  const handleApprove = (id) => {
    setInsights(prev => prev.map(ins => ins.id === id ? { ...ins, status: 'Approved' } : ins));
  };

  const total = insights.length;
  const highCount = insights.filter(i => i.severity === 'high').length;
  const pendingCount = insights.filter(i => i.status === 'Pending Approval').length;
  const approvedCount = insights.filter(i => i.status === 'Approved').length;

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', maxWidth: 1000, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#111827', margin: '0 0 6px 0' }}>
          Insights
        </h1>
        <p style={{ fontSize: 14, color: '#6b7280', margin: 0 }}>
          Identified patterns and recommended process changes across HSBC Commercial Cards. Review and approve to update the knowledge base.
        </p>
      </div>

      {/* Stats bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 32 }}>
        {[
          { label: 'Total Insights', value: total, bg: '#f9fafb', border: '#e5e7eb', col: '#111827', lc: '#6b7280' },
          { label: 'High Severity', value: highCount, bg: '#fef2f2', border: '#fecaca', col: '#991b1b', lc: '#991b1b' },
          { label: 'Pending Approval', value: pendingCount, bg: '#fefce8', border: '#fde68a', col: '#92400e', lc: '#92400e' },
          { label: 'Approved', value: approvedCount, bg: '#f0fdf4', border: '#bbf7d0', col: '#166534', lc: '#166534' },
        ].map(({ label, value, bg, border, col, lc }) => (
          <div key={label} style={{ background: bg, borderRadius: 10, padding: '14px 18px', border: `1px solid ${border}` }}>
            <div style={{ fontSize: 11, color: lc, textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em', marginBottom: 4 }}>{label}</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: col }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Cards */}
      {insights.map(insight => (
        <InsightCard key={insight.id} insight={insight} onApprove={handleApprove} />
      ))}
    </div>
  );
};

export default Insights;
