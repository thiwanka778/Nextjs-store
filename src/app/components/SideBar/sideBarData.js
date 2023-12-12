import AcUnitIcon from '@mui/icons-material/AcUnit';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AlignVerticalBottomIcon from '@mui/icons-material/AlignVerticalBottom';
import AirplaneTicketIcon from '@mui/icons-material/AirplaneTicket';
import AppShortcutIcon from '@mui/icons-material/AppShortcut';
import ArticleIcon from '@mui/icons-material/Article';
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import StorefrontIcon from '@mui/icons-material/Storefront';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';

export default [
    {
        title:"Home",
        icon: <HomeIcon/>,
        path:"/"
    },
{
    title:"Dashboard",
    icon: <DashboardIcon/>,
    path:"/user-dashboard"
},
{
    title:"Store",
    icon: <StorefrontIcon />,
    children:[
        {
            title:"Create Store",
            icon: <AddCircleIcon/>,
            path:"/create-store"
        },
        {
            title:"Edit Store",
            icon: <BorderColorIcon/>,
            path:"/edit-store"
        },
    ]
},




]