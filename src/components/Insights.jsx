import React, { useState } from 'react';
import {
    Sparkles,
    ChevronDown,
    ChevronRight,
    Clock,
    CheckCircle2,
    XCircle,
    Lightbulb,
    ListOrdered,
    Layers,
    Filter,
    FileSearch,
} from 'lucide-react';

// Placeholder insights — replace with real content
const INSIGHTS_DATA = [
    {
        id: 'INS-HSBC-001',
        status: 'pending',
        status_text: 'Pending Approval',
        summary: {
            insight_title: 'Placeholder Insight 1',
            Description: 'This is a placeholder insight card. Replace with real content.',
        },
        filters: {
            'Filter 1': 'Value 1',
            'Filter 2': 'Value 2',
        },
        kb_change: {
            'Change Type': 'Placeholder',
            'Rule': 'Placeholder rule description',
        },
        impact: {
            'Risk Level': 'Low',
            'Time Saved': 'TBD',
        },
        evidence: {
            'Sample Size': '0 cases',
        },
        recommendation: {
            message: 'Placeholder recommendation.',
            reasoning_steps: [
                'Step 1: Placeholder reasoning',
                'Step 2: Placeholder reasoning',
            ],
        },
    },
    {
        id: 'INS-HSBC-002',
        status: 'pending',
        status_text: 'Pending Approval',
        summary: {
            insight_title: 'Placeholder Insight 2',
            Description: 'This is a placeholder insight card. Replace with real content.',
        },
        filters: {
            'Filter 1': 'Value 1',
        },
        kb_change: {
            'Change Type': 'Placeholder',
            'Rule': 'Placeholder rule description',
        },
        impact: {
            'Risk Level': 'Medium',
            'Time Saved': 'TBD',
        },
        evidence: {
            'Sample Size': '0 cases',
        },
        recommendation: {
            message: 'Placeholder recommendation.',
            reasoning_steps: [
                'Step 1: Placeholder reasoning',
            ],
        },
    },
    {
        id: 'INS-HSBC-003',
        status: 'pending',
        status_text: 'Pending Approval',
        summary: {
            insight_title: 'Placeholder Insight 3',
            Description: 'This is a placeholder insight card. Replace with real content.',
        },
        filters: {
            'Filter 1': 'Value 1',
        },
        kb_change: {
            'Change Type': 'Placeholder',
            'Rule': 'Placeholder rule description',
        },
        impact: {
            'Risk Level': 'Low',
            'Time Saved': 'TBD',
        },
        evidence: {
            'Sample Size': '0 cases',
        },
        recommendation: {
            message: 'Placeholder recommendation.',
            reasoning_steps: [
                'Step 1: Placeholder reasoning',
            ],
        },
    },
];

const statusConfig = {
    pending: {
        label: 'Pending Approval',
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-200',
        icon: Clock,
    },
    approved: {
        label: 'Approved',
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        icon: CheckCircle2,
    },
    rejected: {
        label: 'Rejected',
        bg: 'bg-red-50',
        text: 'text-red-700',
        border: 'border-red-200',
        icon: XCircle,
    },
};

const sections = [
    { key: 'steps', label: 'Steps', icon: ListOrdered },
    { key: 'pattern', label: 'Pattern', icon: Layers },
    { key: 'profile', label: 'Profile', icon: Filter },
    { key: 'evidence', label: 'Evidence', icon: FileSearch },
    { key: 'recommendation', label: 'Recommendation', icon: Lightbulb },
];

const renderDataGrid = (data) => {
    if (!data || Object.keys(data).length === 0) return null;
    return (
        <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
            {Object.entries(data).map(([key, value]) => (
                <div key={key} className="flex flex-col gap-0.5">
                    <span className="text-[12px] text-[#8f8f8f]">{key}</span>
                    <span className="text-[12px] text-[#171717] font-[500]">{value}</span>
                </div>
            ))}
        </div>
    );
};

