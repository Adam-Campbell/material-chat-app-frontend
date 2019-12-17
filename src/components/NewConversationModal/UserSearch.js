import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import { SocketContext } from '../SocketContext';
import socketActions from '../../socketActions';

const useStyles = makeStyles(theme => ({
    styledInput: {
        width: '100%',
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2)
    }
}));

const UserSearch = ({ value, setValue, hasError, errorText }) => {

    const { styledInput } = useStyles();

    const [ inputValue, setInputValue ] = useState('');
    const [ isLoading, setIsLoading ] = useState(false);
    const [ isOpen, setIsOpen ] = useState(false);
    const [ options, setOptions ] = useState([]);

    const { emit, on } = useContext(SocketContext);

    // Make new request for users data when inputValue changes
    useEffect(() => {
        if (inputValue) {
            emit(socketActions.getUsersRequest, { query: inputValue });
        }
    }, [ inputValue, emit ]);

    // Set up subscription to react to new users data being pushed to the client
    useEffect(() => {
        const off = on(socketActions.getUsersResponse, data => {
            const { users } = data;
            setOptions(users);
            setIsLoading(false);
        });
        return off;
    }, [ on ]);

    return (
        <Autocomplete
            className={styledInput} 
            id="users-autocomplete"
            options={options}
            open={Boolean(isOpen && inputValue)}
            onOpen={() => setIsOpen(true)}
            onClose={() => setIsOpen(false)}
            onChange={(e, val) => setValue(val)}
            onInputChange={(e, val) => setInputValue(val)}
            inputValue={inputValue}
            noOptionsText="No matching users"
            value={value}
            multiple={true}
            getOptionLabel={option => option.username || ''}
            filterOptions={(options, state) => {
                return options.filter(option => !(value.find(el => el._id === option._id)));
            }}
            loading={isLoading}
            renderInput={params => (
                <TextField 
                    {...params} 
                    label="Select user" 
                    variant="outlined" 
                    fullWidth
                    error={hasError}
                    helperText={errorText} 
                />
            )}
        />
    );
}

UserSearch.propTypes = {
    value: PropTypes.arrayOf(PropTypes.object).isRequired,
    setValue: PropTypes.func.isRequired,
    hasError: PropTypes.bool.isRequired,
    errorText: PropTypes.string
};

export default UserSearch;
