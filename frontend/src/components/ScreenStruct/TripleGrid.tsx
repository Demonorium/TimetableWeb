import {Box, Grid, GridSize, Paper} from "@mui/material";
import * as React from "react";

interface TripleGridProps {
    leftMenu?: any;
    rightMenu?: any;
    children?: any;
    fill?: boolean;
    containerRef?: any;
}
interface SideGridProps {
    xs: GridSize;
    fill: boolean;
    content?: any;
}

function SideGrid({xs, fill, content}: SideGridProps) {
    if ((content == undefined) && fill) {
        return null;
    }

    return (
        <Grid item xs={xs} sx={{paddingTop: "0px!important"}}>
            <Paper color="main" sx={{marginTop: "16px"}}>
                {content}
            </Paper>
        </Grid>
    );
}

export function TripleGrid({leftMenu, rightMenu, children, containerRef, fill = true}: TripleGridProps) {
    const center = (6 + (fill ?
        ((leftMenu == undefined ? 3 : 0)
        + (rightMenu == undefined ? 3 : 0))
        : 0)) as GridSize;

    return (
        <Grid container spacing={2} sx={{height: '100%', marginTop: '0'}}>

            <SideGrid xs={3} fill={fill} content={leftMenu}/>

            <Grid item xs={center} sx={{height: "100%", paddingTop: '0!important'}}>
                <Box ref={containerRef} sx={{
                    width: '100%', height: '100%',
                    overflow: 'auto',
                    padding: '0', margin: '0'
                }}>

                    {children}
                </Box>
            </Grid>

            <SideGrid xs={3} fill={fill} content={rightMenu}/>
        </Grid>
    );
}