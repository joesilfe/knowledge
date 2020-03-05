import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';


export default function MenuItem({ id, name, children }) {
    // const classes = useStyles();
    const [expanded, setExpanded] = useState([]);

    const handleChange = (event, nodes) => {
        setExpanded(nodes);
    }

    return (
        <TreeView
            className={'classes.root'}
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
            expanded={expanded}
            onNodeToggle={handleChange}
        >
            <Link to={`/articlesByCategory/${id}/articles`}>
                <TreeItem nodeId={name} label={name}>
                    {children && children.map((child, index) => <MenuItem {...child} key={index} />)}
                </TreeItem>
            </Link>
        </TreeView>
    )
}