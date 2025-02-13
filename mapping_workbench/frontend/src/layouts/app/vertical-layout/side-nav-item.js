import {useEffect, useState} from 'react';
import PropTypes from 'prop-types';

import ChevronDownIcon from '@untitled-ui/icons-react/build/esm/ChevronDown';
import ChevronRightIcon from '@untitled-ui/icons-react/build/esm/ChevronRight';

import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import SvgIcon from '@mui/material/SvgIcon';
import Collapse from '@mui/material/Collapse';
import ButtonBase from '@mui/material/ButtonBase';

import {RouterLink} from 'src/components/router-link';

export const SideNavItem = (props) => {
    const {
        active,
        children,
        depth = 0,
        disabled,
        external,
        icon,
        label,
        open: openProp,
        path,
        title,
        small,
        parentId
    } = props;
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setOpen(!!openProp);
    }, [openProp]);

    const handleToggle = () => setOpen(prevOpen => !prevOpen);


    // Icons can be defined at top level only, deep levels have bullets instead of actual icons.

    let startIcon;

    if (depth < 2) {
        startIcon = icon;
    } else {
        startIcon = (
            <Box
                sx={{
                    alignItems: 'center',
                    display: 'center',
                    height: 20,
                    justifyContent: 'center',
                    width: 20
                }}
            >
                <Box
                    sx={{
                        backgroundColor: 'var(--nav-item-icon-color)',
                        borderRadius: '50%',
                        height: 4,
                        opacity: 0,
                        width: 4,
                        ...(active && {
                            backgroundColor: 'var(--nav-item-icon-active-color)',
                            height: 6,
                            opacity: 1,
                            width: 6
                        })
                    }}
                />
            </Box>
        );
    }

    const offset = (depth + 1) * 16

    // Branch

    if (children) {
        return (
            <li>
                <Tooltip title={small && title}
                         placement='right'>
                    <ButtonBase
                        id={['nav', ...title.toLowerCase().split(' ')].join('_')}
                        disabled={disabled}
                        onClick={handleToggle}
                        sx={{
                            alignItems: 'center',
                            borderRadius: 1,
                            display: 'flex',
                            justifyContent: 'flex-start',
                            pl: `${offset}px`,
                            pr: '16px',
                            py: '6px',
                            textAlign: 'left',
                            width: '100%',
                            ...(active && {
                                ...(depth === 0 && {
                                    backgroundColor: 'var(--nav-item-active-bg)'
                                })
                            }),
                            '&:hover': {
                                backgroundColor: 'var(--nav-item-hover-bg)'
                            },
                        }}
                    >
                        {startIcon && (
                            <Box
                                component="span"
                                sx={{
                                    alignItems: 'center',
                                    color: 'var(--nav-item-icon-color)',
                                    display: 'inline-flex',
                                    justifyContent: 'center',
                                    mr: 2,
                                    ...(active && {
                                        color: 'var(--nav-item-icon-active-color)'
                                    })
                                }}
                            >
                                {startIcon}
                            </Box>
                        )}
                        {!small && <Box
                            component="span"
                            sx={{
                                color: 'var(--nav-item-color)',
                                flexGrow: 1,
                                fontFamily: (theme) => theme.typography.fontFamily,
                                fontSize: depth > 0 ? 13 : 14,
                                fontWeight: depth > 0 ? 500 : 600,
                                lineHeight: '24px',
                                whiteSpace: 'nowrap',
                                ...(active && {
                                    color: 'var(--nav-item-active-color)'
                                }),
                                ...(disabled && {
                                    color: 'var(--nav-item-disabled-color)'
                                })
                            }}
                        >
                            {title}
                        </Box>}
                        <SvgIcon
                            sx={{
                                color: 'var(--nav-item-chevron-color)',
                                fontSize: 16,
                                ml: 2
                            }}
                        >
                            {open ? <ChevronDownIcon/> : <ChevronRightIcon/>}
                        </SvgIcon>
                    </ButtonBase>
                </Tooltip>
                <Collapse
                    in={open}
                    sx={{mt: 0.5}}
                >
                    {children}
                </Collapse>
            </li>
        );
    }

    // Leaf

    const linkProps = path
        ? external
            ? {
                component: 'a',
                href: path,
                target: '_blank'
            }
            : {
                component: RouterLink,
                href: path
            }
        : {};

    return (
        <li>
            <Tooltip title={small && title}
                     placement='right'>
                <ButtonBase
                    id={['nav', ...title.toLowerCase().split(' ')].join('_')}
                    disabled={disabled}
                    sx={{
                        alignItems: 'center',
                        borderRadius: 1,
                        display: 'flex',
                        justifyContent: small ? 'center' : 'flex-start',
                        pl: `${16 + offset}px`,
                        pr: '16px',
                        py: '6px',
                        textAlign: 'left',
                        width: '100%',
                        ...(active && {
                            ...(depth >= -1 && {
                                borderTopRightRadius: 0,
                                borderBottomRightRadius: 0,
                                paddingRight: '12px',
                                borderRight: '4px solid var(--nav-item-icon-active-color)',

                            })
                        }),
                        '&:hover': {
                            backgroundColor: 'var(--nav-item-hover-bg)'
                        }
                    }}
                    {...linkProps}>
                    {startIcon && (
                        <Box
                            component="span"
                            sx={{
                                alignItems: 'center',
                                color: 'var(--nav-item-icon-color)',
                                display: 'inline-flex',
                                justifyContent: 'center',
                                mr: small ? 0 : 2,
                                ...(active && {
                                    color: 'var(--nav-item-icon-active-color)'
                                })
                            }}
                        >
                            {startIcon}
                        </Box>
                    )}
                    {!small && <Box
                        component="span"
                        sx={{
                            color: 'var(--nav-item-color)',
                            flexGrow: 1,
                            fontFamily: (theme) => theme.typography.fontFamily,
                            fontSize: depth > 0 ? 13 : 14,
                            fontWeight: depth > 0 ? 500 : 600,
                            lineHeight: '24px',
                            whiteSpace: 'nowrap',
                            ...(active && {
                                color: 'var(--nav-item-active-color)'
                            }),
                            ...(disabled && {
                                color: 'var(--nav-item-disabled-color)'
                            })
                        }}
                    >
                        {title}
                    </Box>}
                    {label && (
                        <Box
                            component="span"
                            sx={{ml: 2}}
                        >
                            {label}
                        </Box>
                    )}
                </ButtonBase>
            </Tooltip>
        </li>
    );
};

SideNavItem.propTypes = {
    active: PropTypes.bool,
    children: PropTypes.node,
    depth: PropTypes.number,
    disabled: PropTypes.bool,
    external: PropTypes.bool,
    icon: PropTypes.node,
    label: PropTypes.node,
    open: PropTypes.bool,
    path: PropTypes.string,
    title: PropTypes.string.isRequired
};
