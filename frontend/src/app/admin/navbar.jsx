import cx from 'clsx';
import { useState } from 'react';
import {
    IconLogout,
    IconHeart,
    IconStar,
    IconMessage,
    IconSettings,
    IconPlayerPause,
    IconTrash,
    IconSwitchHorizontal,
    IconChevronDown,
} from '@tabler/icons-react';
import classes from './navbar.module.css';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

const user = {
    name: 'Jane Spoonfighter',
    email: 'janspoon@fighter.dev',
    image: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-5.png',
};

const tabs = [
    'Home',
    'Orders',
    'Education',
    'Community',
    'Forums',
    'Support',
    'Account',
    'Helpdesk',
];

function AdminNavbar() {
    const [opened, setOpened] = useState(false);
    const [userMenuOpened, setUserMenuOpened] = useState(false);
    const [currentUser, setCurrentUser] = useState(
        typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem('admin')) : null
    );
    const [activeTab, setActiveTab] = useState(tabs[0]);

    const items = tabs.map((tab) => (
        <TabsTrigger value={tab} key={tab} onClick={() => setActiveTab(tab)}>
            {tab}
        </TabsTrigger>
    ));

    return (
        <div className={classes.header}>
            <div className={classes.mainSection}>
                <Button
                    variant="outline"
                    size="icon"
                    className={classes.burger}
                    onClick={() => setOpened((o) => !o)}
                >
                    {opened ? '✕' : '☰'}
                </Button>
                {currentUser && (
                    <DropdownMenu open={userMenuOpened} onOpenChange={setUserMenuOpened}>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className={classes.user}>
                                <Avatar className={classes.userAvatar}>
                                    <AvatarImage src={user.image} alt={user.name} />
                                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                                </Avatar>
                                <span className={classes.userName}>{user.name}</span>
                                <IconChevronDown className={classes.userChevron} />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className={classes.userDropdown}>
                            <DropdownMenuItem>
                                <IconHeart className={classes.userDropdownIcon} /> Liked posts
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <IconStar className={classes.userDropdownIcon} /> Saved posts
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <IconMessage className={classes.userDropdownIcon} /> Your comments
                            </DropdownMenuItem>
                            <DropdownMenuLabel>Settings</DropdownMenuLabel>
                            <DropdownMenuItem>
                                <IconSettings className={classes.userDropdownIcon} /> Account settings
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <IconSwitchHorizontal className={classes.userDropdownIcon} /> Change account
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <IconLogout className={classes.userDropdownIcon} /> Logout
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>Danger zone</DropdownMenuLabel>
                            <DropdownMenuItem>
                                <IconPlayerPause className={classes.userDropdownIcon} /> Pause subscription
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                                <IconTrash className={classes.userDropdownIcon} /> Delete account
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>
            <div className={classes.tabsContainer}>
                <Tabs value={activeTab} onValueChange={setActiveTab} className={classes.tabs}>
                    <TabsList className={classes.tabsList}>{items}</TabsList>
                </Tabs>
            </div>
        </div>
    );
}

export default AdminNavbar;