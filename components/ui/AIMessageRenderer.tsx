
import React, { useState, useMemo } from 'react';
import { ChevronDownIcon, ForkKnifeIcon, LeafIcon, LightbulbIcon, InfoIcon, AlertTriangleIcon, DrumstickIcon, SpiceJarIcon, ShoppingBagIcon, BookOpenIcon, GrainIcon, CheckCircleIcon } from './Icons';

// Helper to convert markdown bold (**text**) to HTML <strong>
const boldify = (text: string) => {
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
};

const getIconForCategory = (category: string): React.ReactNode => {
    const lowerCategory = category.toLowerCase();
    if (lowerCategory.includes('protein')) return <DrumstickIcon className="w-5 h-5 text-red-500" />;
    if (lowerCategory.includes('vegetable') || lowerCategory.includes('greens')) return <LeafIcon className="w-5 h-5 text-green-500" />;
    if (lowerCategory.includes('grain') || lowerCategory.includes('carb') || lowerCategory.includes('base')) return <GrainIcon className="w-5 h-5 text-yellow-500" />;
    if (lowerCategory.includes('flavor') || lowerCategory.includes('spice') || lowerCategory.includes('seasoning')) return <SpiceJarIcon className="w-5 h-5 text-orange-500" />;
    return <ForkKnifeIcon className="w-5 h-5 text-gray-500" />;
};

const AnalysisPoint: React.FC<{ line: string }> = ({ line }) => {
    const match = line.match(/^\*\s*(WARN|INFO|GOOD):\s*([\s\S]*)/i);
    if (!match) return <p className="text-sm" dangerouslySetInnerHTML={{ __html: boldify(line) }} />;

    const [, type, content] = match;
    const lowerType = type.toLowerCase();

    const config = {
        warn: { icon: <AlertTriangleIcon className="w-5 h-5 text-red-500" />, color: 'text-red-500' },
        info: { icon: <InfoIcon className="w-5 h-5 text-blue-500" />, color: 'text-blue-500' },
        good: { icon: <CheckCircleIcon className="w-5 h-5 text-green-500" />, color: 'text-green-500' },
    }[lowerType] || { icon: <InfoIcon className="w-5 h-5 text-blue-500" />, color: 'text-blue-500' };

    return (
        <div className="flex items-start gap-3 my-2.5 text-sm">
            <div className="flex-shrink-0 mt-0.5">{config.icon}</div>
            <p className="text-gray-800 dark:text-gray-200" dangerouslySetInnerHTML={{ __html: boldify(content) }} />
        </div>
    );
};


const AlternativeCard: React.FC<{ title: string; content: string }> = ({ title, content }) => {
    const [isOpen, setIsOpen] = useState(true);

    const parsedContent = useMemo(() => {
        const lines = content.trim().split('\n').filter(l => l.trim() !== '');
        
        const whyMatch = content.match(/\*\*Why it's better for you:\*\*\s*([\s\S]*?)(?=\n\*|\n#|\n_|$)/);
        const whyText = whyMatch ? whyMatch[1].trim() : '';

        const descriptionContent = whyText ? content.substring(0, whyMatch.index).trim() : content;
        const descriptionLines = descriptionContent.split('\n').filter(l => l.trim() !== '' && !l.trim().startsWith('*'));
        const description = descriptionLines.join(' ');
        
        const categoryItems = content.split('\n').filter(l => l.trim().startsWith('* '));
        
        return { whyText, description, categoryItems };
    }, [content]);

    return (
        <div className="bg-gray-50 dark:bg-gray-800/50 border dark:border-gray-700 rounded-lg shadow-sm overflow-hidden my-2">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-3 text-left"
            >
                <div className="flex items-center gap-2">
                    <LightbulbIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <h4 className="font-bold text-gray-800 dark:text-gray-100 text-sm" dangerouslySetInnerHTML={{ __html: boldify(title) }} />
                </div>
                <ChevronDownIcon className={`w-5 h-5 text-gray-500 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="p-3 border-t dark:border-gray-700 space-y-3">
                    <p className="text-xs text-gray-600 dark:text-gray-400" dangerouslySetInnerHTML={{ __html: boldify(parsedContent.description) }} />
                    
                    {parsedContent.whyText && (
                        <div className="p-2 bg-green-100/50 dark:bg-green-900/40 rounded-md text-xs">
                            <p className="font-semibold text-green-800 dark:text-green-200">Why it's better for you:</p>
                            <p className="text-green-700 dark:text-green-300" dangerouslySetInnerHTML={{ __html: boldify(parsedContent.whyText) }} />
                        </div>
                    )}

                    {parsedContent.categoryItems.length > 0 && (
                        <div className="space-y-1.5 text-xs">
                            {parsedContent.categoryItems.map((item, index) => {
                                const [category, ...rest] = item.substring(2).split(':*');
                                const text = rest.join(':*').trim();
                                return (
                                    <div key={index} className="flex items-start gap-2">
                                        <div className="flex-shrink-0 mt-0.5">{getIconForCategory(category)}</div>
                                        <p className="text-gray-700 dark:text-gray-300"><strong className="dark:text-gray-100">{category}:</strong> <span dangerouslySetInnerHTML={{ __html: boldify(text) }} /></p>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                    
                    <div className="flex gap-2 pt-2">
                        <button onClick={() => alert(`Adding ingredients for ${title} to shopping list...`)} className="flex-1 flex items-center justify-center gap-2 px-2 py-1.5 text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200 rounded-md hover:bg-blue-200 dark:hover:bg-blue-900">
                            <ShoppingBagIcon className="w-4 h-4" />
                            Add to List
                        </button>
                        <button onClick={() => alert(`Showing recipe for ${title}...`)} className="flex-1 flex items-center justify-center gap-2 px-2 py-1.5 text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200 rounded-md hover:bg-blue-200 dark:hover:bg-blue-900">
                            <BookOpenIcon className="w-4 h-4" />
                            View Recipe
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};


const MainCollapsible: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="bg-white dark:bg-gray-800 border dark:border-gray-600 rounded-lg shadow-sm overflow-hidden my-2">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 text-left"
            >
                <h3 className="font-bold text-gray-800 dark:text-gray-100 text-sm flex items-center">
                     <span className="text-lg mr-2">🌿</span>
                    <span dangerouslySetInnerHTML={{ __html: boldify(title) }} />
                </h3>
                <ChevronDownIcon className={`w-5 h-5 text-gray-500 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="p-1">
                    {children}
                </div>
            )}
        </div>
    );
};

