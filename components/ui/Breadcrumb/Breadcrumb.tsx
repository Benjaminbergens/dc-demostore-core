import React, { useMemo } from 'react';
import { Breadcrumbs, Link } from '@mui/material';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import { NavigationItem, useNavigation } from '@components/core/Masthead';
import { useUserContext } from '@lib/user/UserContext';
import { nanoid } from 'nanoid'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles({
    root: {

    },
    link: {
        textTransform: 'uppercase' as 'uppercase'
    }
});

interface Props {
    className?: string;
    style?: React.CSSProperties;
    
    loading?: boolean;
    navigationItem?: NavigationItem;
}

const Breadcrumb: React.FC<React.PropsWithChildren<Props>> = (props) => {
    const classes = useStyles(props)
    const {
        className,
        navigationItem,
        loading = false,
        ...other
    } = props;

    const {
        findByHref
    } = useNavigation();

    const {
        asPath
    } = useRouter();

    const nodes = useMemo(() => {
        if (navigationItem) {
            return [...navigationItem.parents, navigationItem];
        }
        let url = asPath;
        if (url.indexOf('?') !== -1) {
            url = url.slice(0, url.indexOf('?'));
        }
        if (url.indexOf('#') !== -1) {
            url = url.slice(0, url.indexOf('#'));
        }

        const current = findByHref(url);
        if (current) {
            return [...current.parents, current];
        }
        return [];
    }, [navigationItem, asPath, findByHref]);

    const { language } = useUserContext();

    // NOVADEV-18: Add 'loading' skeleton for breadcrumb and category name on PLP
    return loading ? 
            <Breadcrumbs aria-label="breadcrumb" className={clsx(classes.root, className)} {...other}>
                <Link variant="h4" color="inherit" href="/" className={classes.link}>&nbsp;</Link>
            </Breadcrumbs>
        : 
            <Breadcrumbs aria-label="breadcrumb" className={clsx(classes.root, className)} {...other}>
                <Link variant="h4" color="inherit" href="/" className={classes.link}>
                    { language === "de" ? 'Haupt' : 'Home' }
                </Link>
                {
                    nodes.map(node => {
                        return <Link key={ nanoid() } variant="h4" color="inherit" href={node.href} className={classes.link}>
                            {node.title}
                        </Link>
                    })
                }
            </Breadcrumbs>;
};

export default Breadcrumb