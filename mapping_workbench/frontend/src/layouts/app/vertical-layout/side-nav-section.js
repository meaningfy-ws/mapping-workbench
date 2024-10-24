import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import {SideNavItem} from './side-nav-item';
import {useEffect, useState} from "react";

const renderItems = (
    {depth = 0, items, parentId, pathname}
) => items.reduce(
    (acc, item) => reduceChildRoutes({
        acc,
        depth,
        item,
        parentId,
        pathname
    }), []);


const reduceChildRoutes = ({acc, depth, item, parentId, pathname}) => {
    const checkPath = !!(item.path && pathname);
    const partialMatch = checkPath ? pathname.includes(item.path) : false;
    const exactMatch = checkPath ? pathname === item.path : false;
    const childrenPath = item.items?.some(e => e.path === pathname)

    if (item.items) {
        acc.push(
            <SideNavItem
                active={partialMatch}
                depth={depth}
                disabled={item.disabled}
                icon={item.icon}
                key={item.title}
                label={item.label}
                open={partialMatch || childrenPath}
                title={item.title}
                path={item.path}
                parentId={parentId}
            >
                {<Stack
                    component="ul"
                    spacing={0.5}
                    sx={{
                        listStyle: 'none',
                        m: 0,
                        p: 0
                    }}
                >
                    {renderItems({
                        depth: depth + 1,
                        items: item.items,
                        parentId: item.title.toLowerCase(),
                        pathname
                    })}
                </Stack>}
            </SideNavItem>
        );
    } else {
        acc.push(
            <SideNavItem
                active={exactMatch}
                depth={depth - 1}
                disabled={item.disabled}
                external={item.external}
                icon={item.icon}
                key={item.title}
                label={item.label}
                path={item.path}
                title={item.title}
                parentId={parentId}
            />
        );
    }

    return acc;
};

export const SideNavSection = (props) => {
    const {items = [], pathname, subheader = '', ...other} = props;

    return (
        <Stack
            component="ul"
            spacing={0.5}
            sx={{
                listStyle: 'none',
                m: 0,
                p: 0
            }}
            {...other}>
            {subheader && (
                <Box
                    component="li"
                    sx={{
                        color: 'var(--nav-section-title-color)',
                        fontSize: 12,
                        fontWeight: 700,
                        lineHeight: 1.66,
                        mb: 1,
                        ml: 1,
                        textTransform: 'uppercase'
                    }}
                >
                    {subheader}
                </Box>
            )}
            {renderItems({items, pathname})}
        </Stack>
    );
};

SideNavSection.propTypes = {
    items: PropTypes.array,
    pathname: PropTypes.string,
    subheader: PropTypes.string
};
