import React from 'react'
import { Link } from 'react-router-dom'
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';


export default function MenuItem({ name, children }) {
    // const classes = useStyles();
    const [expanded, setExpanded] = React.useState([]);

    const handleChange = (event, nodes) => {
        setExpanded(nodes);
        console.log(event)
    };

    console.log(children)

    return (
        <TreeView
            className={'classes.root'}
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
            expanded={expanded}
            onNodeToggle={handleChange}
        >
            <Link>
                <TreeItem nodeId={name} label={name}>
                    {children && children.map((child, index) => <MenuItem {...child} key={index} />)}
                </TreeItem>
            </ Link>
        </TreeView>
    )
}