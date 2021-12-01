import * as React from 'react';
import {useState} from 'react';
import {AppBar, Box, Container, Divider, IconButton, Menu, MenuItem, Toolbar, Typography} from "@mui/material";
import {useAppDispatch, useAppSelector} from "../store/hooks";
import {logoutUser} from "../store/user";
import {AccountCircle} from "@material-ui/icons";
import ProfileDialog from "./modals/ProfileDialog";
import {resetMaps} from "../store/sourceMap";
import {GlobalState, setAppState} from "../store/appStatus";

export interface HeaderProps {
    headerRef: any;
    serviceName: String
}

export default function Header({headerRef, serviceName}: HeaderProps) {
    const dispatch = useAppDispatch();
    const user = useAppSelector(state => state.user);

    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorElUser);

    const [profEdit, setProfEdit] = useState(false);


    const handleCloseNavMenu = () => {
        setAnchorElUser(null);
    };

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const renderMenu = (
        <Menu
            sx={{ mt: '45px' }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            aria-expanded={open ? 'true' : undefined}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={open}
            onClose={handleCloseNavMenu}
        >
            <MenuItem onClick={() => {
                setProfEdit(true);
                handleCloseNavMenu();
            }}>
                <Typography textAlign="center">Настройки профиля</Typography>
            </MenuItem>
            <Divider/>
            <MenuItem onClick={() => {
                dispatch(logoutUser());
                dispatch(setAppState(GlobalState.LOADING));
                dispatch(resetMaps());

                handleCloseNavMenu();
            }}>
                <Typography textAlign="center" color="error">Выйти</Typography>
            </MenuItem>
        </Menu>
    );

    return (
        <AppBar position="relative" color="default" sx={{flex: "none"}} ref={headerRef}>
            <ProfileDialog open={profEdit} onClose={() => setProfEdit(false)}/>
            <Container maxWidth="xl" sx={{p:0}}>
                <Toolbar>
                    <Typography variant="h5" color="primary" component="div" sx={{ flexGrow: 1 }} noWrap>
                        {serviceName}
                    </Typography>

                    <Box sx={{ display: "flex",  height: "100%", flexGrow: 0 }} onClick={handleMenu}>
                        <Typography variant="h5" color="primary" noWrap component="div" sx={{ flexGrow: 1, margin: "auto"}}>
                            {user.username}
                        </Typography>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            sx={{ flexGrow: 0 }}
                            color="inherit"
                        >
                            <AccountCircle />
                        </IconButton>
                    </Box>
                    {renderMenu}
                </Toolbar>
            </Container>
        </AppBar>
    );
}