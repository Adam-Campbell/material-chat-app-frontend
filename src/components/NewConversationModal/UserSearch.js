import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import { searchUsers } from '../../Api';

const useStyles = makeStyles(theme => ({

}));

const UserSearch = ({ value, setValue }) => {

    const classes = useStyles();

    const [ inputValue, setInputValue ] = useState('');
    const [ isLoading, setIsLoading ] = useState(false);
    const [ isOpen, setIsOpen ] = useState(false);
    const [ options, setOptions ] = useState([]);

    useEffect(() => {
        (async () => {
            if (inputValue) {
                setIsLoading(true);
                try {
                    const response = await searchUsers(inputValue);
                    setOptions(response.data.users);
                    setIsLoading(false);
                } catch (error) {
                    console.log(error);
                }
            }
        })();
    }, [ inputValue ])

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
