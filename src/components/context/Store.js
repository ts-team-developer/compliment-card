import React, { createContext } from 'react';

export const NameContext = createContext({
    userInfo : {
        email : '',
        name : '',
        token : ''
    },
    quarterInfo : {
        quarter : '',
        isClosed : 'Y',
        isRecClosed : 'Y',
        status : 'E'
    },
    menuList : [

    ]
});

const Store = (props) => {
    const [userInfo, setUserInfo] = React.useState({});
    const [quarterInfo, setQuarterInfo] = React.useState({});
    const [menuList, setMenuList] = React.useState([]);

    return (
        <NameContext.Provider value={{userInfo, quarterInfo, menuList}}>
            {props.children}
        </NameContext.Provider>
    )
}

export default Store;