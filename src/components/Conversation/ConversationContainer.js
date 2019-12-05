import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { CurrentUserContext } from '../CurrentUserContext';
import { SocketContext } from '../SocketContext';
import { getConversation } from '../../Api';
import Conversation from './Conversation';
import LoadingSpinner from '../LoadingSpinner';
import { Redirect } from 'react-router-dom';
import socketActions from '../../socketActions';

const ConversationContainer = () => {

    const { id } = useParams();
    const { isSignedIn, currentUserId } = useContext(CurrentUserContext);
    const [ conversation, setConversation ] = useState(null);
    const [ isLoading, setIsLoading ] = useState(false);

    const { emit, on } = useContext(SocketContext);

    const updateConversation = useCallback((conversation) => {
        const formattedConversation = {
            ...conversation,
            messages: conversation.messages.map(msg => ({
                ...msg,
                isOwnMessage: msg.author._id === currentUserId
            }))
        };
        setConversation(formattedConversation);
    }, [ currentUserId ]);

    useEffect(() => {
        if (isSignedIn) {
            emit(socketActions.getConversationRequest, id);
            const off = on(socketActions.getConversationResponse, data => {
                console.log(data);
                const { conversation } = data;
                updateConversation(conversation);
            });
            return off;
        }
    }, [ isSignedIn, id ]);

    useEffect(() => {
        const off = on(socketActions.sendMessageResponse, data => {
            const { conversation } = data;
            updateConversation(conversation);
        });
        return off;
    }, [ isSignedIn, id ]);

    useEffect(() => {
        const off = on(socketActions.pushConversation, data => {
            const { conversation } = data;
            updateConversation(conversation);
        });
        return off;
    }, [ isSignedIn, id ]);

    // useEffect(() => {
    //     if (!isSignedIn) return;
    //     (async () => {
    //         try {
    //             const response = await getConversation(id);
    //             updateConversation(response.data.conversation);
    //         } catch (error) {
    //             console.log(error);
    //         }
    //     })();
    // }, [ isSignedIn, id ]);


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
