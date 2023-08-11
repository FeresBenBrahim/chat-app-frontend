import './message.css'

function Message({ userID, createdBy, content }) {
    return <>
        <div className={`message-box ${createdBy === userID? 'right' : 'left'}`}>
            <p>{content}</p>
        </div>
    </>
}
export default Message;