interface AIMessageRendererProps {
    text: string;
}

export const AIMessageRenderer: React.FC<AIMessageRendererProps> = ({ text }) => {
    const parsedSections = useMemo(() => {
        const lines = text.split('\n');
        const sections: { type: string; title?: string; content: string[] }[] = [];
        let currentSection: { type: string; title?: string; content: string[] } | null = null;

        for (const line of lines) {
            if (line.trim().startsWith('###')) {
                if (currentSection) sections.push(currentSection);
                currentSection = { type: 'alternatives_header', title: line.replace(/#+\s*/, '').trim(), content: [] };
            } else if (line.trim().startsWith('####')) {
                if (currentSection) sections.push(currentSection);
                currentSection = { type: 'alternative_card', title: line.replace(/#+\s*/, '').trim(), content: [] };
            } else if (line.trim().startsWith('* WARN:') || line.trim().startsWith('* INFO:') || line.trim().startsWith('* GOOD:')) {
                if (currentSection && currentSection.type !== 'analysis_points') {
                    sections.push(currentSection);
                    currentSection = null;
                }
                if (!currentSection) {
                    currentSection = { type: 'analysis_points', content: [] };
                }
                currentSection.content.push(line.trim());
            } else if (line.trim().startsWith('_') && line.trim().endsWith('_') && line.trim().length > 2) {
                 if (currentSection) sections.push(currentSection);
                 sections.push({ type: 'important_note', content: [line.trim().slice(1, -1)] });
                 currentSection = null;
            }
            else if (currentSection) {
                currentSection.content.push(line);
            } else {
                if (sections.length > 0 && sections[sections.length - 1].type === 'paragraph') {
                    sections[sections.length - 1].content.push(line);
                } else if (line.trim() !== '') {
                    sections.push({ type: 'paragraph', content: [line] });
                }
            }
        }
        if (currentSection) sections.push(currentSection);

        const groupedSections: any[] = [];
        let alternativesGroup: any = null;

        for (const section of sections) {
            if (section.type === 'alternatives_header') {
                if (alternativesGroup) groupedSections.push(alternativesGroup);
                alternativesGroup = { type: 'alternatives_group', title: section.title, intro: section.content.join('\n'), cards: [] };
            } else if (section.type === 'alternative_card' && alternativesGroup) {
                alternativesGroup.cards.push({ title: section.title, content: section.content.join('\n') });
            } else {
                if (alternativesGroup) {
                    groupedSections.push(alternativesGroup);
                    alternativesGroup = null;
                }
                groupedSections.push(section);
            }
        }
        if (alternativesGroup) groupedSections.push(alternativesGroup);

        return groupedSections;
    }, [text]);

    return (
        <div className="space-y-2">
            {parsedSections.map((section, index) => {
                switch (section.type) {
                    case 'analysis_points':
                        return <div key={index}>{section.content.map((line: string, i: number) => <AnalysisPoint key={i} line={line} />)}</div>;
                    
                    case 'alternatives_group':
                        return (
                            <MainCollapsible key={index} title={section.title}>
                                <p className="text-xs text-gray-600 dark:text-gray-400 px-3 pb-1" dangerouslySetInnerHTML={{ __html: boldify(section.intro) }} />
                                {section.cards.map((card: any, i: number) => (
                                    <AlternativeCard key={i} title={card.title} content={card.content} />
                                ))}
                            </MainCollapsible>
                        );

                    case 'important_note':
                        return (
                             <div key={index} className="p-3 my-2 bg-yellow-100/50 dark:bg-yellow-900/40 border-l-4 border-yellow-500 rounded-r-lg">
                                <p className="text-xs text-yellow-800 dark:text-yellow-200" dangerouslySetInnerHTML={{ __html: boldify(section.content[0]) }} />
                            </div>
                        );
                    
                    case 'paragraph':
                         return <p key={index} className="text-sm" dangerouslySetInnerHTML={{ __html: boldify(section.content.join('\n')) }} />;

                    default:
                        return <p key={index} className="text-sm" dangerouslySetInnerHTML={{ __html: boldify(section.content.join('\n')) }} />;
                }
            })}
        </div>
    );
};