const Insights = () => {
    const [expandedCard, setExpandedCard] = useState(null);
    const [expandedSections, setExpandedSections] = useState({});
    const [cardStatuses, setCardStatuses] = useState({});

    const toggleCard = (id) => {
        setExpandedCard(expandedCard === id ? null : id);
    };

    const toggleSection = (cardId, sectionKey) => {
        const key = `${cardId}-${sectionKey}`;
        setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const handleAction = (id, action) => {
        setCardStatuses((prev) => ({ ...prev, [id]: action }));
    };

    const getStatus = (insight) => {
        return cardStatuses[insight.id] || insight.status;
    };

    return (
        <div className="h-full overflow-y-auto">
            <div className="max-w-[820px] mx-auto px-6 py-8">
                {/* Header */}
                <div className="flex items-center gap-2.5 mb-1">
                    <Sparkles className="w-5 h-5 text-[#171717]" strokeWidth={1.5} />
                    <h1 className="text-[18px] font-[600] text-[#171717]">Insights</h1>
                </div>
                <p className="text-[13px] text-[#8f8f8f] mb-6 ml-[30px]">
                    AI-generated patterns and recommendations from processed cases
                </p>

                {/* Insight Cards */}
                <div className="space-y-4">
                    {INSIGHTS_DATA.map((insight) => {
                        const status = getStatus(insight);
                        const config = statusConfig[status] || statusConfig.pending;
                        const StatusIcon = config.icon;
                        const isExpanded = expandedCard === insight.id;

                        return (
                            <div
                                key={insight.id}
                                className="border border-[#f0f0f0] rounded-xl bg-white overflow-hidden transition-shadow hover:shadow-[0_1px_4px_rgba(0,0,0,0.04)]"
                            >
                                {/* Card Header */}
                                <button
                                    onClick={() => toggleCard(insight.id)}
                                    className="w-full text-left px-5 py-4 flex items-start gap-3"
                                >
                                    <div className="mt-0.5">
                                        {isExpanded ? (
                                            <ChevronDown className="w-4 h-4 text-[#8f8f8f]" />
                                        ) : (
                                            <ChevronRight className="w-4 h-4 text-[#8f8f8f]" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2.5 mb-1.5">
                                            <span className="text-[11px] text-[#8f8f8f] font-mono">
                                                {insight.id}
                                            </span>
                                            <span
                                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-[550] border ${config.bg} ${config.text} ${config.border}`}
                                            >
                                                <StatusIcon className="w-3 h-3" />
                                                {config.label}
                                            </span>
                                        </div>
                                        <h3 className="text-[14px] font-[600] text-[#171717] mb-1">
                                            {insight.summary.insight_title}
                                        </h3>
                                        {!isExpanded && (
                                            <p className="text-[12px] text-[#8f8f8f] line-clamp-2">
                                                {insight.summary.Description}
                                            </p>
                                        )}
                                    </div>
                                </button>
                                {/* Expanded Content */}
                                {isExpanded && (
                                    <div className="px-5 pb-5 border-t border-[#f5f5f5]">
                                        {/* Full description */}
                                        <p className="text-[13px] text-[#383838] leading-relaxed mt-4 mb-5">
                                            {insight.summary.Description}
                                        </p>

                                        {/* Collapsible Sections */}
                                        <div className="space-y-1">
                                            {sections.map(({ key, label, icon: SectionIcon }) => {
                                                const sectionKey = `${insight.id}-${key}`;
                                                const isOpen = expandedSections[sectionKey];

                                                let content = null;
                                                if (key === 'steps') {
                                                    content = (
                                                        <ol className="list-decimal list-inside space-y-1.5 text-[12px] text-[#383838]">
                                                            {insight.recommendation.reasoning_steps.map((step, i) => (
                                                                <li key={i}>{step}</li>
                                                            ))}
                                                        </ol>
                                                    );
                                                } else if (key === 'pattern') {
                                                    content = renderDataGrid(insight.kb_change);
                                                } else if (key === 'profile') {
                                                    content = renderDataGrid(insight.filters);
                                                } else if (key === 'evidence') {
                                                    content = (
                                                        <div className="space-y-4">
                                                            {renderDataGrid(insight.evidence)}
                                                            {Object.keys(insight.impact).length > 0 && (
                                                                <div className="pt-3 border-t border-[#f5f5f5]">
                                                                    <span className="text-[11px] font-[600] text-[#8f8f8f] uppercase tracking-wide">
                                                                        Impact
                                                                    </span>
                                                                    <div className="mt-2">
                                                                        {renderDataGrid(insight.impact)}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                } else if (key === 'recommendation') {
                                                    content = (
                                                        <div className="flex items-start gap-2">
                                                            <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                                                            <p className="text-[13px] text-[#171717] font-[500]">
                                                                {insight.recommendation.message}
                                                            </p>
                                                        </div>
                                                    );
                                                }

                                                return (
                                                    <div key={key}>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                toggleSection(insight.id, key);
                                                            }}
                                                            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#fafafa] transition-colors text-left"
                                                        >
                                                            {isOpen ? (
                                                                <ChevronDown className="w-3.5 h-3.5 text-[#8f8f8f]" />
                                                            ) : (
                                                                <ChevronRight className="w-3.5 h-3.5 text-[#8f8f8f]" />
                                                            )}
                                                            <SectionIcon className="w-3.5 h-3.5 text-[#8f8f8f]" />
                                                            <span className="text-[12px] font-[550] text-[#383838]">
                                                                {label}
                                                            </span>
                                                        </button>
                                                        {isOpen && (
                                                            <div className="ml-[38px] mt-1 mb-3">
                                                                {content}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Action Buttons (Pending only) */}
                                        {status === 'pending' && (
                                            <div className="flex items-center gap-3 mt-5 pt-4 border-t border-[#f5f5f5]">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleAction(insight.id, 'rejected');
                                                    }}
                                                    className="px-4 py-2 text-[12px] font-[550] text-[#383838] bg-white border border-[#e5e5e5] rounded-lg hover:bg-[#fafafa] transition-colors"
                                                >
                                                    Reject
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleAction(insight.id, 'approved');
                                                    }}
                                                    className="px-4 py-2 text-[12px] font-[550] text-white bg-[#171717] rounded-lg hover:bg-[#2a2a2a] transition-colors"
                                                >
                                                    Approve & Update KB
                                                </button>
                                            </div>
                                        )}

                                        {/* Post-action footer */}
                                        {status === 'approved' && (
                                            <div className="mt-4 pt-3 border-t border-[#f5f5f5] flex items-center gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                                <span className="text-[12px] text-emerald-700 font-[500]">
                                                    Approved — Knowledge base updated
                                                </span>
                                            </div>
                                        )}
                                        {status === 'rejected' && (
                                            <div className="mt-4 pt-3 border-t border-[#f5f5f5] flex items-center gap-2">
                                                <XCircle className="w-4 h-4 text-red-500" />
                                                <span className="text-[12px] text-red-600 font-[500]">
                                                    Rejected — No changes applied
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Insights;
