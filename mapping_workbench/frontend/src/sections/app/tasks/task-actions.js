import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import {taskStatuses as taskStatus} from "./list-table";

export const taskProgressStatus = {
    QUEUED: "QUEUED",
    RUNNING: "RUNNING",
    FINISHED: "FINISHED",
    TIMEOUT: "TIMEOUT",
    FAILED: "FAILED",
    CANCELED: "CANCELED"
}

const progressStepColor = (stepStatus) => {
    switch (stepStatus) {
        case taskProgressStatus.FINISHED:
            return '#0B815A';
        case taskProgressStatus.RUNNING:
            return '#F79009';
        default:
            return 'gray';
    }
}

const taskStructure = [{
    name: 'action1',
    steps: [{name: "step1", is_finished: true}, {name: "step2", is_finished: true}, {
        name: "step3",
        is_finished: true
    }]
},
    {
        name: 'action2',
        steps: [{name: "step1", is_finished: true}, {name: "step2", is_finished: true}, {
            name: "step3",
            is_finished: false
        }]
    },
    {
        name: 'action3action3action3',
        steps: [{name: "step1", is_finished: true}, {name: "step2", is_finished: false}, {
            name: "step3",
            is_finished: false
        }]
    }
]

const getProgressElement = (arr, index) => {
    return (index >= 0 && index < arr.length) ? arr[index] : null;
};


export const TaskLine = ({item}) => {
    const actions = item.progress.actions
    let actionsCount = Array.from({length: item.progress.actions_count}, (_, i) => i);

    return (actionsCount && actionsCount.map((actionIdx) => {
        const action = getProgressElement(actions, actionIdx);

        const steps = action != null ? action.steps : [];
        let stepsCount = Array.from({length: action != null ? action.steps_count : 0}, (_, i) => i);

        return (
            <Stack
                direction='row'
                justifyContent='space-between'
                gap={1}
                marginTop={1}
                key={'task_action_' + actionIdx}
            >
                {stepsCount && stepsCount.map((stepIdx) => {
                    const step = getProgressElement(steps, stepIdx);
                    let stepStatus = step != null ? step.status : taskProgressStatus.QUEUED
                    return (<span
                        key={'task_action_step_' + actionIdx + '_' + stepIdx}
                        style={{
                            height: 3,
                            flexGrow: 1,
                            backgroundColor: progressStepColor(stepStatus)
                        }}
                    />)
                })}
            </Stack>
        );
    }))
}

export const TaskActions = ({item}) => {
    const actions = item.progress.actions
    let actionsCount = Array.from({length: item.progress.actions_count}, (_, i) => i);

    return (
        <Stack gap={2}
               sx={{m: 2}}
        >
            {actionsCount && actionsCount.map((actionIdx) => {
                const action = getProgressElement(actions, actionIdx);
                const actionName = action != null ? action.name : "";
                const steps = action != null ? action.steps : [];
                let stepsCount = Array.from({length: action != null ? action.steps_count : 0}, (_, i) => i);
                return (<>
                    <Stack gap={2}
                           direction='row'
                           alignItems='center'>

                        <Stack justifyContent='space-between'
                               direction='row'
                               sx={{flex: '0 0 calc(100% - 35px)'}}
                               gap={2}
                               alignItems='center'>
                            <Typography variant="h6">
                                {actionName}
                            </Typography>
                        </Stack>
                        {
                            item.task_status === taskStatus.RUNNING ?
                                <RadioButtonCheckedIcon color='warning'/> :
                                <CheckCircleOutlineIcon color='success'/>
                        }
                    </Stack>
                    <Stack>
                        {stepsCount && stepsCount.map((stepIdx) => {
                            const step = getProgressElement(steps, stepIdx);
                            let stepStatus = step != null ? step.status : taskProgressStatus.QUEUED
                            let stepName = step != null ? step.name : ""
                            return (<Typography
                                color={progressStepColor(stepStatus)}>
                                {stepName}
                            </Typography>)
                        })}
                    </Stack>
                </>)
            })}
        </Stack>
    )
}
