import { useState } from 'react';

const useHover = () => {
    const [ isHovered, setIsHovered ] = useState(false);

    const containerProps = {
        onMouseEnter: () => {
            setIsHovered(true);
        },
        onMouseLeave: () => {
            setIsHovered(false);
        }
    }

    return {
        isHovered,
        containerProps
    };
};

export default useHover;
