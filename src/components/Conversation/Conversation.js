import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Message from './Message';
import AddMessageForm from './AddMessageForm';
import { useParams } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
    messageStreamContainer: {
        display: 'flex',
        flexDirection: 'column'
    }
}));

const messagesData = [
    { text: 'Hello friend', isOwnMessage: true, id: 0 },
    { text: 'Why hello', isOwnMessage: false, id: 1 },
    { text: 'I am writing a very important message to you today on this historic day today', isOwnMessage: true, id: 2 },
    { text: '...', isOwnMessage: false, id: 3 },
    { text: 'Hello friend', isOwnMessage: true, id: 4 },
    { text: 'Why hello', isOwnMessage: false, id: 5 },
    { text: 'I am writing a very important message to you today on this historic day today', isOwnMessage: true, id: 6 },
    { text: '...', isOwnMessage: false, id: 7 },
    { text: 'Hello friend', isOwnMessage: true, id: 8 },
    { text: 'Why hello', isOwnMessage: false, id: 9 },
    { text: 'I am writing a very important message to you today on this historic day today', isOwnMessage: true, id: 10 },
    { text: '...', isOwnMessage: false, id: 11 }
];

const Conversation = () => {
    const { messageStreamContainer } = useStyles();
    const { id } = useParams();
    console.log(id);
    return (
        <>
            <div className={messageStreamContainer}>
                {messagesData.map(msg => (
                    <Message key={msg.id} text={msg.text} isOwnMessage={msg.isOwnMessage} />
                ))}
            </div>
            <AddMessageForm />
        </>
    );
}

export default Conversation;