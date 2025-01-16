import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import {legendClasses, PieChart} from '@mui/x-charts';

export const StatePieChart = ({items}) => {
    return <PieChart
                sx={{
                    [`& .${legendClasses.mark}`]: {
                        ry: 10,
                    },
                }}
                slotProps={{
                    legend: {
                        direction: 'row',
                        position: {vertical: 'bottom', horizontal: 'middle'},
                        itemMarkWidth: 12,
                        itemMarkHeight: 12,
                    }
                }}
                series={[
                    {
                        dataKey: 'value',
                        data: items,
                        innerRadius: 60,
                        outerRadius: 100,
                        cy: 100,
                        cx: 180,
                    }
                ]}
                tooltip={{
                    trigger: 'item',
                    itemContent: (params) => {
                        const data = params.series.data[params.itemData.dataIndex]
                        return (
                            <Paper sx={{p: 1}}>
                                <Stack direction='column'>
                                    <strong>{data.itemPercent}%</strong>
                                    <span>{data.data}</span>
                                </Stack>
                            </Paper>
                        );
                    }
                }}
                width={368}
                height={348}/>
}


export const StatePieChartBig = ({items}) => {
    return <PieChart
                sx={{
                    [`& .${legendClasses.mark}`]: {
                        ry: 10,
                    },
                }}
                slotProps={{
                    legend: {
                        direction: 'column',
                        position: {vertical: 'middle', horizontal: 'right'},
                        itemMarkWidth: 12,
                        itemMarkHeight: 12,
                    }
                }}
                series={[
                    {
                        dataKey: 'value',
                        data: items,
                        innerRadius: 50,
                        outerRadius: 90,
                        cy: 100,
                        cx: 100,
                    }
                ]}
                tooltip={{
                    trigger: 'item',
                    itemContent: (params) => {
                        const data = params.series.data[params.itemData.dataIndex]
                        return (
                            <Paper sx={{p: 1}}>
                                <Stack direction='column'>
                                    <strong>{data.itemPercent}%</strong>
                                    <span>{data.data}</span>
                                </Stack>
                            </Paper>
                        );
                    }
                }}
                width={500}
                height={220}/>
}
