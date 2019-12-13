import { actionTypes, reducer, initialState, optimisticMessagePlaceholderId } from './reducer';
import { fullConversation, message1, message2, user1, user2 } from '../../mockData';


it('returns the initial state', () => {
    expect(reducer(initialState, {})).toEqual(initialState);
});

it('handles fetchConversation', () => {
    expect(reducer(
        initialState, 
        { type: actionTypes.fetchConversation }
    ))
    .toEqual({
        isLoading: true,
        isShowingSnackbar: false,
        conversation: null
    });
});

it('handles storeConversation', () => {
    expect(reducer({
        isLoading: true,
        isShowingSnackbar: false,
        conversation: null
    }, {
        type: actionTypes.storeConversation,
        payload: {
            conversation: fullConversation
        }
    }))
    .toEqual({
        isLoading: false,
        isShowingSnackbar: false,
        conversation: fullConversation
    });
});

it('handles addMessage', () => {
    const withOptimisticPlaceholder = {
        ...fullConversation,
        messages: [
            ...fullConversation.messages,
            {
                ...message1,
                _id: optimisticMessagePlaceholderId
            }
        ]
    };
    const withReplacedOptimisticPlaceholder = {
        ...fullConversation,
        messages: [
            ...fullConversation.messages,
            message1
        ]
    };
    const withOptimisticPlaceholderAndNewMessage = {
        ...fullConversation,
        messages: [
            ...fullConversation.messages,
            {
                ...message1,
                _id: optimisticMessagePlaceholderId
            },
            message2
        ]
    };
    const withNewMessageFromOtherUser = {
        ...fullConversation,
        messages: [
            ...fullConversation.messages,
            message2
        ] 
    };
    
    // If no placeholder message from an optimistic update is present then it simply adds the
    // new message to the conversations messages array
    expect(reducer({
        isLoading: false,
        isShowingSnackbar: false,
        conversation: fullConversation
    }, {
        type: actionTypes.addMessage,
        payload: {
            conversationId: fullConversation._id,
            currentConversationId: fullConversation._id,
            message: message2,
            isOwnMessage: false,
        }
    }))
    .toEqual({
        isLoading: false,
        isShowingSnackbar: false,
        conversation: withNewMessageFromOtherUser
    });

    // If a placeholder message from an optimistic update is still present and the new message 
    // received is from the current user, then replace the placeholder message with the actual
    // message.
    expect(reducer({
        isLoading: false,
        isShowingSnackbar: false,
        conversation: withOptimisticPlaceholder
    }, {
        type: actionTypes.addMessage,
        payload: {
            conversationId: fullConversation._id,
            currentConversationId: fullConversation._id,
            message: message1,
            isOwnMessage: true,
        }
    }))
    .toEqual({
        isLoading: false,
        isShowingSnackbar: false,
        conversation: withReplacedOptimisticPlaceholder
    });

    // If a placeholder message from an optimistic update is still present but the new
    // message is not from the current user, then add the new message but don't touch the
    // placeholder. 
    expect(reducer({
        isLoading: false,
        isShowingSnackbar: false,
        conversation: withOptimisticPlaceholder
    }, {
        type: actionTypes.addMessage,
        payload: {
            conversationId: fullConversation._id,
            currentConversationId: fullConversation._id,
            message: message2,
            isOwnMessage: false,
        }
    }))
    .toEqual({
        isLoading: false,
        isShowingSnackbar: false,
        conversation: withOptimisticPlaceholderAndNewMessage
    });
});

it('handles updateLastViewed', () => {
    const newISO = new Date().toISOString();
    const expectedParticipantsLastViewed = [
        {
            _id: '30',
            user: user1,
            lastViewed: newISO,
        },
        {
            _id: '31',
            user: user2,
            lastViewed: '2019-12-13T13:08:47.115Z',
        }
    ];

    expect(reducer({
        isLoading: false,
        isShowingSnackbar: false,
        conversation: fullConversation
    }, {
        type: actionTypes.updateLastViewed,
        payload: {
            conversationId: fullConversation._id,
            currentConversationId: fullConversation._id,
            userId: user1._id,
            timestamp: newISO
        }
    }))
    .toEqual({
        isLoading: false,
        isShowingSnackbar: false,
        conversation: {
            ...fullConversation,
            participantsLastViewed: expectedParticipantsLastViewed
        }
    });
});

it('handles showSnackbar', () => {
    expect(reducer(
        initialState,
        { type: actionTypes.showSnackbar }
    ))
    .toEqual({
        isLoading: false,
        isShowingSnackbar: true,
        conversation: null
    });
});

it('handles hideSnackbar', () => {
    expect(reducer(
        initialState,
        { type: actionTypes.hideSnackbar }
    ))
    .toEqual({
        isLoading: false,
        isShowingSnackbar: false,
        conversation: null
    });
});

it('handles addOptimisticMessagePlaceholder', () => {
    const optimisticPlaceholder = {
        ...message1,
        _id: optimisticMessagePlaceholderId
    };
    expect(reducer({
        isLoading: false,
        isShowingSnackbar: false,
        conversation: fullConversation
    }, {
        type: actionTypes.addOptimisticMessagePlaceholder,
        payload: {
            message: optimisticPlaceholder
        }
    }))
    .toEqual({
        isLoading: false,
        isShowingSnackbar: false,
        conversation: {
            ...fullConversation,
            messages: [
                ...fullConversation.messages,
                optimisticPlaceholder
            ]
        }
    });
});

it('handles revertOptimisticMessagePlaceholder', () => {
    expect(reducer({
        isLoading: false,
        isShowingSnackbar: false, 
        conversation: {
            ...fullConversation,
            messages: [
                ...fullConversation.messages,
                {
                    ...message1,
                    _id: optimisticMessagePlaceholderId
                }
            ]
        }
    }, {
        type: actionTypes.revertOptimisticMessagePlaceholder
    }))
    .toEqual({
        isLoading: false,
        isShowingSnackbar: false,
        conversation: fullConversation
    });
});