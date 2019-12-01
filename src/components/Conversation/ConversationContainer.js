import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { CurrentUserContext } from '../CurrentUserContext';
import { getConversation } from '../../Api';
import Conversation from './Conversation';
import LoadingSpinner from '../LoadingSpinner';
import { Redirect } from 'react-router-dom';

const ConversationContainer = () => {

    const { id } = useParams();
    const { isSignedIn, currentUserId } = useContext(CurrentUserContext);
    const [ conversation, setConversation ] = useState(null);
    const [ isLoading, setIsLoading ] = useState(false);

    const updateConversation = useCallback((conversation) => {
        const formattedConversation = {
            ...conversation,
            messages: conversation.messages.map(msg => ({
                ...msg,
                isOwnMessage: msg.author === currentUserId
            }))
        };
        setConversation(formattedConversation);
    }, [ currentUserId ]);

    useEffect(() => {
        if (!isSignedIn) return;
        const storeConversation = async () => {
            try {
                const response = await getConversation(id);
                updateConversation(response.conversation)
            } catch (error) {
                console.log(error);
            }
        }
        storeConversation();
    }, [ isSignedIn, currentUserId, id ]);


    if (!isSignedIn) {
        return <Redirect to="/sign-in" />
    } else if (isLoading || !conversation) {
        return <LoadingSpinner />
    } else {
        return <Conversation 
            conversation={conversation}
            updateConversation={updateConversation}
        />
    }
    
}

export default ConversationContainer;