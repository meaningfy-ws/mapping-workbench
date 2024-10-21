import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';

const taskStructure = [{
    actionname: 'action1',
    steps: [{stepname: "step1", is_finished: true}, {stepname: "step2", is_finished: true}, {
        stepname: "step3",
        is_finished: true
    }]
},
    {
        actionname: 'action2',
        steps: [{stepname: "step1", is_finished: true}, {stepname: "step2", is_finished: true}, {
            stepname: "step3",
            is_finished: false
        }]
    },
    {
        actionname: 'action3action3action3',
        steps: [{stepname: "step1", is_finished: true}, {stepname: "step2", is_finished: false}, {
            stepname: "step3",
            is_finished: false
        }]
    }
]


export const TaskLine = ({item}) => {
    const isAllTaskFinished = !taskStructure.map(task =>
        task.steps.some(step => !step.is_finished)).some(task => !!task)
    return (
        <Stack direction='row'
               justifyContent='space-between'
               gap={1}
               marginTop={1}>
            {taskStructure.map((task, key) => {
                const isSomeUnfinishedStep = task.steps.some(step => !step.is_finished)
                return <span key={'task' + key}
                             style={{
                                 height: 3,
                                 flexGrow: 1,
                                 backgroundColor: isAllTaskFinished ? '#0B815A' : isSomeUnfinishedStep ? 'gray' : '#F79009'
                             }}/>
            })}
        </Stack>
    )
}

export const TaskActions = ({item}) => {
    return (
        <Stack gap={2}
               sx={{m: 2}}
        >
            {taskStructure.map(task => {
                    const isActiveTask = task.steps.some(step => !step.is_finished)

                    return (<>
                        <Stack gap={2}
                               direction='row'
                               alignItems='center'>
                            {isActiveTask ? <RadioButtonCheckedIcon color='warning'/> :
                                <CheckCircleOutlineIcon color='success'/>}

                            <Stack justifyContent='space-between'
                                   direction='row'
                                   sx={{flex: '0 0 calc(100% - 35px)'}}
                                   gap={2}
                                   alignItems='center'>
                                <Typography variant="h6">
                                    {task.actionname}
                                </Typography>
                            </Stack>
                        </Stack>
                        <Stack>
                            {task.steps.map(step => <Typography
                                color={isActiveTask ?
                                    step.is_finished ? '#F79009' : 'gray' : '#0B815A'}>
                                {step.stepname}
                            </Typography>)}
                        </Stack>
                    </>)
                }
            )}
        </Stack>
    )
}
