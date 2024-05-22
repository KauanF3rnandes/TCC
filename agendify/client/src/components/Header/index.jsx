import React from "react";
import "./style.css";
import { Avatar, AvatarBadge, AvatarGroup } from '@chakra-ui/react'

const Header = () => {
    return (
        <div className="navBar">
            <div className="user">
                <span>Username</span>
                <Avatar className="avatar-logo" src='https://bit.ly/broken-link' />
            </div>
        </div>
    );
}

export default Header;