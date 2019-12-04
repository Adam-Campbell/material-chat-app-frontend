import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import { searchUsers } from '../../Api';
import { SocketContext } from '../SocketContext';
import socketActions from '../../socketActions';

const useStyles = makeStyles(theme => ({

}));

const UserSearch = ({ value, setValue }) => {

    const classes = useStyles();

    const [ inputValue, setInputValue ] = useState('');
    const [ isLoading, setIsLoading ] = useState(false);
    const [ isOpen, setIsOpen ] = useState(false);
    const [ options, setOptions ] = useState([]);

    const { emit, on } = useContext(SocketContext);

    useEffect(() => {
        const off = on(socketActions.getUsersResponse, data => {
            const { users } = data;
            setOptions(users);
            setIsLoading(false);
        });
        return off;
    }, []);

    useEffect(() => {
        if (inputValue) {
            emit(socketActions.getUsersRequest, inputValue);
        }
    }, [ inputValue ]);

    return (
        <Autocomplete 
            id="my-autocomplete"
            options={options}
            open={Boolean(isOpen && inputValue)}
            onOpen={() => setIsOpen(true)}
            onClose={() => setIsOpen(false)}
            onChange={(e, val) => setValue(val)}
            onInputChange={(e, val) => setInputValue(val)}
            inputValue={inputValue}
            noOptionsText="No matching users"
            value={value}
            getOptionLabel={option => option.username || ''}
            loading={isLoading}
            renderInput={params => <TextField {...params} label="Select user" variant="outlined" fullWidth />}
        />
    );
}

export default UserSearch;