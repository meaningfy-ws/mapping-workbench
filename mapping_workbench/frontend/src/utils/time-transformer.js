import {useGlobalState} from "../hooks/use-global-state";
import moment from "moment-timezone";

const TimeTransformer = ({date}) => {
    const {timeSetting} = useGlobalState()
    const format = 'YYYY-MM-DD HH:mm:ss'
    if(timeSetting === 'luxembourg') {
        const luxembourgDate = moment(date).tz('Europe/Luxembourg'); // Example date
        return <>{luxembourgDate.format(format)}</>
    }
    return <>{moment(date).format(format)}</>

}

export default TimeTransformer