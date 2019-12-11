import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { formatTime } from '../../../utils';

const useStyles = makeStyles(theme => ({
    infoContainer: {
        display: 'flex',
        marginLeft: ({ isOwnMessage }) => isOwnMessage ? 'auto' : 0,
        marginRight: ({ isOwnMessage }) => isOwnMessage ? 0 : 'auto'
    },
    usernameText: {
        fontSize: 14,
        marginRight: theme.spacing(1),
    },
    timeCreatedText: {
        fontSize: 14
    },
}));

const InfoRow = ({ username, createdAt, isOwnMessage }) => {

    const { infoContainer, usernameText, timeCreatedText } = useStyles({ isOwnMessage });

    const timeCreated = useMemo(() => {
        return formatTime( new Date( createdAt ) );
    }, [ createdAt ]);

    return (
        <div className={infoContainer}>
            <Typography 
                className={usernameText} 
                component="p" 
                variant="body1" 
                color="textPrimary"
            >{username}</Typography>
            <Typography 
                className={timeCreatedText} 
                component="p" 
                variant="body1" 
                color="textSecondary"
            >{timeCreated}</Typography>
        </div>
    );
};

InfoRow.propTypes = {
    username: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    isOwnMessage: PropTypes.bool.isRequired
};

export default InfoRow;
