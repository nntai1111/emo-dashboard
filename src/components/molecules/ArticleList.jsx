import React from 'react';
import ArticleCard from '../atoms/ArticleCard';

const ArticleList = ({ modules, onSelectModule }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mt-12">
            {modules.map((module) => (
                <ArticleCard
                    key={module.id}
                    item={module}
                    onClick={() => onSelectModule(module)}
                    isModule
                />
            ))}
        </div>
    );
};

export default ArticleList;
