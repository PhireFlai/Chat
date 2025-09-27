import React from 'react'
import ReactMarkdown from 'react-markdown'



const Message = ({ type, content, sender, createdAt, updatedAt, imageUrl, }) => {
    const isEdited = createdAt !== updatedAt;



    return (
        
        <div className="message">
            <div className="message-header">
                <span className="sender">{sender}</span>
            </div>

            {type === 'text' &&
                (<div className="message-content">
                    <ReactMarkdown
                        components={{
                            img: ({ node, ...props }) => <img style={{ maxWidth: '200px' } } {...props} />,
                        }}
                    >
                        {content}
                    </ReactMarkdown>
                </div>
                )
            }

            {type === 'image' &&
                (<div>
                    <img src={process.env.REACT_APP_API_URL + "/" + imageUrl}
                        alt={`rendered Image:${imageUrl}`}
                        style={{
                            width: "120px",
                            objectFit: 'cover',
                            boxShadow: '4px'
                        }} />
                </div>)
            }
            <span className="timestamp">
                {new Date(createdAt).toLocaleString()}
                {isEdited && <span className="edited"> (edited)</span>}
            </span>

        </div>

    );

}

export default Message