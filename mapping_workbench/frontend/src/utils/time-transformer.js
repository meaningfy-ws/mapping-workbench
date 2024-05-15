import moment from "moment-timezone";

const timeTransformer = (date, timeSetting) => {
    if(!date)
        return '-'
    const format = 'YYYY-MM-DD HH:mm:ss'
    if(timeSetting === 'luxembourg') {
        const luxembourgDate = moment(date).tz('Europe/Luxembourg');
        return luxembourgDate.format(format)
    }
    return moment(date).format(format)
}

export default timeTransformer