import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Tooltip from '@mui/material/Tooltip';
import {cloneElement} from 'react';

import AlignLeft02 from '../../../icons/ui/duocolor/align-left-02';
import BarChartSquare02 from '../../../icons/ui/duocolor/bar-chart-square-02';
import Building04 from '../../../icons/ui/duocolor/building-04';
import CheckDone01 from '../../../icons/ui/duocolor/check-done-01';
import CreditCard01 from '../../../icons/ui/duocolor/credit-card-01';
import CurrencyBitcoinCircle from '../../../icons/ui/duocolor/currency-bitcoin-circle';
import File01 from '../../../icons/ui/duocolor/file-01';
import GraduationHat01 from '../../../icons/ui/duocolor/graduation-hat-01';
import HomeSmile from '../../../icons/ui/duocolor/home-smile';
import LayoutAlt02 from '../../../icons/ui/duocolor/layout-alt-02';
import LineChartUp04 from '../../../icons/ui/duocolor/line-chart-up-04';
import Lock011 from '../../../icons/ui/duocolor/lock-01-1';
import LogOut01 from '../../../icons/ui/duocolor/log-out-01';
import Mail03 from '../../../icons/ui/duocolor/mail-03';
import MessageChatSquare from '../../../icons/ui/duocolor/message-chat-square';
import ReceiptCheck from '../../../icons/ui/duocolor/receipt-check';
import Share07 from '../../../icons/ui/duocolor/share-07';
import ShoppingBag03 from '../../../icons/ui/duocolor/shopping-bag-03';
import ShoppingCart01 from '../../../icons/ui/duocolor/shopping-cart-01';
import Truck01 from '../../../icons/ui/duocolor/truck-01';
import Upload04 from '../../../icons/ui/duocolor/upload-04';
import Calendar from '../../../icons/ui/duocolor/calendar';
import Users03 from '../../../icons/ui/duocolor/users-03';
import XSquare from '../../../icons/ui/duocolor/x-square';
import XSquare1 from '../../../icons/ui/duocolor/x-square-1';
import File04 from '../../../icons/ui/duocolor/file-04';
import Mail04 from '../../../icons/ui/duocolor/mail-04';
import {Layout as AppLayout} from '../../../layouts/app';

const ICONS = [<AlignLeft02/>,
    <BarChartSquare02/>,
    <Upload04/>,
    <LineChartUp04/>,
    <Truck01/>,
    <MessageChatSquare/>,
    <HomeSmile/>,
    <ReceiptCheck/>,
    <LogOut01/>,
    <Lock011/>,
    <CheckDone01/>,
    <CurrencyBitcoinCircle/>,
    <Calendar/>,
    <ShoppingCart01/>,
    <ShoppingBag03/>,
    <Mail03/>,
    <XSquare1/>,
    <Lock011/>,
    <XSquare/>,
    <File01/>,
    <Building04/>,
    <LayoutAlt02/>,
    <CreditCard01/>,
    <Users03/>,
    <Share07/>,
    <GraduationHat01/>,
    <File04/>,
    <Mail04/>]

const Page = () => {
    return (
        <>
            <Stack direction='row'
                   gap={1}>
                {ICONS.map((icon, idx) => {
                    return <Tooltip title={icon}>
                        <SvgIcon key={idx}
                                 fontSize='large'>
                            {cloneElement(icon, {
                                color: 'red',
                                fill: 'blue'
                            })}
                        </SvgIcon>
                    </Tooltip>
                })}
            </Stack>
        </>
    )


// users-03.js
// share-07.js
// graduation-hat-01.js
// file-04.js
// mail-04.js
}

Page.getLayout = (page) => (
    <AppLayout>
        {page}
    </AppLayout>
);

export default Page;
