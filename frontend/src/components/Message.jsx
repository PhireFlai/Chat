import React from 'react'
import ReactMarkdown from 'react-markdown'

const Message = ({ type, content, sender, createdAt, updatedAt, imageUrl }) => {
    const isEdited = createdAt !== updatedAt;

    return (
        <div className="flex items-start gap-2.5 w-full">
            <div className="flex flex-col w-full max-w-full min-w-0">
                <div className="mb-1">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {sender}
                    </span>
                </div>

                {type === "text" && (
                    <div
                        className="text-gray-900 dark:text-gray-100 
                     px-4 py-2 rounded-2xl shadow-sm w-full min-w-0"
                    >
                        <ReactMarkdown
                            components={{
                                img: ({ node, ...props }) => (
                                    <img
                                        className="rounded-md shadow max-w-full h-auto"
                                        alt='markdownImage'
                                        {...props}
                                    />
                                ),
                            }}
                        >
                            {content}
                        </ReactMarkdown>
                    </div>
                )}

                {type === "image" && (
                    <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-2xl shadow-sm max-w-xs">
                        <img
                            className="rounded-md"
                            src={process.env.REACT_APP_API_URL + "/" + imageUrl}
                            alt={`rendered Image:${imageUrl}`}
                        />
                    </div>
                )}

                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 self-end">
                    {new Date(createdAt).toLocaleString()}
                    {isEdited && <span className="italic ml-1">(edited)</span>}
                </span>
            </div>
        </div>
    );
}

export default Message