import React from 'react';

const FormattedComment = ({ content, className = "" }) => {
    // Split content by line breaks and format
    const formatContent = (text) => {
        if (!text) return '';

        // Split by line breaks (both \n and actual line breaks)
        const lines = text.split(/\n/);

        return lines.map((line, index) => {
            // Trim whitespace but preserve intentional spacing
            const trimmedLine = line.trim();

            // If line is empty, add a line break
            if (trimmedLine === '') {
                return <br key={index} />;
            }

            // If line ends with comma, add line break after
            if (trimmedLine.endsWith(',')) {
                return (
                    <span key={index}>
                        {trimmedLine}
                        <br />
                    </span>
                );
            }

            // Regular line
            return (
                <span key={index}>
                    {trimmedLine}
                    {index < lines.length - 1 && <br />}
                </span>
            );
        });
    };

    // Check if content looks like poetry (has line breaks or specific patterns)
    const isPoetry = content && (
        content.includes('\n') ||
        content.includes('，') ||
        content.includes('。') ||
        content.split('\n').length > 2
    );

    return (
        <div className={`${isPoetry ? 'font-serif italic' : ''} ${className}`}>
            {isPoetry ? (
                <div className="whitespace-pre-line leading-relaxed">
                    {content}
                </div>
            ) : (
                <div className="whitespace-pre-line">
                    {formatContent(content)}
                </div>
            )}
        </div>
    );
};

export default FormattedComment;
