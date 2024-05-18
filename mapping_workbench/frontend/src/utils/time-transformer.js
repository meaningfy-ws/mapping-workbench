import moment from "moment-timezone";

const timeTransformer = (date, timeSetting) => {
    if(!date)
        return '-'
    const luxembourgDate = moment(date).tz(timeSetting);
    return luxembourgDate.format('YYYY-MM-DD HH:mm:ss')
}

export default timeTransformer