const socketActions = {
    // Request response and error actions for each resource that the
    // application is concerned with
    getCurrentUsersConversationsRequest: 'get::currentUsersConverstations::request',
    getCurrentUsersConversationsResponse: 'get::currentUsersConversations::response',
    getCurrentUsersConversationsError: 'get::currentUsersConversations::error',
    getConversationRequest: 'get::conversation::request',
    getConversationResponse: 'get::conversation::response',
    getConversationError: 'get::conversation::error',
    getUsersRequest: 'get::users::request',
    getUsersResponse: 'get::users::response',
    getUsersError: 'get::users::error',
    getCurrentUserRequest: 'get::currentUser::request',
    getCurrentUserResponse: 'get::currentUser::response',
    getCurrentUserError: 'get::currentUser::error',
    // send actions for each resource that the client sends to the server
    sendMessageRequest: 'send::message::request',
    sendMessageResponse: 'send::message::response',
    sendMessageError: 'send::message::error',
    sendConversationRequest: 'send::conversation::request',
    sendConversationResponse: 'send::conversation::response',
    sendConversationError: 'send::conversation::error',
    // push actions for each resource that the server pushes to the client without
    // the client requesting it
    pushConversation: 'push::conversation'
};

export default socketActions;