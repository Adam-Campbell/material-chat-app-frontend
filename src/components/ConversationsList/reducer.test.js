import { reducer, actionTypes, initialState } from './reducer';
import { conversationSummary1, conversationSummary2 } from '../../mockData';

it('returns the initial state', () => {
    expect(reducer(initialState, {})).toEqual(initialState);
});

it('handles fetchConversations', () => {
    expect(reducer(
        initialState,
        { type: actionTypes.fetchConversations }
    ))
    .toEqual({
        isLoading: true,
        hasLoaded: false,
        isShowingSnackbar: false,
        conversations: []
    });
});

it('handles storeConversations', () => {
    expect(reducer({
        isLoading: true,
        hasLoaded: false,
        isShowingSnackbar: false,
        conversations: []
    }, {
        type: actionTypes.storeConversations,
        payload: {
            conversations: [
                conversationSummary2,
                conversationSummary1
            ]
        }
    }))
    .toEqual({
        isLoading: false,
        hasLoaded: true, 
        isShowingSnackbar: false,
        conversations: [
            conversationSummary2,
            conversationSummary1
        ]
    });
});

it('handles storeOneConversation', () => {
    expect(reducer({
        isLoading: false,
        hasLoaded: true,
        isShowingSnackbar: false,
        conversations: [
            conversationSummary1
        ]
    }, {
        type: actionTypes.storeOneConversation,
        payload: {
            conversation: conversationSummary2
        }
    }))
    .toEqual({
        isLoading: false,
        hasLoaded: true, 
        isShowingSnackbar: false,
        conversations: [
            conversationSummary2,
            conversationSummary1
        ]
    });
});

it('handles updateConversationActivity', () => {
    const newLatestActivity = new Date().toISOString();
    expect(reducer({
        isLoading: false,
        hasLoaded: true, 
        isShowingSnackbar: false,
        conversations: [
            conversationSummary2,
            conversationSummary1
        ]
    }, {
        type: actionTypes.updateConversationActivity,
        payload: {
            conversationId: conversationSummary1._id,
            latestActivity: newLatestActivity
        }
    }))
    .toEqual({
        isLoading: false,
        hasLoaded: true,
        isShowingSnackbar: false,
        conversations: [
            {
                ...conversationSummary1,
                latestActivity: newLatestActivity
            },
            conversationSummary2
        ]
    });
});

it('handles showSnackbar', () => {
    expect(reducer(
        {
            isLoading: false,
            hasLoaded: true,
            isShowingSnackbar: false,
            conversations: [ conversationSummary1 ]
        },
        { type: actionTypes.showSnackbar }
    ))
    .toEqual({
        isLoading: false,
        hasLoaded: true,
        isShowingSnackbar: true,
        conversations: [ conversationSummary1 ]
    });
});

it('handles hideSnackbar', () => {
    expect(reducer(
        {
            isLoading: false,
            hasLoaded: true,
            isShowingSnackbar: true,
            conversations: [ conversationSummary1 ]
        },
        { type: actionTypes.hideSnackbar }
    ))
    .toEqual({
        isLoading: false,
        hasLoaded: true,
        isShowingSnackbar: false,
        conversations: [ conversationSummary1 ]
    });
});

