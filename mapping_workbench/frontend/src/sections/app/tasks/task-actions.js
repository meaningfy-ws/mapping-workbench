import {Fragment} from "react";
import PropTypes from "prop-types";

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import InfoIcon from "@mui/icons-material/Info";

import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {useTheme} from "@mui/material/styles";

export const taskProgressStatus = {
    QUEUED: "QUEUED",
    RUNNING: "RUNNING",
    FINISHED: "FINISHED",
    TIMEOUT: "TIMEOUT",
    FAILED: "FAILED",
    CANCELED: "CANCELED"
}

export const mapStatusColor = (task_status) => {
    switch (task_status) {
        case taskProgressStatus.RUNNING:
            return "warning"
        case taskProgressStatus.FINISHED:
            return "success"
        case taskProgressStatus.TIMEOUT:
        case taskProgressStatus.FAILED:
        case taskProgressStatus.CANCELED:
            return "error"
        default:
            return "info"
    }
}

  const MapStatusIcon = ({task_status}) => {
      const color = mapStatusColor(task_status)
      switch (task_status) {
          case taskProgressStatus.RUNNING:
              return <RadioButtonCheckedIcon color={color}/>
          case taskProgressStatus.FINISHED:
              return <CheckCircleOutlineIcon color={color}/>
          case taskProgressStatus.TIMEOUT:
          case taskProgressStatus.FAILED:
          case taskProgressStatus.CANCELED:
              return <HighlightOffIcon color={color}/>
          default:
              return <InfoIcon color={color}/>
      }
  }

const progressStepColor = (stepStatus, palette) => {
    switch (stepStatus) {
        case taskProgressStatus.FINISHED:
            return palette.success.dark
        case taskProgressStatus.RUNNING:
            return palette.warning.main
        default:
            return palette.grey[400]
    }
}

const getProgressElement = (arr, index) => {
    return (index >= 0 && index < arr.length) ? arr[index] : {};
};

export const TaskLine = ({item}) => {
    const theme = useTheme()

    if (!item.progress) {
        return;
    }
    const actions = item.progress.actions
    const actionsCount = Array.from({length: item.progress.actions_count}, (_, i) => i);

    return (actionsCount?.map(actionIdx => {
        const action = getProgressElement(actions, actionIdx);

        const steps = action != null ? action.steps : [];
        const stepsCount = Array.from({length: action != null ? action.steps_count : 0}, (_, i) => i);

        return (
            <Stack
                direction='row'
                justifyContent='space-between'
                gap={1}
                marginTop={1}
                key={'task_action_' + actionIdx}
            >
                {stepsCount?.map(stepIdx => {
                    const step = getProgressElement(steps, stepIdx);
                    const stepStatus = step?.status ?? taskProgressStatus.QUEUED

                    return (<span
                        key={'task_action_step_' + actionIdx + '_' + stepIdx}
                        style={{
                            height: 3,
                            flexGrow: 1,
                            backgroundColor: progressStepColor(stepStatus, theme.palette)
                        }}
                    />)
                })}
            </Stack>
        );
    }))
}

export const TaskActions = ({item}) => {
    const theme = useTheme()

    if (!item.progress) {
        return;
    }
    const actions = item.progress.actions
    const actionsCount = Array.from({length: item.progress.actions_count}, (_, i) => i);

    return (
        <Stack gap={2}
               sx={{m: 2}}
        >
            {actionsCount?.map(actionIdx => {
                const action = getProgressElement(actions, actionIdx);
                const actionName = action != null ? action.name : "";
                const steps = action != null ? action.steps : [];
                const stepsCount = Array.from({length: action != null ? action.steps_count : 0}, (_, i) => i);
                return (
                    <Fragment key={'action' + actionIdx}>
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
                            <MapStatusIcon task_status={item.task_status}/>
                        </Stack>

                        <Stack>
                            {stepsCount?.map((stepIdx) => {
                                const step = getProgressElement(steps, stepIdx);
                                const stepStatus = step.status ?? taskProgressStatus.QUEUED
                                const stepName = step.name ?? ""
                                return (
                                    <Typography
                                        key={'step' + stepIdx}
                                        color={progressStepColor(stepStatus, theme.palette)}>
                                        {stepName}
                                    </Typography>)
                            })}
                        </Stack>
                    </Fragment>)
            })}
        </Stack>
    )
}


TaskActions.propTypes = {
    item: PropTypes.object
}
